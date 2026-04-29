import express from 'express';
import { registerUser, loginUser, getUserProfile, verifyOTP, updateUserProfile, forgotPassword, verifyForgotPasswordOTP, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/forgot-password/verify-otp', verifyForgotPasswordOTP);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getUserProfile);
router.put('/me', protect, updateUserProfile);

export default router;
