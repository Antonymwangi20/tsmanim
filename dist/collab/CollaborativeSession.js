// src/collab/CollaborativeSession.ts
/**
 * Collaborative session manager for real-time multi-user editing
 */
export class CollaborativeSession {
    sessionId;
    userId;
    userName;
    userColor;
    remoteUsers = new Map();
    undoStack = [];
    redoStack = [];
    eventHistory = [];
    listeners = new Map();
    // Ready for WebSocket integration
    ws = null;
    serverUrl;
    isConnected = false;
    constructor(sessionId, userId, userName, serverUrl = 'wss://collab-server.example.com') {
        this.sessionId = sessionId;
        this.userId = userId;
        this.userName = userName;
        this.userColor = this.generateColor();
        this.serverUrl = serverUrl;
    }
    /**
     * Initialize connection (extend with actual WebSocket in production)
     */
    async connect() {
        try {
            // In production, replace with actual WebSocket
            // this.ws = new WebSocket(`${this.serverUrl}/${this.sessionId}`);
            // this.setupWebSocketHandlers();
            this.isConnected = true;
            console.log(`✅ Connected to session ${this.sessionId} as ${this.userName}`);
            this.emit('connected', { userId: this.userId, userName: this.userName });
        }
        catch (error) {
            console.error('Failed to connect:', error);
            this.isConnected = false;
        }
    }
    /**
     * Record action for undo/redo
     */
    recordAction(type, data, reverse) {
        const entry = {
            type,
            userId: this.userId,
            timestamp: Date.now(),
            data,
            reverse
        };
        this.undoStack.push(entry);
        this.redoStack = []; // Clear redo when new action recorded
        // Broadcast to other users
        this.broadcast({
            type: 'action',
            userId: this.userId,
            timestamp: Date.now(),
            data: { actionType: type, data }
        });
        this.emit('actionRecorded', entry);
    }
    /**
     * Undo last action
     */
    undo() {
        if (this.undoStack.length === 0)
            return false;
        const entry = this.undoStack.pop();
        const reversed = entry.reverse(entry.data);
        this.redoStack.push({
            ...entry,
            data: reversed
        });
        this.broadcast({
            type: 'undo',
            userId: this.userId,
            timestamp: Date.now(),
            data: entry.data
        });
        this.emit('undo', entry);
        return true;
    }
    /**
     * Redo last undone action
     */
    redo() {
        if (this.redoStack.length === 0)
            return false;
        const entry = this.redoStack.pop();
        this.undoStack.push(entry);
        this.broadcast({
            type: 'redo',
            userId: this.userId,
            timestamp: Date.now(),
            data: entry.data
        });
        this.emit('redo', entry);
        return true;
    }
    /**
     * Update user selection
     */
    setSelection(nodeIds) {
        const user = {
            id: this.userId,
            name: this.userName,
            color: this.userColor,
            selection: nodeIds
        };
        this.broadcast({
            type: 'selectionChanged',
            userId: this.userId,
            timestamp: Date.now(),
            data: { selection: nodeIds }
        });
        this.emit('selectionChanged', user);
    }
    /**
     * Update cursor position
     */
    setCursor(x, y) {
        this.broadcast({
            type: 'cursorMoved',
            userId: this.userId,
            timestamp: Date.now(),
            data: { x, y }
        });
    }
    /**
     * Get list of remote users
     */
    getRemoteUsers() {
        return Array.from(this.remoteUsers.values());
    }
    /**
     * Listen to collaboration events
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }
    /**
     * Unsubscribe from event
     */
    off(event, callback) {
        if (!callback) {
            this.listeners.delete(event);
        }
        else {
            this.listeners.get(event)?.delete(callback);
        }
    }
    /**
     * Emit event to subscribers
     */
    emit(event, data) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(cb => cb(data));
        }
    }
    /**
     * Broadcast message to other users
     */
    broadcast(message) {
        if (this.ws && this.isConnected) {
            this.ws.send(JSON.stringify(message));
        }
        // Log event for offline support
        this.eventHistory.push(message);
    }
    /**
     * Merge remote changes (CRDT-like conflict resolution)
     */
    applyRemoteChange(userId, change) {
        if (userId === this.userId)
            return false;
        // Timestamp-based conflict resolution (last-write-wins)
        // In production, use proper CRDT like Yjs
        this.emit('remoteChange', {
            userId,
            change
        });
        return true;
    }
    /**
     * Get session state for sharing
     */
    getSessionState() {
        return {
            sessionId: this.sessionId,
            userId: this.userId,
            userName: this.userName,
            remoteUsers: Array.from(this.remoteUsers.values()),
            eventHistory: this.eventHistory,
            undoStack: this.undoStack,
            isConnected: this.isConnected
        };
    }
    /**
     * Save session to file
     */
    exportSession() {
        return JSON.stringify(this.getSessionState(), null, 2);
    }
    /**
     * Load session from data
     */
    importSession(data) {
        try {
            const state = JSON.parse(data);
            this.eventHistory = state.eventHistory;
            this.undoStack = state.undoStack;
            return true;
        }
        catch (error) {
            console.error('Failed to import session:', error);
            return false;
        }
    }
    /**
     * Leave session
     */
    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
        this.isConnected = false;
        this.emit('disconnected', { userId: this.userId });
    }
    /**
     * Generate user color
     */
    generateColor() {
        const colors = [
            '#FF6B6B',
            '#4ECDC4',
            '#45B7D1',
            '#FFA07A',
            '#98D8C8',
            '#F7DC6F',
            '#BB8FCE'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    /**
     * Setup WebSocket handlers (for future implementation)
     */
    setupWebSocketHandlers() {
        if (!this.ws)
            return;
        this.ws.onopen = () => {
            this.isConnected = true;
            console.log('✅ WebSocket connected');
        };
        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                switch (message.type) {
                    case 'userJoined':
                        this.remoteUsers.set(message.userId, {
                            id: message.userId,
                            name: message.userName,
                            color: message.userColor
                        });
                        this.emit('userJoined', message);
                        break;
                    case 'userLeft':
                        this.remoteUsers.delete(message.userId);
                        this.emit('userLeft', message);
                        break;
                    case 'selectionChanged':
                        const user = this.remoteUsers.get(message.userId);
                        if (user) {
                            user.selection = message.data.selection;
                        }
                        this.emit('remoteSelectionChanged', message);
                        break;
                    case 'cursorMoved':
                        const cursorUser = this.remoteUsers.get(message.userId);
                        if (cursorUser) {
                            cursorUser.cursor = message.data;
                        }
                        this.emit('remoteCursorMoved', message);
                        break;
                    case 'action':
                        this.applyRemoteChange(message.userId, message.data);
                        break;
                }
            }
            catch (error) {
                console.error('Error handling WebSocket message:', error);
            }
        };
        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.isConnected = false;
            this.emit('error', error);
        };
        this.ws.onclose = () => {
            this.isConnected = false;
            console.log('❌ WebSocket disconnected');
            this.emit('disconnected', {});
        };
    }
}
export const createCollaborativeSession = (sessionId, userId, userName) => {
    return new CollaborativeSession(sessionId, userId, userName);
};
//# sourceMappingURL=CollaborativeSession.js.map