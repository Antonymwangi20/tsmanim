// src/collab/CollaborativeServer.ts
/**
 * WebSocket server for real-time collaborative editing
 * Broadcast changes to all connected clients with conflict resolution
 */
/**
 * Collaborative server for handling real-time sync
 * Integrates with Node.js/Express WebSocket server
 */
export class CollaborativeServer {
    sessions = new Map();
    clients = new Map();
    messageHistory = new Map();
    maxHistoryPerSession = 1000;
    /**
     * Register new client connection
     */
    registerClient(sessionId, clientId, userId, userName, userColor, socket) {
        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, new Set());
            this.messageHistory.set(sessionId, []);
        }
        const connection = {
            id: clientId,
            userId,
            userName,
            userColor,
            socket,
            lastPing: Date.now()
        };
        this.clients.set(clientId, connection);
        this.sessions.get(sessionId).add(connection);
        // Send existing history to new client
        const history = this.messageHistory.get(sessionId) || [];
        socket.send(JSON.stringify({
            type: 'syncHistory',
            data: history.slice(-100) // Last 100 messages
        }));
        // Broadcast user joined
        this.broadcastToSession(sessionId, {
            type: 'userJoined',
            userId,
            timestamp: Date.now(),
            data: { userName, userColor },
            sessionId
        });
    }
    /**
     * Handle incoming message from client
     */
    handleMessage(clientId, message) {
        const client = this.clients.get(clientId);
        if (!client)
            return;
        // Find session for this client
        let sessionId = null;
        for (const [sid, clients] of this.sessions) {
            if (Array.from(clients).some(c => c.id === clientId)) {
                sessionId = sid;
                break;
            }
        }
        if (!sessionId)
            return;
        // Add metadata
        message.userId = client.userId;
        message.timestamp = Date.now();
        message.sessionId = sessionId;
        // Store in history
        const history = this.messageHistory.get(sessionId);
        history.push(message);
        if (history.length > this.maxHistoryPerSession) {
            history.shift();
        }
        // Broadcast to all clients in session
        this.broadcastToSession(sessionId, message);
    }
    /**
     * Broadcast message to all clients in session
     */
    broadcastToSession(sessionId, message) {
        const clients = this.sessions.get(sessionId);
        if (!clients)
            return;
        const payload = JSON.stringify(message);
        for (const client of clients) {
            try {
                client.socket.send(payload);
            }
            catch (error) {
                console.error(`Failed to send to client ${client.id}:`, error);
            }
        }
    }
    /**
     * Unregister client on disconnect
     */
    unregisterClient(clientId) {
        const client = this.clients.get(clientId);
        if (!client)
            return;
        // Find and remove from session
        for (const [sessionId, clients] of this.sessions) {
            const hadClient = clients.has(client);
            clients.delete(client);
            if (hadClient && clients.size === 0) {
                // Session empty, clean up
                this.sessions.delete(sessionId);
                this.messageHistory.delete(sessionId);
            }
            else if (hadClient) {
                // Broadcast user left
                this.broadcastToSession(sessionId, {
                    type: 'userLeft',
                    userId: client.userId,
                    timestamp: Date.now(),
                    data: {},
                    sessionId
                });
            }
        }
        this.clients.delete(clientId);
    }
    /**
     * Heartbeat to detect stale connections
     */
    pingClient(clientId) {
        const client = this.clients.get(clientId);
        if (!client)
            return false;
        const timeSincePing = Date.now() - client.lastPing;
        if (timeSincePing > 30000) { // 30 second timeout
            this.unregisterClient(clientId);
            return false;
        }
        client.lastPing = Date.now();
        return true;
    }
    /**
     * Get session info
     */
    getSessionInfo(sessionId) {
        const clients = this.sessions.get(sessionId);
        if (!clients)
            return null;
        return {
            sessionId,
            clientCount: clients.size,
            clients: Array.from(clients).map(c => ({
                id: c.id,
                userId: c.userId,
                userName: c.userName,
                userColor: c.userColor
            })),
            historyLength: this.messageHistory.get(sessionId)?.length || 0
        };
    }
    /**
     * Get all active sessions
     */
    getActiveSessions() {
        return Array.from(this.sessions.keys());
    }
}
export const createCollaborativeServer = () => {
    return new CollaborativeServer();
};
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
export function setupCollaborativeServer(wss) {
    const collabServer = new CollaborativeServer();
    const clients = new Map();
    wss.on('connection', (ws, req) => {
        const clientId = `client_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        console.log(`✅ Client connected: ${clientId}`);
        ws.on('message', (data) => {
            try {
                const message = JSON.parse(data);
                if (message.type === 'init') {
                    // Client initialization
                    const { sessionId, userId, userName, userColor } = message;
                    clients.set(ws, clientId);
                    collabServer.registerClient(sessionId, clientId, userId, userName, userColor, ws);
                }
                else if (clients.has(ws)) {
                    // Regular message
                    collabServer.handleMessage(clientId, message);
                }
            }
            catch (error) {
                console.error('Error handling message:', error);
            }
        });
        ws.on('close', () => {
            if (clients.has(ws)) {
                collabServer.unregisterClient(clientId);
                clients.delete(ws);
            }
            console.log(`❌ Client disconnected: ${clientId}`);
        });
        ws.on('error', (error) => {
            console.error(`WebSocket error for ${clientId}:`, error);
        });
    });
    // Heartbeat
    setInterval(() => {
        wss.clients.forEach((ws) => {
            const clientId = Array.from(clients.entries()).find(([socket]) => socket === ws)?.[1];
            if (clientId && !collabServer.pingClient(clientId)) {
                ws.close();
            }
            else if (ws.isAlive === false) {
                ws.terminate();
            }
            else {
                ws.isAlive = false;
                ws.ping();
            }
        });
    }, 10000);
    return collabServer;
}
//# sourceMappingURL=CollaborativeServer.js.map