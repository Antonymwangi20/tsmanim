import { EventEmitter } from 'events';
export type PortType = 'number' | 'vector2' | 'color' | 'shape' | 'animation' | 'trigger' | 'boolean' | 'string';
export interface Port {
    id: string;
    name: string;
    type: PortType;
    isInput: boolean;
    defaultValue?: any;
    connections: string[];
}
export interface GraphNode {
    id: string;
    type: string;
    label: string;
    position: {
        x: number;
        y: number;
    };
    inputs: Map<string, Port>;
    outputs: Map<string, Port>;
    params: Map<string, any>;
    compute: (inputs: Map<string, any>, params: Map<string, any>, context: any) => Map<string, any>;
}
/**
 * Node-based visual graph editor for procedural animation scripting
 * Supports real-time evaluation and topological sorting
 */
export declare class NodeGraph extends EventEmitter {
    private nodes;
    private executionOrder;
    private nodeCounter;
    /**
     * Add a node to the graph at given position
     */
    addNode(type: string, position: {
        x: number;
        y: number;
    }, label?: string): GraphNode;
    /**
     * Remove node from graph
     */
    removeNode(nodeId: string): boolean;
    /**
     * Connect output port to input port
     */
    connect(outputPortId: string, inputPortId: string): boolean;
    /**
     * Disconnect ports
     */
    disconnect(outputPortId: string, inputPortId: string): boolean;
    /**
     * Execute graph synchronously at given time
     */
    execute(time: number): Map<string, any>;
    /**
     * Get node by ID
     */
    getNode(nodeId: string): GraphNode | undefined;
    /**
     * Get all nodes
     */
    getAllNodes(): GraphNode[];
    /**
     * Update node parameter
     */
    setNodeParam(nodeId: string, paramName: string, value: any): boolean;
    /**
     * Topological sort for execution order
     */
    private recalculateExecutionOrder;
    /**
     * Create a node instance by type
     */
    private createNodeInstance;
    /**
     * Available node types with factories
     */
    private getNodeFactories;
    /**
     * Serialize graph to JSON
     */
    serialize(): object;
    /**
     * Deserialize graph from JSON
     */
    static deserialize(data: any): NodeGraph;
}
//# sourceMappingURL=NodeGraph.d.ts.map