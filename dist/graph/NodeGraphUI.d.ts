/**
 * Visual UI renderer for node graph editor
 * Renders nodes, ports, and connections in 2D canvas
 * Ready for interactive desktop/web UI integration
 */
import { NodeGraph } from './NodeGraph.js';
import { Vector2 } from '../utils/Vector2.js';
export interface UIConfig {
    canvas: HTMLCanvasElement | OffscreenCanvas;
    nodeWidth?: number;
    nodeHeight?: number;
    portSize?: number;
    gridSize?: number;
    theme?: 'dark' | 'light';
}
export interface RenderContext {
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
    scale: number;
    offset: Vector2;
}
/**
 * Node graph visual editor renderer
 */
export declare class NodeGraphUI {
    private graph;
    private canvas;
    private ctx;
    private nodeWidth;
    private nodeHeight;
    private portSize;
    private gridSize;
    private theme;
    private scale;
    private offset;
    private selectedNode;
    private connectedPorts;
    constructor(graph: NodeGraph, config: UIConfig);
    /**
     * Render complete graph
     */
    render(): void;
    /**
     * Clear canvas
     */
    private clearCanvas;
    /**
     * Draw grid background
     */
    private drawGrid;
    /**
     * Draw node in graph
     */
    private drawNode;
    /**
     * Draw port (input/output)
     */
    private drawPort;
    /**
     * Draw connections between nodes
     */
    private drawConnections;
    /**
     * Draw temporary connection while dragging
     */
    private drawTemporaryConnection;
    /**
     * Get node at mouse position
     */
    private getNodeAtPosition;
    /**
     * Setup event handlers
     */
    private setupEventHandlers;
    /**
     * Handle click
     */
    private handleClick;
    /**
     * Handle zoom
     */
    private handleZoom;
    /**
     * Handle mouse move
     */
    private handleMouseMove;
    /**
     * Export as image
     */
    exportAsImage(filename?: string): void;
}
/**
 * Create UI for existing graph
 */
export declare const createNodeGraphUI: (graph: NodeGraph, config: UIConfig) => NodeGraphUI;
//# sourceMappingURL=NodeGraphUI.d.ts.map