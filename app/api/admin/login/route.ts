import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    // Debug logging
    console.log('Login attempt for username:', username);
    console.log('Checking env vars - ADMIN_USERNAME exists:', !!process.env.ADMIN_USERNAME);
    console.log('Checking env vars - DATABASE_URL exists:', !!process.env.DATABASE_URL);

    // Check environment variables first (fallback for admin user)
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    console.log('Expected admin username:', adminUsername);
    console.log('Credentials match:', username === adminUsername && password === adminPassword);
    
    if (username === adminUsername && password === adminPassword) {
      const jwtSecret = process.env.JWT_SECRET || 'default-secret';
      console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
      const token = jwt.sign({ username: adminUsername }, jwtSecret, { expiresIn: '1h' });
      console.log('Login successful for:', adminUsername);
      return NextResponse.json({ success: true, token }, { headers: corsHeaders });
    }

    // Check MongoDB users collection
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      try {
        console.log('Checking MongoDB for user...');
        const client = new MongoClient(databaseUrl);
        await client.connect();
        const db = client.db('scholarly_help');
        const user = await db.collection('users').findOne({ username, password });
        await client.close();

        if (user) {
          const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '1h' });
          console.log('MongoDB login successful for:', user.username);
          return NextResponse.json({ success: true, token }, { headers: corsHeaders });
        }
        console.log('User not found in MongoDB');
      } catch (dbError) {
        console.error('Database error during login:', dbError);
        // Continue to return invalid credentials if DB check fails
      }
    } else {
      console.log('DATABASE_URL not configured, skipping MongoDB check');
    }

    console.log('Login failed - invalid credentials');
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401, headers: corsHeaders });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Login failed', details: String(error) }, { status: 500, headers: corsHeaders });
  }
}