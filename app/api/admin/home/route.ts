import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from 'mongodb';

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

export async function GET(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('DATABASE_URL not configured');
      return NextResponse.json({ error: 'Database not configured' }, { status: 500, headers: corsHeaders });
    }

    const client = new MongoClient(databaseUrl, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    
    await client.connect();
    const db = client.db('scholarly_help');
    
    // Query for main home page - try multiple variations
    const query = { 
      $or: [
        { id: "home_page" }, 
        { id: "home" },
        { id: "main" },
        { slug: "home_page" },
        { slug: "home" },
        { slug: "main" }
      ] 
    };
    
    console.log('Querying home collection for main page, query:', JSON.stringify(query));
    const content = await db.collection('home').findOne(query);
    console.log(`Found content:`, content ? 'Yes' : 'No');
    await client.close();

    return NextResponse.json(content || {}, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching from MongoDB:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/admin/home - Starting save operation');

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('Database URL not configured');
      return NextResponse.json({ error: 'Database not configured' }, { status: 500, headers: corsHeaders });
    }

    const body = await request.json();
    console.log('Received data, size:', JSON.stringify(body).length, 'characters');

    // Exclude _id from the update to prevent immutable field error
    const { _id, slug, id, ...updateData } = body;

    const client = new MongoClient(databaseUrl, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB successfully');

    const db = client.db('scholarly_help');
    console.log('Using database: scholarly_help');

    // For home page, always use home_page as id
    const query = { 
      $or: [
        { id: "home_page" }, 
        { id: "home" },
        { id: "main" }
      ] 
    };
    
    const dataToSave = { 
      ...updateData, 
      id: "home_page", 
      pageType: "home_page" 
    };
    
    const result = await db.collection('home').replaceOne(query, dataToSave, { upsert: true });
    console.log('Save result:', result);

    await client.close();
    console.log('Connection closed, save operation completed');

    return NextResponse.json({
      success: true,
      message: 'Data saved successfully',
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error saving to MongoDB:', error);
    return NextResponse.json({
      error: 'Failed to save data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500, headers: corsHeaders });
  }
}

