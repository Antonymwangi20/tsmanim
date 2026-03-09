// src/cli/dev.ts
import * as chokidar from 'chokidar';
import * as path from 'path';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { SkiaRenderer } from '../renderer/SkiaRenderer';
export class DevServer {
    port;
    wss;
    currentScene = null;
    renderer;
    isRendering = false;
    constructor(port = 3000) {
        this.port = port;
        this.renderer = new SkiaRenderer();
        this.wss = new WebSocketServer({ port: this.port + 1 });
    }
    async start(scriptPath) {
        console.log(`🚀 Dev server starting on http://localhost:${this.port}`);
        console.log(`📺 Preview ws://localhost:${this.port + 1}`);
        // Watch file changes
        const watcher = chokidar.watch(scriptPath, { persistent: true });
        watcher.on('change', async () => {
            console.log('📝 Script changed, reloading...');
            await this.reload(scriptPath);
        });
        // Initial load
        await this.reload(scriptPath);
        // HTTP server for preview UI
        createServer((req, res) => {
            if (req.url === '/') {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(this.getPreviewHTML());
            }
            else if (req.url === '/frame') {
                this.serveFrame(res);
            }
        }).listen(this.port);
        // WebSocket for real-time updates
        this.wss.on('connection', (ws) => {
            ws.send(JSON.stringify({ type: 'ready' }));
        });
    }
    async reload(scriptPath) {
        try {
            delete require.cache[require.resolve(path.resolve(scriptPath))];
            const module = await import(path.resolve(scriptPath));
            this.currentScene = module.default || module.scene;
            // Broadcast reload
            this.wss.clients.forEach(client => {
                client.send(JSON.stringify({ type: 'reload' }));
            });
            console.log('✅ Scene loaded');
        }
        catch (err) {
            console.error('❌ Error loading scene:', err);
        }
    }
    async serveFrame(res) {
        if (!this.currentScene || this.isRendering) {
            res.writeHead(503);
            res.end();
            return;
        }
        this.isRendering = true;
        try {
            // Render at current scrubber time (default 0)
            const buffer = await this.renderer.renderFrame(this.currentScene, 0, {
                outputDir: '/tmp',
                frameFormat: 'png'
            });
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(buffer);
        }
        finally {
            this.isRendering = false;
        }
    }
    getPreviewHTML() {
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>TS-Manim Preview</title>
          <style>
            body { margin: 0; background: #222; display: flex; height: 100vh; }
            #canvas { flex: 1; display: flex; align-items: center; justify-content: center; }
            #controls { width: 300px; background: #333; padding: 20px; color: white; }
            input[type=range] { width: 100%; }
            #timeline { margin-top: 20px; }
          </style>
        </head>
        <body>
          <div id="canvas">
            <img id="preview" style="max-width: 100%; max-height: 100%;" />
          </div>
          <div id="controls">
            <h2>Timeline</h2>
            <input type="range" id="scrubber" min="0" max="100" value="0">
            <div id="time">0.00s</div>
            <button id="play">Play</button>
            <div id="stats"></div>
          </div>
          <script>
            const ws = new WebSocket('ws://localhost:${this.port + 1}');
            const img = document.getElementById('preview');
            const scrubber = document.getElementById('scrubber');
            
            ws.onmessage = (e) => {
              const msg = JSON.parse(e.data);
              if (msg.type === 'reload') location.reload();
            };
            
            function updateFrame() {
              img.src = '/frame?t=' + Date.now();
            }
            
            scrubber.oninput = () => {
              document.getElementById('time').textContent = 
                (scrubber.value / 10).toFixed(2) + 's';
              updateFrame();
            };
            
            setInterval(updateFrame, 1000/30); // 30fps preview
          </script>
        </body>
      </html>
    `;
    }
}
//# sourceMappingURL=dev.js.map