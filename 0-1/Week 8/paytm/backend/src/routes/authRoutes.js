import express from 'express';
const router = express.Router();
import passport from 'passport';
import wrapAsync from '../utils/wrapAsync.js';
import { validateUserSignup, validateVerifyEmail, validateUserLogin, validateForgetPassword, validateResetPassword, validateChangePassword, validateDeleteAccount } from '../middlewares/validationMiddleware.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { loginLimiter, otpLimiter } from "../middlewares/rateLimiter.js";
import { signup, verifyEmail, loginSuccess, googleLoginSuccess, forgotPassword, resetPassword, changePassword, refreshToken, logout, deleteAccount, getMe } from '../controllers/authController.js';

router.post('/signup', otpLimiter, validateUserSignup, wrapAsync(signup));
router.post('/verify-email', otpLimiter, validateVerifyEmail, wrapAsync(verifyEmail));

router.post('/login', loginLimiter, validateUserLogin, passport.authenticate('local', { session: false, failWithError: true }), wrapAsync(loginSuccess));
router.post('/logout', wrapAsync(logout));

router.post('/forgot-password', otpLimiter, validateForgetPassword, wrapAsync(forgotPassword));
router.post('/reset-password', otpLimiter, validateResetPassword, wrapAsync(resetPassword));
router.post('/change-password', validateChangePassword, authenticateToken, wrapAsync(changePassword));

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}?google=failed`, }), wrapAsync(googleLoginSuccess));

router.post('/refresh-token', wrapAsync(refreshToken));

router.delete('/delete-account', validateDeleteAccount, authenticateToken, wrapAsync(deleteAccount));

router.get('/me', authenticateToken, wrapAsync(getMe));

export default router;
