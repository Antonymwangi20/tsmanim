/**
 * Cloud rendering orchestration for AWS/GCP distributed rendering
 * Manages job distribution, monitoring, and result assembly
 */
export interface RenderJob {
    id: string;
    name: string;
    status: 'queued' | 'running' | 'completed' | 'failed';
    progress: number;
    startTime: number;
    endTime?: number;
    totalFrames: number;
    completedFrames: number;
    sceneData: any;
    outputUri?: string;
    cost?: number;
    errors?: string[];
}
export interface RenderConfig {
    provider: 'aws' | 'gcp';
    region: string;
    instanceType: 'spot' | 'on-demand';
    maxInstances: number;
    timeout: number;
    retryPolicy: {
        maxRetries: number;
        backoffMultiplier: number;
    };
}
export interface RenderTask {
    jobId: string;
    frameRange: [number, number];
    taskId: string;
    status: 'pending' | 'assigned' | 'running' | 'completed' | 'failed';
    workerId?: string;
    progress: number;
    estimatedTime: number;
}
/**
 * Cloud rendering orchestrator
 * Coordinates distributed rendering across cloud instances
 */
export declare class RenderOrchestrator {
    private jobs;
    private tasks;
    private config;
    private jobCounter;
    private taskCounter;
    constructor(config: RenderConfig);
    /**
     * Submit render job to cloud
     */
    submitJob(name: string, sceneData: any, options: {
        totalFrames: number;
        fps?: number;
        resolution?: [number, number];
        quality?: 'low' | 'medium' | 'high' | 'ultra';
        spotInstances?: boolean;
    }): Promise<string>;
    /**
     * Create render tasks (frame chunks)
     */
    private createRenderTasks;
    /**
     * Get job status
     */
    getJobStatus(jobId: string): RenderJob | null;
    /**
     * Get all jobs
     */
    getAllJobs(): RenderJob[];
    /**
     * Cancel job
     */
    cancelJob(jobId: string): Promise<boolean>;
    /**
     * Report task completion
     */
    reportTaskCompletion(taskId: string, frameData: Buffer): void;
    /**
     * Report task failure
     */
    reportTaskFailure(taskId: string, error: string): void;
    /**
     * Get render metrics
     */
    getMetrics(): {
        totalJobs: number;
        activeJobs: number;
        completedJobs: number;
        totalCost: number;
        averageRenderTime: number;
    };
    /**
     * Estimate render cost
     */
    private estimateCost;
    /**
     * Estimate job completion time
     */
    estimateCompletionTime(jobId: string): number | null;
    /**
     * Get job output URL
     */
    getOutputUrl(jobId: string): string | null;
    /**
     * Get detailed job report
     */
    getJobReport(jobId: string): any;
}
export declare const createRenderOrchestrator: (config: RenderConfig) => RenderOrchestrator;
//# sourceMappingURL=RenderOrchestrator.d.ts.map