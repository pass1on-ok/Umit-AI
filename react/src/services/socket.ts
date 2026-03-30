import { io, type Socket } from 'socket.io-client';

const rawBase = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const SOCKET_URL = rawBase.replace(/\/api\/?$/, '');

export const createSocket = (token?: string): Socket => {
  return io(SOCKET_URL, {
    auth: {
      token,
    },
    transports: ['websocket'],
    reconnectionAttempts: 5,
    autoConnect: false,
  });
};
