import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth';

// Demo accounts - NO DATABASE NEEDED
const DEMO_USERS = [
  {
    id: 1,
    email: 'tenant@demo.com',
    password: '$2a$10$8ZqQ5Z5Z5Z5Z5Z5Z5Z5Z5u7', // 'demo123'
    name: 'Sarah Tenant',
    phone: '123-456-7890',
    role: 'tenant',
    avatar: null
  },
  {
    id: 2,
    email: 'owner@demo.com',
    password: '$2a$10$8ZqQ5Z5Z5Z5Z5Z5Z5Z5Z5u7', // 'demo123'
    name: 'John Owner',
    phone: '234-567-8901',
    role: 'owner',
    avatar: null
  },
  {
    id: 3,
    email: 'admin@demo.com',
    password: '$2a$10$8ZqQ5Z5Z5Z5Z5Z5Z5Z5Z5u7', // 'demo123'
    name: 'Admin Manager',
    phone: '098-765-4321',
    role: 'admin',
    avatar: null
  }
];

export const demoLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user in demo accounts
    const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Demo accounts: tenant@demo.com, owner@demo.com, admin@demo.com (password: demo123)'
      });
      return;
    }

    // For demo, accept 'demo123' as password
    if (password !== 'demo123') {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password is: demo123'
      });
      return;
    }

    const token = generateToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });

    res.json({
      success: true,
      message: 'Login successful (Demo Mode)',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

export const demoRegister = async (req: Request, res: Response): Promise<void> => {
  res.status(400).json({
    success: false,
    message: 'Registration disabled in demo mode. Demo accounts: tenant@demo.com, owner@demo.com, admin@demo.com (password: demo123)'
  });
};

export const demoProfile = async (req: Request, res: Response): Promise<void> => {
  const authReq = req as any;
  const userId = authReq.user?.id;

  const user = DEMO_USERS.find(u => u.id === userId);

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found'
    });
    return;
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role
    }
  });
};

