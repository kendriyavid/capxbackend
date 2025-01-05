import express from 'express';    
import {getAllStocks ,getStock, getUserPortfolio, buyStock, sellStock, getTransactionHistory, getUserValuation } from '../controllers/stockController.js';
import authenticateJWT from '../middleware/authenticateJWT.js'

const router = express.Router();

router.get('/getallstocks',authenticateJWT,getAllStocks);
router.get('/getstock/:stockId',authenticateJWT,getStock);
router.post('/getuserportfolio',authenticateJWT,getUserPortfolio);
router.post('/buystock',authenticateJWT,buyStock);
router.post('/sellstock',authenticateJWT,sellStock);
router.post('/gettransactionhistory',authenticateJWT,getTransactionHistory);
router.post('/getvaluation',authenticateJWT, getUserValuation);


export default router;