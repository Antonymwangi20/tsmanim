/**
 * Unified cloud infrastructure manager
 * Abstracts AWS and GCP backends, handles job routing, cost optimization
 */
import { RenderConfig } from './RenderOrchestrator.js';
import { AWSConfig } from './AWSRenderBackend.js';
import { GCPConfig } from './GCPRenderBackend.js';
export type CloudProvider = 'aws' | 'gcp' | 'hybrid';
export interface CloudInfrastructureConfig {
    provider: CloudProvider;
    aws?: AWSConfig;
    gcp?: GCPConfig;
    renderConfig: RenderConfig;
    costOptimization?: {
        preferCheaper: boolean;
        maxBudget?: number;
        batchJobs?: boolean;
        batchSize?: number;
    };
}
export interface CloudJobRequest {
    name: string;
    sceneData: any;
    totalFrames: number;
    resolution?: [number, number];
    quality?: 'low' | 'medium' | 'high' | 'ultra';
    priority?: 'low' | 'normal' | 'high';
    provider?: 'aws' | 'gcp' | 'auto';
}
export interface CloudJobMetrics {
    jobId: string;
    provider: string;
    status: string;
    progress: number;
    estimatedCost: number;
    actualCost: number;
    timeElapsed: number;
    estimatedTimeRemaining: number;
    provider_: string;
}
/**
 * Unified cloud infrastructure manager
 */
export declare class CloudInfrastructure {
    private config;
    private orchestrator;
    private awsBackend?;
    private gcpBackend?;
    private jobProviderMap;
    private costTracker;
    constructor(config: CloudInfrastructureConfig);
    /**
     * Submit render job to cloud
     */
    submitJob(request: CloudJobRequest): Promise<string>;
    /**
     * Route job to AWS
     */
    private routeToAWS;
    /**
     * Route job to GCP
     */
    private routeToGCP;
    /**
     * Select cheaper provider based on cost estimation
     */
    private selectCheaperProvider;
    /**
     * Estimate cost for provider
     */
    estimateCost(provider: string, frameCount: number, resolution: [number, number], quality: 'low' | 'medium' | 'high' | 'ultra'): number;
    /**
     * Get job metrics
     */
    getJobMetrics(jobId: string): CloudJobMetrics | null;
    /**
     * Get all jobs with cloud metrics
     */
    getAllJobsWithMetrics(): CloudJobMetrics[];
    /**
     * Cancel job
     */
    cancelJob(jobId: string): Promise<boolean>;
    /**
     * Get rendering statistics
     */
    getRenderStats(): {
        totalJobs: number;
        activeJobs: number;
        completedJobs: number;
        totalCostEstimated: number;
        totalCostActual: number;
        averageRenderTime: number;
        providers: {
            aws: number;
            gcp: number;
        };
    };
    /**
     * Get deployment templates
     */
    getDeploymentTemplates(): {
        aws: {
            ecsTaskDefinition: any;
            lambdaCode: string;
            ecsWorkerCode: string;
            s3LifecyclePolicy: any;
        };
        gcp: {
            cloudRunConfig: any;
            cloudFunctionCode: string;
            cloudRunWorkerCode: string;
            pubsubConfig: any;
            gcsLifecyclePolicy: any;
            iamRoles: any;
        };
    };
    /**
     * Export infrastructure deployment scripts
     */
    exportDeploymentScripts(): {
        awsCloudFormation: string;
        gcpTerraform: string;
        dockerCompose: string;
    };
}
export declare const createCloudInfrastructure: (config: CloudInfrastructureConfig) => CloudInfrastructure;
//# sourceMappingURL=CloudInfrastructure.d.ts.map