import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();
console.log("here")
import './cron.js';
const PORT = process.env.PORT || 3000;
console.log(process.env.VITE_SUPABASE_URL)
const server = http.createServer(app);

// Error handling
server.on('error', (error) => {
    if (error.syscall !== 'listen') throw error;
    console.error(`Failed to start server: ${error}`);
    process.exit(1);
});

// Graceful shutdown
const shutdown = () => {
    server.close(async () => {
        console.log('Server shutting down...');
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
