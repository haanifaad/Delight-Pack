import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_change_in_prod';
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

function generateAccessToken(userId: string, roleLevel: number) {
  return jwt.sign({ id: userId, role_level: roleLevel }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

function generateRefreshTokenString() {
  return crypto.randomBytes(40).toString('hex');
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user.id, user.role_level);
    const refreshTokenString = generateRefreshTokenString();
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await prisma.refreshToken.create({
      data: {
        token: refreshTokenString,
        user_id: user.id,
        expires_at: expiresAt
      }
    });

    res.cookie('refreshToken', refreshTokenString, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    });

    res.cookie('dp_role', user.role_level.toString(), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    });

    return res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role_level: user.role_level,
        profile_data: user.profile_data
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  try {
    const existingToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!existingToken) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    if (existingToken.expires_at < new Date()) {
      await prisma.refreshToken.delete({ where: { id: existingToken.id } });
      return res.status(403).json({ error: 'Refresh token expired' });
    }

    const newAccessToken = generateAccessToken(existingToken.user.id, existingToken.user.role_level);
    
    // Sliding window logic: If token is less than 2 days away from expiry, slide it
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    if (existingToken.expires_at < twoDaysFromNow) {
      const newExpiry = new Date();
      newExpiry.setDate(newExpiry.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
      const newRefreshTokenString = generateRefreshTokenString();

      // Delete old and create new to slide
      await prisma.refreshToken.delete({ where: { id: existingToken.id } });
      await prisma.refreshToken.create({
        data: {
          token: newRefreshTokenString,
          user_id: existingToken.user.id,
          expires_at: newExpiry
        }
      });

      res.cookie('refreshToken', newRefreshTokenString, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
      });
    }

    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    try {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    } catch (e) {
      console.error(e);
    }
  }
  res.clearCookie('refreshToken');
  res.clearCookie('dp_role');
  return res.json({ message: 'Logged out successfully' });
};
