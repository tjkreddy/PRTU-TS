import { body } from 'express-validator';

// Registration validation
export const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
  body('employeeId')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Employee ID must be between 3 and 20 characters'),
    
  body('phoneNumber')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number'),
    
  body('school')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('School name cannot exceed 200 characters'),
    
  body('district')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('District name cannot exceed 100 characters'),
    
  body('designation')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Designation cannot exceed 100 characters'),
    
  body('dateOfJoining')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),
    
  body('address.pincode')
    .optional()
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid pincode'),
    
  body('emergencyContact.phoneNumber')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid emergency contact phone number')
];

// Login validation
export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Profile update validation
export const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
    
  body('phoneNumber')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number'),
    
  body('school')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('School name cannot exceed 200 characters'),
    
  body('district')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('District name cannot exceed 100 characters'),
    
  body('designation')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Designation cannot exceed 100 characters'),
    
  body('address.pincode')
    .optional()
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid pincode'),
    
  body('emergencyContact.phoneNumber')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid emergency contact phone number')
];

// Change password validation
export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
    
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
];
