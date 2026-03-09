// src/graph/NodeGraph.ts
import { EventEmitter } from 'events';
/**
 * Node-based visual graph editor for procedural animation scripting
 * Supports real-time evaluation and topological sorting
 */
export class NodeGraph extends EventEmitter {
    nodes = new Map();
    executionOrder = [];
    nodeCounter = 0;
    /**
     * Add a node to the graph at given position
     */
    addNode(type, position, label) {
        const node = this.createNodeInstance(type, position, label);
        this.nodes.set(node.id, node);
        this.recalculateExecutionOrder();
        this.emit('nodeAdded', node);
        return node;
    }
    /**
     * Remove node from graph
     */
    removeNode(nodeId) {
        const node = this.nodes.get(nodeId);
        if (!node)
            return false;
        // Disconnect all ports
        for (const port of node.inputs.values()) {
            while (port.connections.length > 0) {
                this.disconnect(port.connections[0], `${nodeId}.${port.name}`);
            }
        }
        for (const port of node.outputs.values()) {
            while (port.connections.length > 0) {
                this.disconnect(`${nodeId}.${port.name}`, port.connections[0]);
            }
        }
        this.nodes.delete(nodeId);
        this.recalculateExecutionOrder();
        this.emit('nodeRemoved', nodeId);
        return true;
    }
    /**
     * Connect output port to input port
     */
    connect(outputPortId, inputPortId) {
        const [outNodeId, outPortName] = outputPortId.split('.');
        const [inNodeId, inPortName] = inputPortId.split('.');
        const outNode = this.nodes.get(outNodeId);
        const inNode = this.nodes.get(inNodeId);
        if (!outNode || !inNode)
            return false;
        const outPort = outNode.outputs.get(outPortName);
        const inPort = inNode.inputs.get(inPortName);
        if (!outPort || !inPort)
            return false;
        if (outPort.type !== inPort.type && inPort.type !== 'trigger')
            return false;
        // Remove existing connection on input (single input policy)
        if (inPort.connections.length > 0) {
            this.disconnect(inPort.connections[0], inputPortId);
        }
        outPort.connections.push(inputPortId);
        inPort.connections.push(outputPortId);
        this.recalculateExecutionOrder();
        this.emit('connected', { from: outputPortId, to: inputPortId });
        return true;
    }
    /**
     * Disconnect ports
     */
    disconnect(outputPortId, inputPortId) {
        const [outNodeId, outPortName] = outputPortId.split('.');
        const [inNodeId, inPortName] = inputPortId.split('.');
        const outNode = this.nodes.get(outNodeId);
        const inNode = this.nodes.get(inNodeId);
        if (!outNode || !inNode)
            return false;
        const outPort = outNode.outputs.get(outPortName);
        const inPort = inNode.inputs.get(inPortName);
        if (!outPort || !inPort)
            return false;
        const outIdx = outPort.connections.indexOf(inputPortId);
        const inIdx = inPort.connections.indexOf(outputPortId);
        if (outIdx >= 0)
            outPort.connections.splice(outIdx, 1);
        if (inIdx >= 0)
            inPort.connections.splice(inIdx, 1);
        this.recalculateExecutionOrder();
        this.emit('disconnected', { from: outputPortId, to: inputPortId });
        return true;
    }
    /**
     * Execute graph synchronously at given time
     */
    execute(time) {
        const results = new Map();
        const context = {
            time,
            deltaTime: 1 / 60,
            frame: Math.floor(time * 60)
        };
        for (const nodeId of this.executionOrder) {
            const node = this.nodes.get(nodeId);
            // Gather inputs from connected nodes
            const inputs = new Map();
            for (const [name, port] of node.inputs) {
                if (port.connections.length > 0) {
                    const sourcePortId = port.connections[0];
                    const value = results.get(sourcePortId);
                    inputs.set(name, value !== undefined ? value : port.defaultValue);
                }
                else {
                    inputs.set(name, port.defaultValue);
                }
            }
            // Execute node computation
            try {
                const outputs = node.compute(inputs, node.params, context);
                // Store outputs with node.port addressing
                for (const [name, value] of outputs) {
                    results.set(`${nodeId}.${name}`, value);
                }
            }
            catch (e) {
                console.error(`Error executing node ${node.id} (${node.type}):`, e);
            }
        }
        return results;
    }
    /**
     * Get node by ID
     */
    getNode(nodeId) {
        return this.nodes.get(nodeId);
    }
    /**
     * Get all nodes
     */
    getAllNodes() {
        return Array.from(this.nodes.values());
    }
    /**
     * Update node parameter
     */
    setNodeParam(nodeId, paramName, value) {
        const node = this.nodes.get(nodeId);
        if (!node)
            return false;
        node.params.set(paramName, value);
        this.emit('paramChanged', { nodeId, paramName, value });
        return true;
    }
    /**
     * Topological sort for execution order
     */
    recalculateExecutionOrder() {
        const visited = new Set();
        const temp = new Set();
        const order = [];
        const visit = (nodeId) => {
            if (temp.has(nodeId)) {
                // Cycle detected, skip to allow partial evaluation
                return;
            }
            if (visited.has(nodeId))
                return;
            temp.add(nodeId);
            const node = this.nodes.get(nodeId);
            // Visit all input dependencies
            for (const port of node.inputs.values()) {
                for (const conn of port.connections) {
                    const [sourceNodeId] = conn.split('.');
                    visit(sourceNodeId);
                }
            }
            temp.delete(nodeId);
            visited.add(nodeId);
            order.push(nodeId);
        };
        for (const nodeId of this.nodes.keys()) {
            if (!visited.has(nodeId))
                visit(nodeId);
        }
        this.executionOrder = order;
    }
    /**
     * Create a node instance by type
     */
    createNodeInstance(type, position, label) {
        const id = `node_${this.nodeCounter++}`;
        const factories = this.getNodeFactories();
        const factory = factories[type] || factories['Constant'];
        return factory(id, position, label || type);
    }
    /**
     * Available node types with factories
     */
    getNodeFactories() {
        return {
            'Constant': (id) => ({
                id,
                type: 'Constant',
                label: 'Constant',
                position: { x: 0, y: 0 },
                inputs: new Map(),
                outputs: new Map([
                    ['value', { id: 'value', name: 'value', type: 'number', isInput: false, defaultValue: 1, connections: [] }]
                ]),
                params: new Map([['value', 1]]),
                compute: (_, params) => new Map([['value', params.get('value')]])
            }),
            'LFO': (id) => ({
                id,
                type: 'LFO',
                label: 'LFO',
                position: { x: 0, y: 0 },
                inputs: new Map([
                    ['frequency', { id: 'freq', name: 'frequency', type: 'number', isInput: true, defaultValue: 1, connections: [] }],
                    ['amplitude', { id: 'amp', name: 'amplitude', type: 'number', isInput: true, defaultValue: 1, connections: [] }]
                ]),
                outputs: new Map([
                    ['output', { id: 'out', name: 'output', type: 'number', isInput: false, connections: [] }]
                ]),
                params: new Map([['waveform', 'sine']]),
                compute: (inputs, params, ctx) => {
                    const freq = inputs.get('frequency') ?? 1;
                    const amp = inputs.get('amplitude') ?? 1;
                    const t = ctx.time;
                    let value = 0;
                    switch (params.get('waveform')) {
                        case 'sine':
                            value = Math.sin(t * freq * Math.PI * 2);
                            break;
                        case 'square':
                            value = Math.sin(t * freq * Math.PI * 2) > 0 ? 1 : -1;
                            break;
                        case 'sawtooth':
                            value = 2 * ((t * freq) % 1) - 1;
                            break;
                        case 'triangle':
                            value = Math.abs(2 * ((t * freq + 0.25) % 1) - 1) * 2 - 1;
                            break;
                    }
                    return new Map([['output', value * amp]]);
                }
            }),
            'Math': (id) => ({
                id,
                type: 'Math',
                label: 'Math',
                position: { x: 0, y: 0 },
                inputs: new Map([
                    ['a', { id: 'a', name: 'a', type: 'number', isInput: true, defaultValue: 0, connections: [] }],
                    ['b', { id: 'b', name: 'b', type: 'number', isInput: true, defaultValue: 0, connections: [] }]
                ]),
                outputs: new Map([
                    ['result', { id: 'res', name: 'result', type: 'number', isInput: false, connections: [] }]
                ]),
                params: new Map([['operation', 'add']]),
                compute: (inputs, params) => {
                    const a = inputs.get('a') ?? 0;
                    const b = inputs.get('b') ?? 0;
                    const op = params.get('operation');
                    let result = 0;
                    switch (op) {
                        case 'add':
                            result = a + b;
                            break;
                        case 'subtract':
                            result = a - b;
                            break;
                        case 'multiply':
                            result = a * b;
                            break;
                        case 'divide':
                            result = b !== 0 ? a / b : 0;
                            break;
                        case 'power':
                            result = Math.pow(a, b);
                            break;
                    }
                    return new Map([['result', result]]);
                }
            }),
            'Remap': (id) => ({
                id,
                type: 'Remap',
                label: 'Remap',
                position: { x: 0, y: 0 },
                inputs: new Map([
                    ['value', { id: 'val', name: 'value', type: 'number', isInput: true, defaultValue: 0, connections: [] }]
                ]),
                outputs: new Map([
                    ['output', { id: 'out', name: 'output', type: 'number', isInput: false, connections: [] }]
                ]),
                params: new Map([['min', 0], ['max', 1], ['outMin', 0], ['outMax', 1]]),
                compute: (inputs, params) => {
                    const val = inputs.get('value') ?? 0;
                    const min = params.get('min');
                    const max = params.get('max');
                    const outMin = params.get('outMin');
                    const outMax = params.get('outMax');
                    const normalized = (val - min) / (max - min);
                    const remapped = outMin + normalized * (outMax - outMin);
                    return new Map([['output', remapped]]);
                }
            }),
            'Delay': (id) => ({
                id,
                type: 'Delay',
                label: 'Delay',
                position: { x: 0, y: 0 },
                inputs: new Map([
                    ['input', { id: 'in', name: 'input', type: 'number', isInput: true, defaultValue: 0, connections: [] }]
                ]),
                outputs: new Map([
                    ['output', { id: 'out', name: 'output', type: 'number', isInput: false, connections: [] }]
                ]),
                params: new Map([['delayTime', 0.5]]),
                compute: (inputs, params, ctx) => {
                    const delayTime = params.get('delayTime');
                    const delayedTime = ctx.time - delayTime;
                    const isDelayed = delayedTime < 0 ? 0 : 1;
                    return new Map([['output', inputs.get('input') * isDelayed]]);
                }
            })
        };
    }
    /**
     * Serialize graph to JSON
     */
    serialize() {
        const nodes = [];
        const connections = [];
        for (const node of this.nodes.values()) {
            nodes.push({
                id: node.id,
                type: node.type,
                label: node.label,
                position: node.position,
                params: Object.fromEntries(node.params)
            });
            for (const port of node.outputs.values()) {
                for (const conn of port.connections) {
                    connections.push({
                        from: `${node.id}.${port.name}`,
                        to: conn
                    });
                }
            }
        }
        return { nodes, connections, version: '2.0' };
    }
    /**
     * Deserialize graph from JSON
     */
    static deserialize(data) {
        const graph = new NodeGraph();
        for (const nodeData of data.nodes) {
            const node = graph.addNode(nodeData.type, nodeData.position, nodeData.label);
            for (const [key, value] of Object.entries(nodeData.params)) {
                graph.setNodeParam(node.id, key, value);
            }
        }
        for (const conn of data.connections) {
            graph.connect(conn.from, conn.to);
        }
        return graph;
    }
}
//# sourceMappingURL=NodeGraph.js.map