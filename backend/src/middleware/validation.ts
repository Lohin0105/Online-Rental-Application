import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }
  next();
};

export const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('role').isIn(['owner', 'tenant']).withMessage('Role must be either owner or tenant'),
  handleValidationErrors
];

export const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

export const propertyValidation = [
  body('title').notEmpty().trim().withMessage('Property title is required'),
  body('location').notEmpty().trim().withMessage('Location is required'),
  body('rent').isFloat({ min: 0.01 }).withMessage('Rent must be greater than zero'),
  body('description').optional().trim(),
  body('amenities').optional().isArray().withMessage('Amenities must be an array'),
  body('photos').optional().isArray().withMessage('Photos must be an array'),
  body('bedrooms').optional().isInt({ min: 1 }).withMessage('Bedrooms must be at least 1'),
  body('bathrooms').optional().isInt({ min: 1 }).withMessage('Bathrooms must be at least 1'),
  body('area_sqft').optional().isInt({ min: 1 }).withMessage('Area must be positive'),
  body('property_type').optional().isIn(['apartment', 'house', 'studio', 'villa', 'condo']),
  handleValidationErrors
];

export const bookingValidation = [
  body('property_id').isInt({ min: 1 }).withMessage('Valid property ID is required'),
  body('message').optional().trim(),
  body('move_in_date').optional().isISO8601().withMessage('Invalid date format'),
  body('duration_months').optional().isInt({ min: 1, max: 60 }).withMessage('Duration must be between 1 and 60 months'),
  handleValidationErrors
];

export const bookingStatusValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid booking ID is required'),
  body('status').isIn(['Pending', 'Approved', 'Rejected']).withMessage('Status must be Pending, Approved, or Rejected'),
  body('owner_notes').optional().trim(),
  handleValidationErrors
];

export const propertyFilterValidation = [
  query('location').optional().trim(),
  query('minRent').optional().isFloat({ min: 0 }),
  query('maxRent').optional().isFloat({ min: 0 }),
  query('bedrooms').optional().isInt({ min: 1 }),
  query('property_type').optional().isIn(['apartment', 'house', 'studio', 'villa', 'condo']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  handleValidationErrors
];

