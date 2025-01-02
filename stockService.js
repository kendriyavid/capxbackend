import { EventEmitter } from 'events';
import finnhub from 'finnhub';
import supabaseInstance from '../supabaseClient';
const supabase = supabaseInstance.getClient();

class StockService {
    constructor() {
        this.eventEmitter = new EventEmitter();
        this.finnhubClient = this.setupFinnhub();
        this.isUpdating = false;ctndvr1r01qn483k9kt0ctndvr1r01qn483k9ktg
    }

    setupFinnhub() {
        const api_key = finnhub.ApiClient.instance.authentications['api_key'];
        api_key.apiKey = "";
        return new finnhub.DefaultApi();
    }

    async updateStockPrice(symbol, price) {
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

    async fetchBatchData() {
        // Prevent multiple simultaneous updates
        if (this.isUpdating) return;
        this.isUpdating = true;

        const stockSymbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NFLX', 'META', 'NVDA', 'INTC', 'BABA'];
        
        const requests = stockSymbols.map(symbol => {
            return new Promise((resolve, reject) => {
                this.finnhubClient.quote(symbol, (error, data, response) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ symbol, data });
                    }
                });
            });
        });

        try {
            const results = await Promise.all(requests);
            for (const { symbol, data } of results) {
                if (data?.c != null) {
                    await this.updateStockPrice(symbol, data.c);
                    console.log(`Updated ${symbol} price: ${data.c}`);
                }
            }
            
            // Emit the batch update event with results
            this.eventEmitter.emit('batchUpdate', results);
            console.log('Batch update completed and event emitted');
            
        } catch (error) {
            console.error('Error fetching batch data:', error);
        } finally {
            this.isUpdating = false;
        }
    }

    startUpdateCycle() {
        const runUpdate = async () => {
            await this.fetchBatchData();
            // Schedule next update after 30 seconds
            setTimeout(runUpdate, 30000);
        };

        // Start the first update immediately
        runUpdate();
        console.log('Stock price update cycle started');
    }

    getEventEmitter() {
        return this.eventEmitter;
    }
}

// const stockService = new StockService();
module.exports = StockService;
