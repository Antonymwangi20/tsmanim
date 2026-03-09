/**
 * AWS-specific rendering backend
 * Lambda orchestration, ECS workers, S3 storage, SQS queuing
 */
export interface AWSConfig {
    region: string;
    accountId: string;
    lambdaRole: string;
    ecsCluster: string;
    ecsTaskDefinition: string;
    s3Bucket: string;
    sqsQueueUrl: string;
}
export interface AWSRenderJob {
    jobId: string;
    lambdaArn: string;
    ecsTaskArns: string[];
    s3Prefix: string;
    sqsMessageIds: string[];
}
/**
 * AWS rendering backend with Lambda + ECS + S3 + SQS
 * Production code would use aws-sdk v3
 */
export declare class AWSRenderBackend {
    private config;
    private jobMap;
    constructor(config: AWSConfig);
    /**
     * Deploy ECS task definition for rendering worker
     */
    getECSTaskDefinition(): any;
    /**
     * Get Lambda function code for orchestration
     */
    getLambdaOrchestratorCode(): string;
    /**
     * Get ECS worker code
     */
    getECSWorkerCode(): string;
    /**
     * Get S3 lifecycle policy
     */
    getS3LifecyclePolicy(): any;
    /**
     * Register AWS render job
     */
    registerJob(jobId: string, lambdaArn: string, ecsTaskArns: string[], sqsMessageIds: string[]): void;
    /**
     * Get signed S3 URL for frame download
     */
    getSignedFrameUrl(jobId: string, frameStart: number, frameEnd: number): string;
    /**
     * Estimate AWS costs
     */
    estimateAWSCosts(frameCount: number, taskCount: number, estimatedFrameTimeMinutes: number): {
        lambdaInvocation: number;
        ecsCompute: number;
        s3Storage: number;
        sqsMessages: number;
        total: number;
    };
}
export declare const createAWSRenderBackend: (config: AWSConfig) => AWSRenderBackend;
//# sourceMappingURL=AWSRenderBackend.d.ts.map