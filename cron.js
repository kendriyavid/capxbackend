import cron from 'node-cron';
import supabaseInstance from './supabaseClient.js';
import finnhub from 'finnhub';
import EventEmitter from 'events';
import app from './app.js';
import authenticateJWT from './middleware/authenticateJWT.js';

const supabase = supabaseInstance.getClient();
const stockUpdates = new EventEmitter();

// Initialize Finnhub
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_API_KEY;
const finnhubClient = new finnhub.DefaultApi();

// Stock symbols
const STOCK_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NFLX', 'META', 'NVDA', 'INTC', 'BABA'];

let isUpdating = false;

// Update single stock price
async function updateStockPrice(symbol, price) {
    try {
        const { error } = await supabase
            .from('stocks')
            .update({ 
                current_price: price, 
                last_updated: new Date()
            })
            .eq('stock_symbol', symbol);

        if (error) throw error;
    } catch (error) {
        console.error(`Error updating ${symbol}:`, error);
    }
}

// Fetch batch data
async function fetchBatchData() {
    if (isUpdating) {
        console.log('Update already in progress, skipping...');
        return;
    }

    isUpdating = true;

    try {
        const requests = STOCK_SYMBOLS.map(symbol => {
            return new Promise((resolve, reject) => {
                finnhubClient.quote(symbol, (error, data, response) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ symbol, data });
                    }
                });
            });
        });

        const results = await Promise.all(requests);
        for (const { symbol, data } of results) {
            if (data?.c != null) {
                await updateStockPrice(symbol, data.c);
                console.log(`Updated ${symbol} price: ${data.c}`);
            }
        }
        
        stockUpdates.emit('batchUpdate', results);
        console.log('Batch update completed and event emitted');
        
    } catch (error) {
        console.error('Error in batch update:', error);
    } finally {
        isUpdating = false;
    }
}

// Setup SSE endpoint
app.get('/api/sse',(req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    res.write('data: {"type":"connected"}\n\n');

    const batchUpdateListener = (updates) => {
        const message = {
            type: 'update',
            timestamp: new Date().toISOString(),
            data: updates
        };
        res.write(`data: ${JSON.stringify(message)}\n\n`);
        console.log('Sent update to client');
    };

    stockUpdates.on('batchUpdate', batchUpdateListener);

    req.on('close', () => {
        stockUpdates.removeListener('batchUpdate', batchUpdateListener);
        res.end();
        console.log('Client disconnected');
    });
});

// Start cron job
cron.schedule('*/30 * * * * *', fetchBatchData);

console.log('Stock price update scheduler started');