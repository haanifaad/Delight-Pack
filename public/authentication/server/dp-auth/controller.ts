import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getDbPool } from './db';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './jwt';

export async function registerUser(req: Request, res: Response) {
  try {
    const { email, password, roleLevel, profileData } = req.body;

    if (!email || !password || !roleLevel) {
      return res.status(400).json({ error: 'Email, password, and roleLevel are required' });
    }

    if (roleLevel < 1 || roleLevel > 6) {
      return res.status(400).json({ error: 'Role level must be between 1 and 6' });
    }

    const db = getDbPool();
    
    // Hash password with bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await db.query(
      `INSERT INTO users (email, password_hash, role_level, profile_data) 
       VALUES ($1, $2, $3, $4) RETURNING id, email, role_level, profile_data`,
      [email, passwordHash, roleLevel, profileData || {}]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') { // Postgres unique violation error code
        return res.status(409).json({ error: 'Email already exists' });
    }
    // Handle database connection loosely for preview
    if (error.message.includes('DATABASE_URL')) {
        return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error during registration' });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDbPool();
    const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const payload = { userId: user.id, email: user.email, roleLevel: user.role_level };
    
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Calculate expiration timestamp to store in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    // Store refresh token
    await db.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
      [user.id, refreshToken, expiresAt]
    );

    res.json({
        message: 'Login successful',
        tokens: {
            accessToken,
            refreshToken
        },
        user: {
            id: user.id,
            email: user.email,
            roleLevel: user.role_level,
            profileData: user.profile_data
        }
    });

  } catch (error: any) {
    if (error.message.includes('DATABASE_URL')) {
        return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error during login' });
  }
}

export async function refreshTokenHandler(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const db = getDbPool();

    // Verify token payload
    const decoded = verifyRefreshToken(refreshToken);

    // Check if token exists in DB and is not expired
    const result = await db.query(`SELECT * FROM refresh_tokens WHERE token = $1`, [refreshToken]);
    if (result.rows.length === 0) {
       return res.status(401).json({ error: 'Invalid session or refresh token' });
    }

    const storedToken = result.rows[0];
    if (new Date() > new Date(storedToken.expires_at)) {
        // DB cleanup of expired token
        await db.query(`DELETE FROM refresh_tokens WHERE id = $1`, [storedToken.id]);
        return res.status(401).json({ error: 'Refresh token expired. Please login again.' });
    }

    // Payload for new tokens
    const payload = { userId: decoded.userId, email: decoded.email, roleLevel: decoded.roleLevel };
    
    // Generate new sliding-window tokens
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    // Update refresh token sliding window
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Replace old refresh token with new one in DB (sliding window mechanism)
    await db.query(
        `UPDATE refresh_tokens SET token = $1, expires_at = $2 WHERE id = $3`,
        [newRefreshToken, expiresAt, storedToken.id]
    );

    res.json({
        tokens: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }
    });

  } catch (error: any) {
     if (error.name === 'TokenExpiredError') {
         return res.status(401).json({ error: 'Refresh token expired' });
     }
     if (error.message.includes('DATABASE_URL')) {
        return res.status(500).json({ error: error.message });
    }
     return res.status(401).json({ error: 'Invalid refresh token' });
  }
}

export async function logoutUser(req: Request, res: Response) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        const db = getDbPool();
        await db.query(`DELETE FROM refresh_tokens WHERE token = $1`, [refreshToken]);

        res.json({ message: 'Successfully logged out' });
    } catch (error: any) {
        if (error.message.includes('DATABASE_URL')) {
            return res.status(500).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error during logout' });
    }
}
