// src/cloud/AWSRenderBackend.ts
/**
 * AWS-specific rendering backend
 * Lambda orchestration, ECS workers, S3 storage, SQS queuing
 */
/**
 * AWS rendering backend with Lambda + ECS + S3 + SQS
 * Production code would use aws-sdk v3
 */
export class AWSRenderBackend {
    config;
    jobMap = new Map();
    constructor(config) {
        this.config = config;
    }
    /**
     * Deploy ECS task definition for rendering worker
     */
    getECSTaskDefinition() {
        return {
            family: `${this.config.ecsTaskDefinition}`,
            networkMode: 'awsvpc',
            requiresCompatibilities: ['FARGATE'],
            cpu: '4096',
            memory: '8192',
            containerDefinitions: [
                {
                    name: 'render-worker',
                    image: `${this.config.accountId}.dkr.ecr.${this.config.region}.amazonaws.com/ts-manim-render:latest`,
                    essential: true,
                    environment: [
                        { name: 'AWS_REGION', value: this.config.region },
                        { name: 'S3_BUCKET', value: this.config.s3Bucket },
                        { name: 'SQS_QUEUE_URL', value: this.config.sqsQueueUrl }
                    ],
                    logConfiguration: {
                        logDriver: 'awslogs',
                        options: {
                            'awslogs-group': `/ecs/${this.config.ecsTaskDefinition}`,
                            'awslogs-region': this.config.region,
                            'awslogs-stream-prefix': 'ecs'
                        }
                    }
                }
            ],
            taskRoleArn: `arn:aws:iam::${this.config.accountId}:role/ecsTaskRole`,
            executionRoleArn: `arn:aws:iam::${this.config.accountId}:role/ecsTaskExecutionRole`
        };
    }
    /**
     * Get Lambda function code for orchestration
     */
    getLambdaOrchestratorCode() {
        return `
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const sqs = new SQSClient({ region: process.env.AWS_REGION });
const ecs = new ECSClient({ region: process.env.AWS_REGION });
const s3 = new S3Client({ region: process.env.AWS_REGION });

export const handler = async (event) => {
  const { jobId, totalFrames, sceneData, taskCount = 10 } = event;

  console.log(\`Processing render job: \${jobId}\`);

  // Save scene data to S3
  const sceneKey = \`jobs/\${jobId}/scene.json\`;
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: sceneKey,
    Body: JSON.stringify(sceneData),
    ContentType: 'application/json'
  }));

  // Calculate frame chunks
  const chunkSize = Math.ceil(totalFrames / taskCount);
  const messages = [];

  for (let i = 0; i < totalFrames; i += chunkSize) {
    const taskId = \`\${jobId}-task-\${messages.length}\`;
    const endFrame = Math.min(i + chunkSize, totalFrames);

    const message = {
      jobId,
      taskId,
      frameRange: [i, endFrame],
      sceneKey,
      outputKey: \`jobs/\${jobId}/frames/\${i}-\${endFrame}.tar.gz\`
    };

    // Queue task in SQS
    await sqs.send(new SendMessageCommand({
      QueueUrl: process.env.SQS_QUEUE_URL,
      MessageBody: JSON.stringify(message),
      MessageAttributes: {
        'Priority': { StringValue: 'NORMAL', DataType: 'String' },
        'JobId': { StringValue: jobId, DataType: 'String' }
      }
    }));

    messages.push(message);
  }

  // Scale ECS tasks
  const taskCount_ = Math.min(taskCount, process.env.MAX_ECS_TASKS || 50);
  const tasks = [];

  for (let i = 0; i < taskCount_; i++) {
    const task = await ecs.send(new RunTaskCommand({
      cluster: process.env.ECS_CLUSTER,
      taskDefinition: process.env.ECS_TASK_DEFINITION,
      launchType: 'FARGATE',
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: process.env.SUBNETS.split(','),
          securityGroups: process.env.SECURITY_GROUPS.split(','),
          assignPublicIp: 'ENABLED'
        }
      },
      overrides: {
        containerOverrides: [
          {
            name: 'render-worker',
            environment: [
              { name: 'JOB_ID', value: jobId }
            ]
          }
        ]
      }
    }));

    tasks.push(task.tasks[0].taskArn);
  }

  return {
    jobId,
    status: 'submitted',
    taskCount: messages.length,
    ecsTaskCount: tasks.length,
    ecsTaskArns: tasks,
    sqsMessages: messages.length
  };
};
    `;
    }
    /**
     * Get ECS worker code
     */
    getECSWorkerCode() {
        return `
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { exec } from 'child_process';

const sqs = new SQSClient({ region: process.env.AWS_REGION });
const s3 = new S3Client({ region: process.env.AWS_REGION });

async function processMessage(message) {
  const { jobId, taskId, frameRange, sceneKey, outputKey } = JSON.parse(message.Body);
  
  console.log(\`Processing \${taskId}: frames \${frameRange[0]}-\${frameRange[1]}\`);

  try {
    // Get scene data from S3
    const { Body: sceneBody } = await s3.send(new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: sceneKey
    }));

    const sceneData = JSON.parse(await sceneBody.transformToString());

    // Render frames locally
    const frames = await renderFrames(sceneData, frameRange[0], frameRange[1]);

    // Upload results to S3
    const tarballPath = \`/tmp/\${taskId}.tar.gz\`;
    await createTarball(frames, tarballPath);

    const { Body: fileContent } = await new Promise((resolve, reject) => {
      require('fs').readFile(tarballPath, (err, data) => {
        if (err) reject(err);
        resolve({ Body: data });
      });
    });

    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: outputKey,
      Body: fileContent,
      ContentType: 'application/gzip'
    }));

    console.log(\`✅ Completed \${taskId}\`);
    return true;
  } catch (error) {
    console.error(\`❌ Failed \${taskId}: \${error.message}\`);
    return false;
  }
}

async function pollAndProcess() {
  while (true) {
    const { Messages } = await sqs.send(new ReceiveMessageCommand({
      QueueUrl: process.env.SQS_QUEUE_URL,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 20
    }));

    if (!Messages || Messages.length === 0) {
      console.log('No messages, sleeping...');
      await new Promise(r => setTimeout(r, 5000));
      continue;
    }

    for (const message of Messages) {
      const success = await processMessage(message);

      if (success) {
        await sqs.send(new DeleteMessageCommand({
          QueueUrl: process.env.SQS_QUEUE_URL,
          ReceiptHandle: message.ReceiptHandle
        }));
      }
    }
  }
}

// Start polling
pollAndProcess().catch(console.error);
    `;
    }
    /**
     * Get S3 lifecycle policy
     */
    getS3LifecyclePolicy() {
        return {
            Rules: [
                {
                    Id: 'DeleteOldFrames',
                    Status: 'Enabled',
                    Prefix: 'jobs/',
                    ExpirationInDays: 7, // Keep completed renders for 7 days
                    NoncurrentVersionExpirationInDays: 1
                },
                {
                    Id: 'TransitionToGlacier',
                    Status: 'Enabled',
                    Prefix: 'archive/',
                    Transitions: [
                        {
                            Days: 30,
                            StorageClass: 'GLACIER'
                        }
                    ]
                }
            ]
        };
    }
    /**
     * Register AWS render job
     */
    registerJob(jobId, lambdaArn, ecsTaskArns, sqsMessageIds) {
        this.jobMap.set(jobId, {
            jobId,
            lambdaArn,
            ecsTaskArns,
            s3Prefix: `jobs/${jobId}`,
            sqsMessageIds
        });
    }
    /**
     * Get signed S3 URL for frame download
     */
    getSignedFrameUrl(jobId, frameStart, frameEnd) {
        // Production code would generate actual signed URLs using S3Client
        const key = `jobs/${jobId}/frames/${frameStart}-${frameEnd}.tar.gz`;
        const bucket = this.config.s3Bucket;
        const region = this.config.region;
        // Fake signed URL for demo
        return `https://${bucket}.s3.${region}.amazonaws.com/${key}?AWSAccessKeyId=...&Expires=...&Signature=...`;
    }
    /**
     * Estimate AWS costs
     */
    estimateAWSCosts(frameCount, taskCount, estimatedFrameTimeMinutes) {
        // Lambda: $0.0000002 per invocation
        const lambdaInvocation = 1 * 0.0000002;
        // ECS Fargate: $0.04048 per vCPU-hour, $0.004435 per GB-hour
        // 4 vCPU, 8GB, estimated time
        const vCpuHours = (taskCount * estimatedFrameTimeMinutes) / 60 * 4;
        const gbHours = (taskCount * estimatedFrameTimeMinutes) / 60 * 8;
        const ecsCompute = (vCpuHours * 0.04048) + (gbHours * 0.004435);
        // S3 Storage: assume 50MB per frame, $0.023 per GB
        const storageMB = frameCount * 50;
        const s3Storage = (storageMB / 1024) * 0.023;
        // SQS: $0.40 per 1M requests (negligible)
        const sqsMessages = (taskCount * 0.40) / 1000000;
        return {
            lambdaInvocation,
            ecsCompute,
            s3Storage,
            sqsMessages,
            total: lambdaInvocation + ecsCompute + s3Storage + sqsMessages
        };
    }
}
export const createAWSRenderBackend = (config) => {
    return new AWSRenderBackend(config);
};
//# sourceMappingURL=AWSRenderBackend.js.map