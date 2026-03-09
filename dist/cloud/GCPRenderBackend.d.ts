/**
 * GCP-specific rendering backend
 * Cloud Functions orchestration, Cloud Run workers, GCS storage, Pub/Sub queuing
 */
export interface GCPConfig {
    projectId: string;
    region: string;
    gcsBucket: string;
    pubsubTopic: string;
    cloudRunImage: string;
    cloudFunctionName: string;
}
export interface GCPRenderJob {
    jobId: string;
    cloudFunctionName: string;
    cloudRunRevisions: string[];
    gcsPrefix: string;
    pubsubMessages: string[];
}
/**
 * GCP rendering backend with Cloud Functions + Cloud Run + GCS + Pub/Sub
 * Production code would use @google-cloud packages
 */
export declare class GCPRenderBackend {
    private config;
    private jobMap;
    constructor(config: GCPConfig);
    /**
     * Get Cloud Run deployment config
     */
    getCloudRunDeploymentConfig(): any;
    /**
     * Get Cloud Function orchestrator code
     */
    getCloudFunctionCode(): string;
    /**
     * Get Cloud Run worker code
     */
    getCloudRunWorkerCode(): string;
    /**
     * Get Pub/Sub subscription configuration
     */
    getPubSubConfig(): any;
    /**
     * Get GCS lifecycle policy
     */
    getGCSLifecyclePolicy(): any;
    /**
     * Get IAM role configuration
     */
    getIAMRoles(): {
        serviceAccountEmail: string;
        roles: string[];
    };
    /**
     * Register GCP render job
     */
    registerJob(jobId: string, cloudFunctionName: string, cloudRunRevisions: string[], pubsubMessages: string[]): void;
    /**
     * Get signed GCS URL for frame download
     */
    getSignedFrameUrl(jobId: string, frameStart: number, frameEnd: number): string;
    /**
     * Estimate GCP costs
     */
    estimateGCPCosts(frameCount: number, taskCount: number, estimatedFrameTimeMinutes: number): {
        cloudFunctionInvocations: number;
        cloudRunCompute: number;
        gcsStorage: number;
        pubsubMessages: number;
        total: number;
    };
    /**
     * Compare AWS vs GCP costs
     */
    compareCosts(frameCount: number, taskCount: number, estimatedFrameTimeMinutes: number): {
        aws: number;
        gcp: number;
        difference: number;
        percentDifference: number;
    };
}
export declare const createGCPRenderBackend: (config: GCPConfig) => GCPRenderBackend;
//# sourceMappingURL=GCPRenderBackend.d.ts.map