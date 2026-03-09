/**
 * Collaborative editing session using CRDT (Conflict-free Replicated Data Types)
 * Ready for Yjs integration with WebSocket sync
 *
 * This is a foundational implementation that can be enhanced with:
 * - Yjs for real-time CRDT sync
 * - y-websocket for server communication
 * - Awareness for presence features
 */
export interface RemoteUser {
    id: string;
    name: string;
    color: string;
    cursor?: {
        x: number;
        y: number;
    };
    selection?: string[];
}
export interface CollaborationEvent {
    type: 'nodeAdded' | 'nodeRemoved' | 'nodeModified' | 'connected' | 'disconnected';
    userId: string;
    timestamp: number;
    data: any;
}
export interface UndoStackEntry {
    type: string;
    userId: string;
    timestamp: number;
    data: any;
    reverse: (data: any) => any;
}
/**
 * Collaborative session manager for real-time multi-user editing
 */
export declare class CollaborativeSession {
    private sessionId;
    private userId;
    private userName;
    private userColor;
    private remoteUsers;
    private undoStack;
    private redoStack;
    private eventHistory;
    private listeners;
    private ws;
    private serverUrl;
    private isConnected;
    constructor(sessionId: string, userId: string, userName: string, serverUrl?: string);
    /**
     * Initialize connection (extend with actual WebSocket in production)
     */
    connect(): Promise<void>;
    /**
     * Record action for undo/redo
     */
    recordAction(type: string, data: any, reverse: (data: any) => any): void;
    /**
     * Undo last action
     */
    undo(): boolean;
    /**
     * Redo last undone action
     */
    redo(): boolean;
    /**
     * Update user selection
     */
    setSelection(nodeIds: string[]): void;
    /**
     * Update cursor position
     */
    setCursor(x: number, y: number): void;
    /**
     * Get list of remote users
     */
    getRemoteUsers(): RemoteUser[];
    /**
     * Listen to collaboration events
     */
    on(event: string, callback: Function): void;
    /**
     * Unsubscribe from event
     */
    off(event: string, callback?: Function): void;
    /**
     * Emit event to subscribers
     */
    private emit;
    /**
     * Broadcast message to other users
     */
    private broadcast;
    /**
     * Merge remote changes (CRDT-like conflict resolution)
     */
    applyRemoteChange(userId: string, change: any): boolean;
    /**
     * Get session state for sharing
     */
    getSessionState(): object;
    /**
     * Save session to file
     */
    exportSession(): string;
    /**
     * Load session from data
     */
    importSession(data: string): boolean;
    /**
     * Leave session
     */
    disconnect(): void;
    /**
     * Generate user color
     */
    private generateColor;
    /**
     * Setup WebSocket handlers (for future implementation)
     */
    private setupWebSocketHandlers;
}
export declare const createCollaborativeSession: (sessionId: string, userId: string, userName: string) => CollaborativeSession;
//# sourceMappingURL=CollaborativeSession.d.ts.map