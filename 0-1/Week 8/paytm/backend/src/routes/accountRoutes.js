import express from 'express';
const router = express.Router();
import wrapAsync from '../utils/wrapAsync.js';
import { validateTransfer } from '../middlewares/validationMiddleware.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { createAccount, getBalance, transferFunds } from '../controllers/accountController.js';

router.post('/create-acc', authenticateToken, wrapAsync(createAccount));
router.get('/balance', authenticateToken, wrapAsync(getBalance));
router.post('/transfer', validateTransfer, authenticateToken, wrapAsync(transferFunds));

export default router;
