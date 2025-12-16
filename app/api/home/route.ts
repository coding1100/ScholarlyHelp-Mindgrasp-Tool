import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from 'mongodb';

export const dynamic = 'force-dynamic';

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
      ],
      status: { $ne: 'draft' }
    };
    
    console.log('Querying home collection for main page, query:', JSON.stringify(query));
    const content = await db.collection('home').findOne(query);
    console.log('Found content:', content ? 'Yes' : 'No');
    
    // If no content found, try without status filter
    if (!content) {
      const queryWithoutStatus = { 
        $or: [
          { id: "home_page" }, 
          { id: "home" },
          { id: "main" }
        ]
      };
      const contentWithoutStatus = await db.collection('home').findOne(queryWithoutStatus);
      if (contentWithoutStatus) {
        console.log('Found content without status filter');
        await client.close();
        const noCacheHeaders = {
          ...corsHeaders,
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        };
        return NextResponse.json(contentWithoutStatus, { headers: noCacheHeaders });
      }
    }
    
    await client.close();

    if (!content) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404, headers: corsHeaders });
    }

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
    return NextResponse.json({ 
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500, headers: corsHeaders });
  }
}

