// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// require('./cron.js');
// dotenv.config();
// // import {stockUpdates} from './cron.js';

// const app = express();

// app.use(cors({
//     origin: 'http://localhost:5173',  // Add your frontend development server
//     credentials: true  // Allows credentials to be shared, such as cookies or headers
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// const authRoutes = require('./routes/authRoutes');
// const stockRoutes = require('./routes/stockRoutes');
// const userRoutes = require('./routes/userRoutes');


// // Use routes
// app.use('/api/auth', authRoutes);
// app.use('/api/stocks', stockRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/sse', (req,res) => {
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');

//     const batchUpdateListener = (updates) => {
//         res.write(`data: ${JSON.stringify(updates)}\n\n`);
//     };

//     stockUpdates.on('batchUpdate', batchUpdateListener);

//     req.on('close', () => {
//         stockUpdates.removeListener('batchUpdate', batchUpdateListener);
//     });
// });


// app.post('/', (req, res) => {
//     console.log(req.body);
//     const {name,email} = req.body;
//     console.log(name,email);
//     res.send('Welcome to the Stock Trading API');
// });

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Something went wrong. Please try again later.' });
// });

// module.exports = app;


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();
const app = express();

app.use(cors({
    origin:[ 'http://localhost:5173','http://192.168.56.1:5173', 'https://ca46-2405-201-1d-c0a5-d907-46c4-7d6f-3414.ngrok-free.app'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from './routes/authRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import userRoutes from './routes/userRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/user', userRoutes);

// SSE endpoint
// import supabaseClient from './supabaseClient.js';
// const supabase = new supabaseClient();
// import StockService from './stockService.js';
// const stockService = new StockService();

// app.get('/api/sse', (req, res) => {
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');
//     res.write('data: {"type":"connected"}\n\n');

//     const eventEmitter = stockService.getEventEmitter();
    
//     const batchUpdateListener = (updates) => {
//         const message = {
//             type: 'update',
//             timestamp: new Date().toISOString(),
//             data: updates
//         };
//         res.write(`data: ${JSON.stringify(message)}\n\n`);
//     };

//     eventEmitter.on('batchUpdate', batchUpdateListener);

//     // Handle client disconnect
//     req.on('close', () => {
//         eventEmitter.removeListener('batchUpdate', batchUpdateListener);
//         res.end();
//     });
// });

app.post('/', (req, res) => {
    console.log(req.body);
    const {name, email} = req.body;
    console.log(name, email);
    res.send('Welcome to the Stock Trading API');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
});

// stockService.startUpdateCycle();
export default app;