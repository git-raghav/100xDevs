import express from 'express';
const router = express.Router();
import wrapAsync from '../utils/wrapAsync.js';
import { validateName, validateUsername } from '../middlewares/validationMiddleware.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { changeName, changeUsername, getUsersBulk } from '../controllers/userController.js';

router.put('/update-name', validateName, authenticateToken, wrapAsync(changeName));
router.put('/update-username', validateUsername, authenticateToken, wrapAsync(changeUsername));

router.get('/bulk', authenticateToken, wrapAsync(getUsersBulk));

export default router;
