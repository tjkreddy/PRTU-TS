import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User, { UserDocument } from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Generate JWT Token
const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign({ id: userId }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register a new member
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const {
      name,
      email,
      password,
      employeeId,
      school,
      district,
      designation,
      phoneNumber,
      dateOfJoining,
      address,
      emergencyContact
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email },
        ...(employeeId ? [{ employeeId }] : [])
      ]
    });

    if (existingUser) {
      res.status(400).json({
        status: 'error',
        message: 'User already exists with this email or employee ID'
      });
      return;
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      employeeId,
      school,
      district,
      designation,
      phoneNumber,
      dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : undefined,
      address,
      emergencyContact
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          membershipNumber: user.membershipNumber,
          isVerified: user.isVerified
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        status: 'error',
        message: 'Account has been deactivated. Please contact administration.'
      });
      return;
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
      return;
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          membershipNumber: user.membershipNumber,
          isVerified: user.isVerified,
          school: user.school,
          district: user.district
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during login'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    
    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
      return;
    }

    res.json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const {
      name,
      phoneNumber,
      school,
      district,
      designation,
      address,
      emergencyContact
    } = req.body;

    const user = await User.findById(req.user?.id);
    
    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
      return;
    }

    // Update fields
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (school) user.school = school;
    if (district) user.district = district;
    if (designation) user.designation = designation;
    if (address) user.address = address;
    if (emergencyContact) user.emergencyContact = emergencyContact;

    await user.save();

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?.id).select('+password');
    
    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
      return;
    }

    // Verify current password
    const isCurrentPasswordMatch = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordMatch) {
      res.status(400).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.json({
    status: 'success',
    message: 'Logged out successfully'
  });
};
