import express from 'express';
import dotenv from 'dotenv';
import http from 'http'; // Need this to create a server for Socket.IO
import { Server } from 'socket.io'; // The Socket.IO server class
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import socketManager from './socket/socketManager.js';

// Import our route files (we will create these next)
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
// import orderRoutes from './routes/orderRoutes.js'; // We'll add this later

// --- Initial Setup ---
dotenv.config(); // Load .env variables
connectDB(); // Connect to MongoDB
const app = express();
const PORT = process.env.PORT || 5001;

// --- Socket.IO Setup ---
const server = http.createServer(app); // Create an HTTP server for Express
const io = new Server(server, {
  // Attach Socket.IO to the server
  cors: {
    origin: 'http://localhost:5173', // Your React app's URL
    credentials: true, // Needed for cookie-based auth
  },
});
app.set('io', io); // Make 'io' usable in our controllers
socketManager(io); // Run our socket logic (from socket/socketManager.js)

// --- Cloudinary Setup ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Middleware (Things that run on every request) ---
app.use(cors({
  origin: 'http://localhost:5173', // Allow our React app to talk to this server
  credentials: true,
}));
app.use(express.json()); // Allow server to accept JSON data
app.use(cookieParser()); // Allow server to read cookies (for our JWT)

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/orders', orderRoutes);

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});