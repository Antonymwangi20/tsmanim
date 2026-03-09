// src/renderer/DistributedRenderer.ts
import { createClient, createServer } from 'rpc-websockets';
export class DistributedRenderer {
    nodes = [];
    server;
    async startMaster(port) {
        this.server = createServer({ port });
        this.server.event('register');
        this.server.on('register', (params) => {
            this.nodes.push({
                id: params.id,
                url: params.url,
                cores: params.cores,
                status: 'idle'
            });
            console.log(`🖥️  Render node joined: ${params.id} (${params.cores} cores)`);
        });
        this.server.event('frame_complete');
    }
    async renderDistributed(scene, outputDir) {
        const frames = scene.getTotalFrames();
        const chunks = this.distributeFrames(frames, this.nodes);
        const promises = chunks.map((chunk, i) => this.assignToNode(this.nodes[i % this.nodes.length], scene, chunk));
        await Promise.all(promises);
    }
    distributeFrames(total, nodes) {
        const totalCores = nodes.reduce((sum, n) => sum + n.cores, 0);
        const chunks = [];
        let current = 0;
        for (const node of nodes) {
            const count = Math.floor(total * (node.cores / totalCores));
            chunks.push({ start: current, end: Math.min(current + count, total) });
            current += count;
        }
        return chunks;
    }
    async assignToNode(node, scene, chunk) {
        const client = createClient(node.url);
        await client.call('render_range', {
            scene: this.serializeScene(scene),
            start: chunk.start,
            end: chunk.end
        });
    }
    serializeScene(scene) {
        // Serialize for network transfer
        return {};
    }
}
//# sourceMappingURL=DistributedRenderer.js.map