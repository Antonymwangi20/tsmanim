/**
 * WebSocket server for real-time collaborative editing
 * Broadcast changes to all connected clients with conflict resolution
 */
export interface ClientConnection {
    id: string;
    userId: string;
    userName: string;
    userColor: string;
    socket: any;
    lastPing: number;
}
export interface BroadcastMessage {
    type: 'action' | 'undo' | 'redo' | 'selectionChanged' | 'cursorMoved' | 'userJoined' | 'userLeft';
    userId: string;
    timestamp: number;
    data: any;
    sessionId: string;
}
/**
 * Collaborative server for handling real-time sync
 * Integrates with Node.js/Express WebSocket server
 */
export declare class CollaborativeServer {
    private sessions;
    private clients;
    private messageHistory;
    private maxHistoryPerSession;
    /**
     * Register new client connection
     */
    registerClient(sessionId: string, clientId: string, userId: string, userName: string, userColor: string, socket: any): void;
    /**
     * Handle incoming message from client
     */
    handleMessage(clientId: string, message: BroadcastMessage): void;
    /**
     * Broadcast message to all clients in session
     */
    private broadcastToSession;
    /**
     * Unregister client on disconnect
     */
    unregisterClient(clientId: string): void;
    /**
     * Heartbeat to detect stale connections
     */
    pingClient(clientId: string): boolean;
    /**
     * Get session info
     */
    getSessionInfo(sessionId: string): any;
    /**
     * Get all active sessions
     */
    getActiveSessions(): string[];
}
export declare const createCollaborativeServer: () => CollaborativeServer;
/**
 * WebSocket server setup (Express.js integration)
 * Usage:
 * ```typescript
 * import express from 'express';
 * import WebSocket from 'ws';
 * import { setupCollaborativeServer } from '@ts-manim/collab/CollaborativeServer';
 *
 * const app = express();
 * const server = app.listen(3001);
 * const wss = new WebSocket.Server({ server });
 * setupCollaborativeServer(wss);
 * ```
 */
export declare function setupCollaborativeServer(wss: any): CollaborativeServer;
//# sourceMappingURL=CollaborativeServer.d.ts.map