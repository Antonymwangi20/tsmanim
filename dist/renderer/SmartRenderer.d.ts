import { Scene } from '../core/Scene.js';
/**
 * Intelligent renderer with frame caching and hashing
 * for faster performance on static or slowly changing scenes
 */
export declare class SmartRenderer {
    private cache;
    private maxCacheSize;
    private currentCacheSize;
    private stats;
    /**
     * Render a frame with intelligent caching
     */
    renderFrameSmart(scene: Scene, frameIndex: number): Promise<Buffer>;
    private hashScene;
    private addToCache;
    private evictLRU;
    /**
     * Get cache statistics
     */
    getStats(): {
        cacheHitRate: string | number;
        cacheSize: string;
        cacheEntries: number;
        cacheHits: number;
        cacheMisses: number;
        averageRenderTime: number;
    };
    /**
     * Clear all cached frames
     */
    clearCache(): void;
    /**
     * Reset statistics
     */
    resetStats(): void;
}
//# sourceMappingURL=SmartRenderer.d.ts.map