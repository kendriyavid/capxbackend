import express from 'express';    
import {getAllStocks ,getStock, getUserPortfolio, buyStock, sellStock, getTransactionHistory, getUserValuation } from '../controllers/stockController.js';
import authenticateJWT from '../middleware/authenticateJWT.js'

const router = express.Router();

router.get('/getallstocks',getAllStocks);
router.get('/getstock/:stockId',getStock);
router.post('/getuserportfolio',getUserPortfolio);
router.post('/buystock',buyStock);
router.post('/sellstock',sellStock);
router.post('/gettransactionhistory',getTransactionHistory);
router.post('/getvaluation', getUserValuation);


export default router;