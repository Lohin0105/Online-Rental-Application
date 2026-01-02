import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { generateToken } from '../middleware/auth';
import { AuthRequest, User } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone, role } = req.body;

    // Check if user exists
    const [existingUsers] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (email, password, name, phone, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, phone || null, role || 'tenant']
    );

    const token = generateToken({ id: result.insertId, email, role: role || 'tenant' });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: result.insertId,
          email,
          name,
          role: role || 'tenant'
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Demo credentials bypass
    if (email === 'owner@demo.com' && password === 'demo123') {
      const token = generateToken({ id: 999, email: 'owner@demo.com', role: 'owner' });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: 999,
            email: 'owner@demo.com',
            name: 'Demo Owner',
            role: 'owner',
            phone: null,
            avatar: null
          },
          token
        }
      });
      return;
    }

    // Find user
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    const user = users[0] as User;

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    // Demo user bypass
    if (userId === 999) {
      res.json({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          id: 999,
          email: 'owner@demo.com',
          name: 'Demo Owner',
          phone: null,
          role: 'owner',
          avatar: null,
          created_at: new Date().toISOString()
        }
      });
      return;
    }

    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, email, name, phone, role, avatar, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: users[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching profile'
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { name, phone, avatar } = req.body;

    await pool.query(
      'UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), avatar = COALESCE(?, avatar) WHERE id = ?',
      [name, phone, avatar, userId]
    );

    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, email, name, phone, role, avatar, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: users[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating profile'
    });
  }
};

