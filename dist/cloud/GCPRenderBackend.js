// src/cloud/GCPRenderBackend.ts
/**
 * GCP-specific rendering backend
 * Cloud Functions orchestration, Cloud Run workers, GCS storage, Pub/Sub queuing
 */
/**
 * GCP rendering backend with Cloud Functions + Cloud Run + GCS + Pub/Sub
 * Production code would use @google-cloud packages
 */
export class GCPRenderBackend {
    config;
    jobMap = new Map();
    constructor(config) {
        this.config = config;
    }
    /**
     * Get Cloud Run deployment config
     */
    getCloudRunDeploymentConfig() {
        return {
            name: 'ts-manim-render-worker',
            image: this.config.cloudRunImage,
            port: 8080,
            memory: '8Gi',
            cpu: '4',
            timeout: 3600,
            env: [
                { name: 'PROJECT_ID', value: this.config.projectId },
                { name: 'GCS_BUCKET', value: this.config.gcsBucket },
                { name: 'PUBSUB_TOPIC', value: this.config.pubsubTopic }
            ],
            serviceAccount: `render-worker@${this.config.projectId}.iam.gserviceaccount.com`
        };
    }
    /**
     * Get Cloud Function orchestrator code
     */
    getCloudFunctionCode() {
        return `
import { PubSub } from '@google-cloud/pubsub';
import { Storage } from '@google-cloud/storage';
import { CloudRun } from '@google-cloud/run';

const pubsub = new PubSub({ projectId: process.env.PROJECT_ID });
const storage = new Storage({ projectId: process.env.PROJECT_ID });

exports.renderOrchestrator = async (req, res) => {
  const { jobId, totalFrames, sceneData, taskCount = 10 } = req.body;

  console.log(\`Cloud Function: Processing render job \${jobId}\`);

  try {
    // Save scene to GCS
    const bucket = storage.bucket(process.env.GCS_BUCKET);
    const sceneFile = bucket.file(\`jobs/\${jobId}/scene.json\`);

    await sceneFile.save(JSON.stringify(sceneData), {
      metadata: { contentType: 'application/json' }
    });

    // Create render tasks and publish to Pub/Sub
    const topic = pubsub.topic(process.env.PUBSUB_TOPIC);
    const chunkSize = Math.ceil(totalFrames / taskCount);
    const messages = [];

    for (let i = 0; i < totalFrames; i += chunkSize) {
      const taskId = \`\${jobId}-task-\${messages.length}\`;
      const endFrame = Math.min(i + chunkSize, totalFrames);

      const message = {
        jobId,
        taskId,
        frameRange: [i, endFrame],
        sceneUri: \`gs://\${process.env.GCS_BUCKET}/jobs/\${jobId}/scene.json\`,
        outputUri: \`gs://\${process.env.GCS_BUCKET}/jobs/\${jobId}/frames/\${i}-\${endFrame}.tar.gz\`
      };

      const messageId = await topic.publish(
        Buffer.from(JSON.stringify(message)),
        {
          attributes: {
            'jobId': jobId,
            'priority': 'NORMAL'
          }
        }
      );

      messages.push(messageId);
    }

    // Auto-scale Cloud Run instances based on queue depth
    const subscription = pubsub.subscription(\`\${process.env.PUBSUB_TOPIC}-sub\`);
    const [stats] = await subscription.getStats();

    const recommendedInstances = Math.min(
      Math.ceil(stats.numUndeliveredMessages / 10),
      50 // Max 50 instances
    );

    console.log(\`Recommended Cloud Run instances: \${recommendedInstances}\`);

    res.json({
      jobId,
      status: 'submitted',
      taskCount: messages.length,
      messageIds: messages,
      recommendedInstances
    });
  } catch (error) {
    console.error(\`Cloud Function error: \${error.message}\`);
    res.status(500).json({ error: error.message });
  }
};
    `;
    }
    /**
     * Get Cloud Run worker code
     */
    getCloudRunWorkerCode() {
        return `
import express from 'express';
import { PubSub } from '@google-cloud/pubsub';
import { Storage } from '@google-cloud/storage';
import { Readable } from 'stream';

const app = express();
const pubsub = new PubSub({ projectId: process.env.PROJECT_ID });
const storage = new Storage({ projectId: process.env.PROJECT_ID });

app.post('/process', async (req, res) => {
  const message = req.body;
  const { jobId, taskId, frameRange, sceneUri, outputUri } = message;

  console.log(\`Cloud Run: Processing \${taskId} frames \${frameRange[0]}-\${frameRange[1]}\`);

  try {
    // Download scene from GCS
    const bucket = storage.bucket(extractBucket(sceneUri));
    const sceneFile = bucket.file(extractPath(sceneUri));
    const [sceneBuffer] = await sceneFile.download();
    const sceneData = JSON.parse(sceneBuffer.toString());

    // Render frames
    const frames = await renderFrames(sceneData, frameRange[0], frameRange[1]);

    // Create tarball
    const tarballBuffer = await createTarball(frames);

    // Upload to GCS
    const [outputBucket, outputPath] = outputUri.split('/').slice(2, 4);
    const outputFile = storage.bucket(outputBucket).file(outputPath);
    
    await outputFile.save(tarballBuffer, {
      metadata: { contentType: 'application/gzip' }
    });

    res.json({ status: 'completed', taskId });
  } catch (error) {
    console.error(\`Cloud Run error: \${error.message}\`);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(\`Cloud Run worker listening on port \${PORT}\`);
});
    `;
    }
    /**
     * Get Pub/Sub subscription configuration
     */
    getPubSubConfig() {
        return {
            topicName: this.config.pubsubTopic,
            subscriptionName: `${this.config.pubsubTopic}-sub`,
            ackDeadlineSeconds: 600,
            messageRetentionDuration: {
                seconds: 604800 // 7 days
            },
            pushEndpoint: `https://render-worker-xxx.run.app/process`,
            attributes: {
                arn: `projects/${this.config.projectId}/topics/${this.config.pubsubTopic}`
            }
        };
    }
    /**
     * Get GCS lifecycle policy
     */
    getGCSLifecyclePolicy() {
        return {
            lifecycle: {
                rule: [
                    {
                        action: { type: 'Delete' },
                        condition: {
                            age: 7, // Delete frames after 7 days
                            matchesPrefix: ['jobs/']
                        }
                    },
                    {
                        action: { type: 'SetStorageClass', storageClass: 'COLDLINE' },
                        condition: {
                            age: 30,
                            matchesPrefix: ['archive/']
                        }
                    }
                ]
            }
        };
    }
    /**
     * Get IAM role configuration
     */
    getIAMRoles() {
        return {
            serviceAccountEmail: `render-worker@${this.config.projectId}.iam.gserviceaccount.com`,
            roles: [
                'roles/storage.objectAdmin',
                'roles/pubsub.subscriber',
                'roles/logging.logWriter',
                'roles/monitoring.metricWriter'
            ]
        };
    }
    /**
     * Register GCP render job
     */
    registerJob(jobId, cloudFunctionName, cloudRunRevisions, pubsubMessages) {
        this.jobMap.set(jobId, {
            jobId,
            cloudFunctionName,
            cloudRunRevisions,
            gcsPrefix: `jobs/${jobId}`,
            pubsubMessages
        });
    }
    /**
     * Get signed GCS URL for frame download
     */
    getSignedFrameUrl(jobId, frameStart, frameEnd) {
        // Production code would generate actual signed URLs
        const bucket = this.config.gcsBucket;
        const path = `jobs/${jobId}/frames/${frameStart}-${frameEnd}.tar.gz`;
        // Fake signed URL for demo
        return `https://storage.googleapis.com/${bucket}/${path}?X-Goog-Algorithm=...&X-Goog-Credential=...&X-Goog-Expires=...&X-Goog-Signature=...`;
    }
    /**
     * Estimate GCP costs
     */
    estimateGCPCosts(frameCount, taskCount, estimatedFrameTimeMinutes) {
        // Cloud Functions: $0.40 per million invocations
        const cloudFunctionInvocations = (1 * 0.40) / 1000000;
        // Cloud Run: $0.00002400 per vCPU-second, $0.0000025 per GB-second
        // 4 vCPU, 8GB
        const computeSeconds = taskCount * estimatedFrameTimeMinutes * 60;
        const cloudRunCompute = (computeSeconds * 4 * 0.00002400) +
            (computeSeconds * 8 * 0.0000025);
        // GCS Storage: $0.020 per GB for Standard, $0.01 for Nearline
        // Assume 50MB per frame
        const storageMB = frameCount * 50;
        const gcsStorage = (storageMB / 1024) * 0.020;
        // Pub/Sub: $0.05 per GB, $0.40 per million messages
        const pubsubMessages = (taskCount * 0.40) / 1000000;
        return {
            cloudFunctionInvocations,
            cloudRunCompute,
            gcsStorage,
            pubsubMessages,
            total: cloudFunctionInvocations + cloudRunCompute + gcsStorage + pubsubMessages
        };
    }
    /**
     * Compare AWS vs GCP costs
     */
    compareCosts(frameCount, taskCount, estimatedFrameTimeMinutes) {
        // Note: This would require AWSRenderBackend import
        // Simplified comparison for demo
        const awsEstimate = (frameCount * 50 / 1024 * 0.023) + (taskCount * 60 * 4 * 0.04048);
        const gcpCosts = this.estimateGCPCosts(frameCount, taskCount, estimatedFrameTimeMinutes);
        const gcpEstimate = gcpCosts.total;
        return {
            aws: awsEstimate,
            gcp: gcpEstimate,
            difference: Math.abs(awsEstimate - gcpEstimate),
            percentDifference: ((gcpEstimate - awsEstimate) / awsEstimate) * 100
        };
    }
}
export const createGCPRenderBackend = (config) => {
    return new GCPRenderBackend(config);
};
//# sourceMappingURL=GCPRenderBackend.js.map