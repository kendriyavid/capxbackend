import supabaseInstance from '../supabaseClient.js';
const supabase = supabaseInstance.getClient();

// api/stocks/getallstocks
const getAllStocks = async (req, res) => { // Add req if necessary for logic
    try {
        console.log("Fetching all stocks...");
        const { data, error } = await supabase
            .from('stocks')
            .select('*')
            .order('stock_symbol');

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

//http://localhost:3000/api/stocks/getstock/a324d334-82a6-494e-ae56-11aeec60b53c

const getStock = async (req, res) => {
        try {
            const { stockSymbol } = req.params;
            console.log(stockSymbol);
            const { data, error } = await supabase
                .from('stocks')
                .select('*')
                .eq('stock_symbol', stockSymbol)
                .single();

            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

const getUserPortfolio = async (req, res) => {
        try {
            const { user } = req;
            console.log(user)
            const { data, error } = await supabase
                .from('user_stocks')
                .select(`
                    *,
                    stocks (
                        stock_symbol,
                        stock_name,
                        current_price
                        
                    )
                `)
                .eq('user_id', user.id);
            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

const getUserValuation = async (req, res) => {
    try {
        console.log("nhere");
        const { user } = req;
        console.log(user)
        const { data, error } = await supabase
            .from('user_stocks')
            .select(`
                units_held,
                stocks (
                    current_price
                )
            `)
            .eq('user_id', user.id);
        const portfolioValuation = data.reduce((acc, stock) => {
            return acc + (stock.units_held * stock.stocks.current_price);
        }, 0);
        console.log(portfolioValuation);
        res.json( portfolioValuation );
    } catch (error) {
        res.status(400).json({ error: error.message });
    }}


    // {
    //     "stock_id": "a324d334-82a6-494e-ae56-11aeec60b53c",
    //     "units": 5,
    //     "user":{
    //         "id":"b5e1a06e-effa-4418-a4fd-90f0a6e2decd"
    //     }
    // }

const buyStock = async (req, res) => {
        try {
            console.log("here");
            
            const { symbol, units } = req.body;
            const {user} = req;
            console.log(symbol, units,user);

            const { data: stock } = await supabase
                .from('stocks')
                .select(`id, current_price`)
                .eq('stock_symbol', symbol)
                .single();

            const { data: existingPosition, error: positionError } = await supabase
            .from('user_stocks')
            .select('*')
            .eq('user_id', user.id)
            .eq('stock_id', stock.id)
            .single();
            console.log(existingPosition);
            
            console.log("outside the existing position block");
            if (existingPosition) {
                console.log("inside the existing position block 1");
                const newUnits = existingPosition.units_held + Number(units);
                console.log("newunits",newUnits);
                const newAvgPrice = ((existingPosition.average_price * existingPosition.units_held) + 
                    (stock.current_price * units)) / newUnits;
                console.log("newAvgPrice",newAvgPrice);
                const { error: updateError } = await supabase
                    .from('user_stocks')
                    .update({
                        units_held: newUnits,
                        average_price: newAvgPrice
                    })
                    .eq('id', existingPosition.id);

                if (updateError) throw updateError;
            } else {
                console.log("inside the existing position block 2");
                const { error: insertError } = await supabase
                    .from('user_stocks')
                    .insert([{
                        user_id: user.id,
                        stock_id: stock.id,
                        units_held: units,
                        average_price: stock.current_price
                    }]);

                if (insertError) throw insertError;
            }

            const transaction = {
                user_id: user.id,
                stock_id: stock.id,
                transaction_type: 'BUY',
                units,
                price_per_unit: stock.current_price,
                timestamp: new Date()
            };

            const { error: transactionError } = await supabase
                .from('transactions')
                .insert([transaction]);
            
            if (transactionError) throw transactionError;
            console.log("inserted transaction");
            const { data, error } = await supabase
                .from('user_stocks')
                .select(`
                    *,
                    stocks (
                        stock_symbol,
                        stock_name,
                        current_price
                        
                    )
                `)
                .eq('user_id', user.id);

            if (error) throw error;
            console.log(data);
            res.json(data);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }


    // {
    //     "stock_id": "a324d334-82a6-494e-ae56-11aeec60b53c",
    //     "units": 3,
    //     "user":{
    //         "id":"b5e1a06e-effa-4418-a4fd-90f0a6e2decd"
    //     }
    // }


    // Sell stocks
const sellStock = async (req, res) => {
        try {
            const { symbol, units } = req.body;
            const {user} = req;
            
            const { data: id } = await supabase
            .from('stocks')
            .select(`id`)
            .eq('stock_symbol', symbol)
            .single();

            const { data: position } = await supabase
                .from('user_stocks')
                .select('*')
                .eq('user_id', user.id)
                .eq('stock_id', id.id)
                .single();

            if (!position || position.units_held < units) {
                throw new Error('Insufficient units to sell');
            }

            const { data: stock } = await supabase
                .from('stocks')
                .select('current_price')
                .eq('id', id.id)
                .single();

            const transaction = {
                user_id: user.id,
                stock_id: id.id,
                transaction_type: 'SELL',
                units,
                price_per_unit: stock.current_price,
                timestamp: new Date()
            };

            const { error: transactionError } = await supabase
                .from('transactions')
                .insert([transaction]);

            if (transactionError) throw transactionError;

            const newUnits = position.units_held - units;
            
            if (newUnits === 0) {
                const { error: deleteError } = await supabase
                    .from('user_stocks')
                    .delete()
                    .eq('id', position.id);

                if (deleteError) throw deleteError;
            } else {
                const { error: updateError } = await supabase
                    .from('user_stocks')
                    .update({ units_held: newUnits })
                    .eq('id', position.id);

                if (updateError) throw updateError;
            }

            const { data, error } = await supabase
            .from('user_stocks')
            .select(`
                *,
                stocks (
                    stock_symbol,
                    stock_name,
                    current_price
                    
                )
            `)
            .eq('user_id', user.id);

            if (error) throw error;
            console.log(data);
            res.json(data);

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }



    // Get transaction history
const  getTransactionHistory = async (req, res) => {
    // console.log(req)
        try {
            // const {user} = req.body;
            const {user} = req;
            console.log(user.id);
            const { data, error } = await supabase
                .from('transactions')
                .select(`
                    *,
                    stocks (
                        stock_symbol,
                        stock_name
                    )
                `)
                .eq('user_id', user.id)
                .order('timestamp', { ascending: false });

            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }


    export { 
        getAllStocks, 
        getStock, 
        getUserPortfolio, 
        buyStock, // Add this here
        sellStock, 
        getTransactionHistory,
        getUserValuation,
    };
    getUserValuation

//test deployment