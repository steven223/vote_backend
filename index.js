require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const pollRoutes = require('./src/routes/pollRoutes');
const voteRoutes = require('./src/routes/voteRoutes');

// Import middleware
const { attachSocketIO } = require('./src/middleware/socketMiddleware');

// Import socket handlers
const handlePollSocket = require('./src/socket/pollSocket');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://127.0.0.1:3000", "null"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "null"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from examples directory
app.use('/examples', express.static('examples'));

// Attach Socket.IO to requests
app.use(attachSocketIO(io));

// Health check route
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head><title>Real-Time Polling Backend</title></head>
            <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px;">
                <h1>Real-Time Polling Backend Service</h1>
                <p><strong>Status:</strong> Running</p>
                <p><strong>Version:</strong> 1.0.0</p>
                
                <h2>Live Data Viewers</h2>
                <ul>
                    <li><a href="/examples/socket-client.html" target="_blank">Full Dashboard (Real-time)</a></li>
                    <li><a href="/examples/simple-viewer.html" target="_blank">Simple Viewer (Auto-refresh)</a></li>
                </ul>
                
                <h2>API Endpoints</h2>
                <ul>
                    <li><a href="/api/status" target="_blank">Server Status</a></li>
                    <li><a href="/api/polls" target="_blank">All Polls (JSON)</a></li>
                </ul>
            </body>
        </html>
    `);
});

app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        connectedClients: io.engine.clientsCount,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/votes', voteRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    handlePollSocket(io, socket);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Real-Time Polling Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}`);
});