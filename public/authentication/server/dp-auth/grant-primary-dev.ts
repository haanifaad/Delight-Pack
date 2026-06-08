import bcrypt from 'bcrypt';
import { getDbPool } from './db';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env file from current working directory
dotenv.config({ path: '.env' });

const HAANI_EMAIL = 'haani@delightpack.com';
const HAANI_PASSWORD = 'super_secure_primary_dev_password_123!';
const PRIMARY_DEV_LEVEL = 6;

async function grantPrimaryDevAccess() {
  console.log(`\n===========================================`);
  console.log(`🚀 INITIALIZING PRIMARY DEVELOPER OVERRIDE`);
  console.log(`===========================================\n`);
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL is not set in your .env file.');
    console.error('Please configure your database before running this script.');
    process.exit(1);
  }

  try {
    const db = getDbPool();
    console.log('✅ Database connected.');

    // 1. Hash the super password
    const saltRounds = 10;
    console.log('🔒 Hashing credentials...');
    const passwordHash = await bcrypt.hash(HAANI_PASSWORD, saltRounds);

    // 1.5 Ensure tables exist (since this is a fresh database)
    console.log('🛠️ Checking database schema...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role_level INTEGER NOT NULL,
        profile_data JSONB DEFAULT '{}'
      );
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL
      );
    `);

    // 2. Upsert the user into the database
    console.log(`⚡ Injecting L6 Primary Developer account for: ${HAANI_EMAIL}`);
    const query = `
      INSERT INTO users (email, password_hash, role_level, profile_data)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE 
      SET role_level = EXCLUDED.role_level, password_hash = EXCLUDED.password_hash
      RETURNING id, email, role_level;
    `;
    
    const profileData = JSON.stringify({ 
        title: 'Primary Systems Architect', 
        clearance: 'L6 - Absolute' 
    });

    const result = await db.query(query, [HAANI_EMAIL, passwordHash, PRIMARY_DEV_LEVEL, profileData]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log(`\n🎉 SUCCESS! Account provisioned.`);
      console.log(`-----------------------------------------`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔑 Password: ${HAANI_PASSWORD}`);
      console.log(`🛡️  Role Level: ${user.role_level} (Primary Developer)`);
      console.log(`-----------------------------------------\n`);
      console.log('You can now log into the DP-Auth system with these credentials to access the L6 Core Architecture features.');
    }

  } catch (error: any) {
    console.error('\n❌ FAILED TO PROVISION PRIMARY DEV ACCOUNT:');
    console.error(error.message);
  } finally {
    console.log('Script complete. Exiting...');
    process.exit(0);
  }
}

grantPrimaryDevAccess();
