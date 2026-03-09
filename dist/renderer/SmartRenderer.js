// src/renderer/SmartRenderer.ts
import { Canvas } from 'skia-canvas';
import * as crypto from 'crypto';
/**
 * Intelligent renderer with frame caching and hashing
 * for faster performance on static or slowly changing scenes
 */
export class SmartRenderer {
    cache = new Map();
    maxCacheSize = 100; // MB
    currentCacheSize = 0;
    stats = { cacheHits: 0, cacheMisses: 0, averageRenderTime: 0 };
    /**
     * Render a frame with intelligent caching
     */
    async renderFrameSmart(scene, frameIndex) {
        const startTime = Date.now();
        const time = scene.getFrameTime(frameIndex);
        // Calculate scene hash
        const sceneHash = this.hashScene(scene, time);
        // Check cache
        const cached = this.cache.get(sceneHash);
        if (cached) {
            cached.lastUsed = Date.now();
            this.stats.cacheHits++;
            return cached.buffer;
        }
        this.stats.cacheMisses++;
        // Full render
        const canvas = new Canvas(scene.width, scene.height);
        const ctx = canvas.getContext('2d');
        scene.update(time);
        scene.render(ctx);
        const buffer = canvas.toBufferSync('png');
        // Cache result (always cache for now)
        this.addToCache(sceneHash, buffer, scene.width, scene.height);
        // Update statistics
        const renderTime = Date.now() - startTime;
        const total = this.stats.cacheHits + this.stats.cacheMisses;
        this.stats.averageRenderTime =
            (this.stats.averageRenderTime * (total - 1) + renderTime) / total;
        return buffer;
    }
    hashScene(scene, time) {
        // Quantize time to reduce hash variations
        const quantizedTime = Math.round(time * 10000) / 10000;
        const data = JSON.stringify({
            w: scene.width,
            h: scene.height,
            t: quantizedTime,
            // In production, include more detailed node data for better hashing
        });
        return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
    }
    addToCache(hash, buffer, width, height) {
        const sizeEstimate = buffer.length;
        const maxSizeBytes = this.maxCacheSize * 1024 * 1024;
        // Evict old entries if needed
        while (this.currentCacheSize + sizeEstimate > maxSizeBytes && this.cache.size > 0) {
            this.evictLRU();
        }
        this.cache.set(hash, {
            hash,
            buffer,
            width,
            height,
            lastUsed: Date.now()
        });
        this.currentCacheSize += sizeEstimate;
    }
    evictLRU() {
        let oldest = null;
        let oldestKey = '';
        for (const [key, entry] of this.cache) {
            if (!oldest || entry.lastUsed < oldest.lastUsed) {
                oldest = entry;
                oldestKey = key;
            }
        }
        if (oldestKey && oldest) {
            this.cache.delete(oldestKey);
            this.currentCacheSize -= oldest.buffer.length;
        }
    }
    /**
     * Get cache statistics
     */
    getStats() {
        const total = this.stats.cacheHits + this.stats.cacheMisses;
        return {
            ...this.stats,
            cacheHitRate: total > 0 ? (this.stats.cacheHits / total * 100).toFixed(1) : 0,
            cacheSize: (this.currentCacheSize / 1024 / 1024).toFixed(1),
            cacheEntries: this.cache.size
        };
    }
    /**
     * Clear all cached frames
     */
    clearCache() {
        this.cache.clear();
        this.currentCacheSize = 0;
    }
    /**
     * Reset statistics
     */
    resetStats() {
        this.stats = { cacheHits: 0, cacheMisses: 0, averageRenderTime: 0 };
    }
}
//# sourceMappingURL=SmartRenderer.js.map