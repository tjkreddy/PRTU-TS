import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
} from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation
} from '../middleware/validation';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new member
// @access  Public
router.post('/register', registerValidation, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, login);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authMiddleware, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, updateProfileValidation, updateProfile);

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', authMiddleware, changePasswordValidation, changePassword);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authMiddleware, logout);

export default router;
