import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const client = new MongoClient(databaseUrl, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    await client.connect();
    const db = client.db('scholarly_help');
    
    // Query for a-or-b-grade-guarantee page by id
    const query = { 
      id: "a-or-b-grade-guarantee"
    };
    
    const content = await db.collection('pages').findOne(query);
    
    if (!content) {
      console.log('No content found for a-or-b-grade-guarantee in pages collection');
      // Debug: Check what documents exist in pages collection
      const allPages = await db.collection('pages').find({}).limit(10).toArray();
      console.log('Available page IDs in pages collection:', allPages.map(p => ({ id: p.id, pageType: p.pageType })));
      await client.close();
      return NextResponse.json({ error: 'Page not found' }, { status: 404, headers: corsHeaders });
    }
    
    console.log('Found a-or-b-grade-guarantee content, id:', content.id, 'pageType:', content.pageType);
    await client.close();

    // Add cache control headers to prevent caching
    const noCacheHeaders = {
      ...corsHeaders,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    return NextResponse.json(content, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Error fetching from MongoDB:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500, headers: corsHeaders });
  }
}

