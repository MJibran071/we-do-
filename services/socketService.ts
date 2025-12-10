
import { io, Socket } from "socket.io-client";
import { logger } from '../utils/logger';

// Use environment variable with fallback
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 1000; // 1 second

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: INITIAL_RECONNECT_DELAY,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
});

// Connection event handlers
socket.on('connect', () => {
  logger.info('WebSocket connected', { socketId: socket.id });
  reconnectAttempts = 0;
});

socket.on('disconnect', (reason) => {
  logger.warn('WebSocket disconnected', { reason });
});

socket.on('connect_error', (error) => {
  reconnectAttempts++;
  logger.error('WebSocket connection error', error);
  
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    logger.error('Max WebSocket reconnection attempts reached');
    // Could notify user or trigger fallback mechanism here
  }
});

socket.on('reconnect', (attemptNumber) => {
  logger.info(`WebSocket reconnected after ${attemptNumber} attempts`);
  reconnectAttempts = 0;
});

socket.on('reconnect_attempt', (attemptNumber) => {
  logger.debug(`WebSocket reconnection attempt ${attemptNumber}`);
});

socket.on('reconnect_failed', () => {
  logger.error('WebSocket reconnection failed after all attempts');
});

// Export connection state helper
export const getSocketState = () => ({
  connected: socket.connected,
  disconnected: socket.disconnected,
  id: socket.id,
});
