import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const PORT = process.env.PORT || 8081;
const wss = new WebSocketServer({ port: parseInt(PORT.toString()) });
const gameManager = new GameManager();

console.log(`Chess WebSocket server started on port ${PORT}`);

wss.on('connection', function connection(ws) {
    console.log('New client connected');
    gameManager.addUser(ws);

    // Handle connection close
    ws.on('close', () => {
        console.log('Client disconnected');
        gameManager.removeUser(ws);
    });

    // Handle connection errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        gameManager.removeUser(ws);
    });
});

// Handle server errors
wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    wss.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

// Health check endpoint for deployment platforms
if (process.env.NODE_ENV === 'production') {
    const http = require('http');
    const server = http.createServer((req: any, res: any) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Chess Server is running!');
    });
    server.listen(process.env.HEALTH_CHECK_PORT || 3000);
    console.log(`Health check server started on port ${process.env.HEALTH_CHECK_PORT || 3000}`);
}