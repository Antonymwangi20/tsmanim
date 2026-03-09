// src/cloud/CloudInfrastructure.ts
/**
 * Unified cloud infrastructure manager
 * Abstracts AWS and GCP backends, handles job routing, cost optimization
 */
import { RenderOrchestrator } from './RenderOrchestrator.js';
import { AWSRenderBackend } from './AWSRenderBackend.js';
import { GCPRenderBackend } from './GCPRenderBackend.js';
/**
 * Unified cloud infrastructure manager
 */
export class CloudInfrastructure {
    config;
    orchestrator;
    awsBackend;
    gcpBackend;
    jobProviderMap = new Map();
    costTracker = new Map();
    constructor(config) {
        this.config = config;
        this.orchestrator = new RenderOrchestrator(config.renderConfig);
        if (config.provider === 'aws' || config.provider === 'hybrid') {
            if (!config.aws)
                throw new Error('AWS config required for AWS provider');
            this.awsBackend = new AWSRenderBackend(config.aws);
        }
        if (config.provider === 'gcp' || config.provider === 'hybrid') {
            if (!config.gcp)
                throw new Error('GCP config required for GCP provider');
            this.gcpBackend = new GCPRenderBackend(config.gcp);
        }
    }
    /**
     * Submit render job to cloud
     */
    async submitJob(request) {
        let provider = request.provider || 'auto';
        // Auto-select provider based on cost optimization
        if (provider === 'auto' && this.config.costOptimization?.preferCheaper) {
            provider = await this.selectCheaperProvider(request.totalFrames, request.resolution || [1920, 1080], request.quality || 'medium');
        }
        if (provider === 'auto') {
            provider = this.config.provider === 'hybrid' ? 'aws' : this.config.provider;
        }
        // Submit to orchestrator
        const jobId = await this.orchestrator.submitJob(request.name, request.sceneData, {
            totalFrames: request.totalFrames,
            fps: 60,
            resolution: request.resolution,
            quality: request.quality
        });
        this.jobProviderMap.set(jobId, provider);
        // Track estimated cost
        const costEstimate = this.estimateCost(provider, request.totalFrames, request.resolution || [1920, 1080], request.quality || 'medium');
        this.costTracker.set(jobId, {
            estimated: costEstimate,
            actual: 0
        });
        console.log(`☁️  Job ${jobId} submitted to ${provider}`);
        console.log(`   Estimated cost: $${costEstimate.toFixed(2)}`);
        // Provider-specific routing
        if (provider === 'aws' && this.awsBackend) {
            await this.routeToAWS(jobId, request);
        }
        else if (provider === 'gcp' && this.gcpBackend) {
            await this.routeToGCP(jobId, request);
        }
        return jobId;
    }
    /**
     * Route job to AWS
     */
    async routeToAWS(jobId, request) {
        if (!this.awsBackend)
            return;
        // In production, would invoke Lambda orchestrator
        console.log(`📤 Routing to AWS Lambda for orchestration`);
        // Simulate Lambda invocation
        this.awsBackend.registerJob(jobId, `arn:aws:lambda:${this.config.aws?.region}:${this.config.aws?.accountId}:function:render-orchestrator`, [], []);
    }
    /**
     * Route job to GCP
     */
    async routeToGCP(jobId, request) {
        if (!this.gcpBackend)
            return;
        // In production, would invoke Cloud Function orchestrator
        console.log(`📤 Routing to GCP Cloud Function for orchestration`);
        // Simulate Cloud Function invocation
        this.gcpBackend.registerJob(jobId, `projects/${this.config.gcp?.projectId}/locations/${this.config.gcp?.region}/functions/render-orchestrator`, [], []);
    }
    /**
     * Select cheaper provider based on cost estimation
     */
    async selectCheaperProvider(frameCount, resolution, quality) {
        const taskCount = Math.max(1, Math.ceil(frameCount / 60));
        const timeMinutes = (frameCount / 60); // 60fps
        let awsCost = 0;
        let gcpCost = 0;
        if (this.awsBackend) {
            const costs = this.awsBackend.estimateAWSCosts(frameCount, taskCount, timeMinutes);
            awsCost = costs.total;
        }
        if (this.gcpBackend) {
            const costs = this.gcpBackend.estimateGCPCosts(frameCount, taskCount, timeMinutes);
            gcpCost = costs.total;
        }
        console.log(`💰 Cost comparison: AWS=$${awsCost.toFixed(2)}, GCP=$${gcpCost.toFixed(2)}`);
        return awsCost < gcpCost ? 'aws' : 'gcp';
    }
    /**
     * Estimate cost for provider
     */
    estimateCost(provider, frameCount, resolution, quality) {
        const taskCount = Math.max(1, Math.ceil(frameCount / 60));
        const timeMinutes = frameCount / 60;
        if (provider === 'aws' && this.awsBackend) {
            const costs = this.awsBackend.estimateAWSCosts(frameCount, taskCount, timeMinutes);
            return costs.total;
        }
        if (provider === 'gcp' && this.gcpBackend) {
            const costs = this.gcpBackend.estimateGCPCosts(frameCount, taskCount, timeMinutes);
            return costs.total;
        }
        return 0;
    }
    /**
     * Get job metrics
     */
    getJobMetrics(jobId) {
        const job = this.orchestrator.getJobStatus(jobId);
        if (!job)
            return null;
        const provider = this.jobProviderMap.get(jobId) || 'unknown';
        const cost = this.costTracker.get(jobId);
        const timeElapsed = Date.now() - job.startTime;
        const estimatedRemaining = this.orchestrator.estimateCompletionTime(jobId);
        return {
            jobId,
            provider,
            status: job.status,
            progress: job.progress,
            estimatedCost: cost?.estimated || 0,
            actualCost: cost?.actual || 0,
            timeElapsed: timeElapsed / 1000,
            estimatedTimeRemaining: estimatedRemaining || 0,
            provider_: provider
        };
    }
    /**
     * Get all jobs with cloud metrics
     */
    getAllJobsWithMetrics() {
        return this.orchestrator.getAllJobs()
            .map(job => {
            const metrics = this.getJobMetrics(job.id);
            return metrics;
        })
            .filter(m => m !== null);
    }
    /**
     * Cancel job
     */
    async cancelJob(jobId) {
        return this.orchestrator.cancelJob(jobId);
    }
    /**
     * Get rendering statistics
     */
    getRenderStats() {
        const orchestratorStats = this.orchestrator.getMetrics();
        let awsJobs = 0;
        let gcpJobs = 0;
        for (const [, provider] of this.jobProviderMap) {
            if (provider === 'aws')
                awsJobs++;
            else if (provider === 'gcp')
                gcpJobs++;
        }
        let totalEstimated = 0;
        let totalActual = 0;
        for (const [, costs] of this.costTracker) {
            totalEstimated += costs.estimated;
            totalActual += costs.actual;
        }
        return {
            totalJobs: orchestratorStats.totalJobs,
            activeJobs: orchestratorStats.activeJobs,
            completedJobs: orchestratorStats.completedJobs,
            totalCostEstimated: totalEstimated,
            totalCostActual: totalActual,
            averageRenderTime: orchestratorStats.averageRenderTime,
            providers: {
                aws: awsJobs,
                gcp: gcpJobs
            }
        };
    }
    /**
     * Get deployment templates
     */
    getDeploymentTemplates() {
        return {
            aws: {
                ecsTaskDefinition: this.awsBackend?.getECSTaskDefinition() || {},
                lambdaCode: this.awsBackend?.getLambdaOrchestratorCode() || '',
                ecsWorkerCode: this.awsBackend?.getECSWorkerCode() || '',
                s3LifecyclePolicy: this.awsBackend?.getS3LifecyclePolicy() || {}
            },
            gcp: {
                cloudRunConfig: this.gcpBackend?.getCloudRunDeploymentConfig() || {},
                cloudFunctionCode: this.gcpBackend?.getCloudFunctionCode() || '',
                cloudRunWorkerCode: this.gcpBackend?.getCloudRunWorkerCode() || '',
                pubsubConfig: this.gcpBackend?.getPubSubConfig() || {},
                gcsLifecyclePolicy: this.gcpBackend?.getGCSLifecyclePolicy() || {},
                iamRoles: this.gcpBackend?.getIAMRoles() || {}
            }
        };
    }
    /**
     * Export infrastructure deployment scripts
     */
    exportDeploymentScripts() {
        const awsCloudFormation = `
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  RenderQueue:
    Type: AWS::SQS::Queue
    Properties:
      QueueName: ts-manim-render-queue
      VisibilityTimeout: 3600
      MessageRetentionPeriod: 604800
  
  RenderBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: ts-manim-renders-\${AWS::AccountId}
      LifecycleConfiguration:
        Rules:
          - Id: DeleteOldFrames
            Status: Enabled
            ExpirationInDays: 7
            Prefix: jobs/
  
  ECSCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: ts-manim-renderers
  
  RenderTaskDefinition:
    Type: AWS::ECS::TaskDefinition
    Properties:
      Family: ts-manim-render
      NetworkMode: awsvpc
      RequiresCompatibilities: [FARGATE]
      Cpu: '4096'
      Memory: '8192'
    `;
        const gcpTerraform = `
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_pubsub_topic" "render_queue" {
  name = "ts-manim-render-queue"
}

resource "google_pubsub_subscription" "render_subscription" {
  name  = "ts-manim-render-sub"
  topic = google_pubsub_topic.render_queue.name
  
  push_config {
    push_endpoint = google_cloud_run_service.render_worker.status[0].url
  }
}

resource "google_storage_bucket" "renders" {
  name          = "\${var.project_id}-ts-manim-renders"
  location      = var.region
  force_destroy = false
  
  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age        = 7
      matches_prefix = ["jobs/"]
    }
  }
}

resource "google_cloud_run_service" "render_worker" {
  name     = "ts-manim-render-worker"
  location = var.region
  
  template {
    spec {
      service_account_email = google_service_account.render_worker.email
      containers {
        image = var.render_worker_image
        env {
          name  = "PROJECT_ID"
          value = var.project_id
        }
      }
    }
  }
}
    `;
        const dockerCompose = `
version: '3.9'

services:
  render-orchestrator:
    image: ts-manim-render:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PROVIDER=hybrid
      - AWS_REGION=us-east-1
      - GCP_PROJECT_ID=my-project
      - GCP_REGION=us-central1
    depends_on:
      - redis
    volumes:
      - ./renders:/renders

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=ts_manim
      - POSTGRES_USER=render
      - POSTGRES_PASSWORD=secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  redis-data:
  postgres-data:
    `;
        return {
            awsCloudFormation,
            gcpTerraform,
            dockerCompose
        };
    }
}
export const createCloudInfrastructure = (config) => {
    return new CloudInfrastructure(config);
};
//# sourceMappingURL=CloudInfrastructure.js.map