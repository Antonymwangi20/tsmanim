/**
 * Collaborative Editing Plugin
 * Real-time multi-user animation editing
 */

export { CollaborativeServer, setupCollaborativeServer } from './CollaborativeServer.js';
export { ClientConnection, BroadcastMessage } from './CollaborativeServer.js';
export { CollaborativeSession, createCollaborativeSession } from './CollaborativeSession.js';
export { RemoteUser, CollaborationEvent, UndoStackEntry } from './CollaborativeSession.js';
