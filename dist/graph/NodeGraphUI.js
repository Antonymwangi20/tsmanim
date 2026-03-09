// src/graph/NodeGraphUI.ts
/**
 * Visual UI renderer for node graph editor
 * Renders nodes, ports, and connections in 2D canvas
 * Ready for interactive desktop/web UI integration
 */
import { Vector2 } from '../utils/Vector2.js';
/**
 * Node graph visual editor renderer
 */
export class NodeGraphUI {
    graph;
    canvas;
    ctx;
    nodeWidth;
    nodeHeight;
    portSize;
    gridSize;
    theme;
    scale = 1;
    offset = new Vector2(0, 0);
    selectedNode = null;
    connectedPorts = [];
    constructor(graph, config) {
        this.graph = graph;
        this.canvas = config.canvas;
        this.nodeWidth = config.nodeWidth ?? 200;
        this.nodeHeight = config.nodeHeight ?? 150;
        this.portSize = config.portSize ?? 8;
        this.gridSize = config.gridSize ?? 20;
        this.theme = config.theme ?? 'dark';
        this.ctx = this.canvas.getContext('2d');
        this.setupEventHandlers();
    }
    /**
     * Render complete graph
     */
    render() {
        this.clearCanvas();
        this.drawGrid();
        const renderCtx = { ctx: this.ctx, scale: this.scale, offset: this.offset };
        // Draw connections first (behind nodes)
        this.drawConnections(renderCtx);
        // Draw nodes on top
        for (const node of this.graph.getAllNodes()) {
            this.drawNode(node, renderCtx);
        }
        // Draw temporary connection being made
        if (this.connectedPorts.length > 0) {
            this.drawTemporaryConnection(renderCtx);
        }
    }
    /**
     * Clear canvas
     */
    clearCanvas() {
        const bg = this.theme === 'dark' ? '#1a1a1a' : '#ffffff';
        this.ctx.fillStyle = bg;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    /**
     * Draw grid background
     */
    drawGrid() {
        const gridColor = this.theme === 'dark' ? '#2a2a2a' : '#e0e0e0';
        this.ctx.strokeStyle = gridColor;
        this.ctx.lineWidth = 0.5;
        for (let x = 0; x < this.canvas.width; x += this.gridSize * this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + this.offset.x, 0);
            this.ctx.lineTo(x + this.offset.x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += this.gridSize * this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y + this.offset.y);
            this.ctx.lineTo(this.canvas.width, y + this.offset.y);
            this.ctx.stroke();
        }
    }
    /**
     * Draw node in graph
     */
    drawNode(node, renderCtx) {
        const { ctx, scale, offset } = renderCtx;
        const x = node.position.x * scale + offset.x;
        const y = node.position.y * scale + offset.y;
        const w = this.nodeWidth * scale;
        const h = this.nodeHeight * scale;
        // Node background
        const bgColor = this.selectedNode === node.id
            ? (this.theme === 'dark' ? '#0066cc' : '#cce5ff')
            : (this.theme === 'dark' ? '#2a2a2a' : '#f5f5f5');
        ctx.fillStyle = bgColor;
        ctx.fillRect(x, y, w, h);
        // Node border
        ctx.strokeStyle = this.selectedNode === node.id ? '#0099ff' : '#666';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
        // Node title
        ctx.fillStyle = this.theme === 'dark' ? '#ffffff' : '#000000';
        ctx.font = `bold ${12 * scale}px monospace`;
        ctx.fillText(node.label, x + 10, y + 20);
        // Draw input ports (left side)
        let inputY = y + 35;
        for (const [, port] of node.inputs) {
            this.drawPort(port, new Vector2(x, inputY), true, renderCtx);
            inputY += 25;
        }
        // Draw output ports (right side)
        let outputY = y + 35;
        for (const [, port] of node.outputs) {
            this.drawPort(port, new Vector2(x + w, outputY), false, renderCtx);
            outputY += 25;
        }
    }
    /**
     * Draw port (input/output)
     */
    drawPort(port, position, isInput, renderCtx) {
        const { ctx, scale } = renderCtx;
        const portRadius = this.portSize * scale;
        // Port circle
        const colors = {
            number: '#ffaa00',
            vector2: '#00ff00',
            color: '#ff00ff',
            shape: '#00aaff',
            animation: '#ff0000',
            trigger: '#ffff00'
        };
        ctx.fillStyle = colors[port.type] || '#cccccc';
        ctx.beginPath();
        ctx.arc(isInput ? position.x : position.x, position.y, portRadius, 0, Math.PI * 2);
        ctx.fill();
        // Port label
        ctx.fillStyle = this.theme === 'dark' ? '#ffffff' : '#000000';
        ctx.font = `${10 * scale}px monospace`;
        const labelX = isInput ? position.x + portRadius + 5 : position.x - portRadius - 5;
        const align = isInput ? 'left' : 'right';
        ctx.textAlign = align;
        ctx.fillText(port.name, labelX, position.y + 4);
    }
    /**
     * Draw connections between nodes
     */
    drawConnections(renderCtx) {
        const { ctx, scale, offset } = renderCtx;
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 2;
        for (const node of this.graph.getAllNodes()) {
            for (const [, outputPort] of node.outputs) {
                for (const connId of outputPort.connections) {
                    const [inNodeId, inPortName] = connId.split('.');
                    const inNode = this.graph.getNode(inNodeId);
                    if (!inNode)
                        continue;
                    const inPort = inNode.inputs.get(inPortName);
                    if (!inPort)
                        continue;
                    // Calculate port positions
                    const fromX = (node.position.x + this.nodeWidth) * scale + offset.x;
                    const fromY = (node.position.y + 50) * scale + offset.y;
                    const toX = inNode.position.x * scale + offset.x;
                    const toY = (inNode.position.y + 50) * scale + offset.y;
                    // Draw Bézier curve
                    ctx.beginPath();
                    ctx.moveTo(fromX, fromY);
                    ctx.bezierCurveTo(fromX + 50, fromY, toX - 50, toY, toX, toY);
                    ctx.stroke();
                }
            }
        }
    }
    /**
     * Draw temporary connection while dragging
     */
    drawTemporaryConnection(renderCtx) {
        if (this.connectedPorts.length < 1)
            return;
        const { ctx, scale, offset } = renderCtx;
        const from = this.connectedPorts[0];
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(from.pos.x * scale + offset.x, from.pos.y * scale + offset.y);
        ctx.lineTo(this.canvas.width / 2, this.canvas.height / 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    /**
     * Get node at mouse position
     */
    getNodeAtPosition(pos) {
        for (const node of this.graph.getAllNodes()) {
            const x = node.position.x * this.scale + this.offset.x;
            const y = node.position.y * this.scale + this.offset.y;
            const w = this.nodeWidth * this.scale;
            const h = this.nodeHeight * this.scale;
            if (pos.x >= x && pos.x <= x + w && pos.y >= y && pos.y <= y + h) {
                return node.id;
            }
        }
        return null;
    }
    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        if (this.canvas instanceof HTMLCanvasElement) {
            this.canvas.addEventListener('click', (e) => this.handleClick(e));
            this.canvas.addEventListener('wheel', (e) => this.handleZoom(e));
            this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        }
    }
    /**
     * Handle click
     */
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const pos = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
        const nodeId = this.getNodeAtPosition(pos);
        this.selectedNode = nodeId;
        this.render();
    }
    /**
     * Handle zoom
     */
    handleZoom(e) {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        this.scale *= zoomFactor;
        this.scale = Math.max(0.1, Math.min(5, this.scale));
        this.render();
    }
    /**
     * Handle mouse move
     */
    handleMouseMove(e) {
        // Implement panning and connection preview
    }
    /**
     * Export as image
     */
    exportAsImage(filename = 'graph.png') {
        this.render();
        if (this.canvas instanceof HTMLCanvasElement) {
            const link = document.createElement('a');
            link.href = this.canvas.toDataURL('image/png');
            link.download = filename;
            link.click();
        }
    }
}
/**
 * Create UI for existing graph
 */
export const createNodeGraphUI = (graph, config) => {
    return new NodeGraphUI(graph, config);
};
//# sourceMappingURL=NodeGraphUI.js.map