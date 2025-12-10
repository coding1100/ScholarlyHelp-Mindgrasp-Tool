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
    const { username, password } = await request.json();

    // Check environment variables first (fallback for admin user)
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (username === adminUsername && password === adminPassword) {
      const token = jwt.sign({ username: adminUsername }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '1h' });
      return NextResponse.json({ success: true, token }, { headers: corsHeaders });
    }

    // Check MongoDB users collection
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      try {
        const client = new MongoClient(databaseUrl);
        await client.connect();
        const db = client.db('scholarly_help');
        const user = await db.collection('users').findOne({ username, password });
        await client.close();

        if (user) {
          const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '1h' });
          return NextResponse.json({ success: true, token }, { headers: corsHeaders });
        }
      } catch (dbError) {
        console.error('Database error during login:', dbError);
        // Continue to return invalid credentials if DB check fails
      }
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401, headers: corsHeaders });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500, headers: corsHeaders });
  }
}