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
    origin:[ 'http://localhost:5173','http://192.168.56.1:5173', 'https://capxfrontend.onrender.com'],
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

export default app;