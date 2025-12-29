import { io } from 'socket.io-client';

// Connect to your backend's socket server
const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
});

socket.on('connect', () => {
  console.log(`🔌 Socket connected with ID: ${socket.id}`);
});

socket.on('disconnect', () => {
  console.log('🔥 Socket disconnected');
});

export default socket;