require('dotenv').config();
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const PORT = process.env.PORT || 5000;

const cors = require("cors");
const app = express();
app.use(cors());  // Enable CORS for all routes


const server = http.createServer(app);
const io = socketIO(server);

// Store active users and their socket IDs
const connectedUsers = {};
// Export the socket.io instance and the connectedUsers object
module.exports = { io, connectedUsers };

const mongoose = require('mongoose');

const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const { rateLimit } = require("express-rate-limit")

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Max 100 requests per IP
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(express.json());

app.use(cookieParser());
process.on('uncaughtException', function (err) {
    console.log(err);
});

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const adminRoutes = require('./routes/admin/adminRoutes');
const cronRoutes = require('./routes/cronRoutes');
const googleRoutes = require('./routes/googleRoutes');
const connectDB = require('./config/db');









// Serve static files from the 'Uploads/Images' directory
app.use('/Uploads/Images', express.static('Uploads/Images'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/meeting', meetingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cron', cronRoutes);
app.use('/api/google', googleRoutes);

// Serve the client-side HTML file
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client-side.html");
});

// Connect to MongoDB (or your database)
connectDB();

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New user connected', socket.id);

    // Listen for user login event to map cognitoUserId to socket.id
    socket.on('registerUser', (cognitoUserId) => {
        connectedUsers[cognitoUserId] = socket.id;
        console.log(`User ${cognitoUserId} connected with socket ${socket.id}`);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        for (const [userId, socketId] of Object.entries(connectedUsers)) {
            if (socketId === socket.id) {
                console.log(`User ${userId} disconnected`);
                delete connectedUsers[userId]; 
                break;
            }
        }
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('An error occurred:', err); // Log the error for debugging
    res.status(err.status || 500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}, // Send detailed error in development mode
    });
});

// Start the server

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Process event listeners for uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Optionally shut down the server or restart the process
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Optionally shut down the server or restart the process
});



