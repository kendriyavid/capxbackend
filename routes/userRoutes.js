import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import authenticateJWT from '../middleware/authenticateJWT.js'

const router = express.Router();

router.get('/profile', authenticateJWT, getUserProfile);

export default router;