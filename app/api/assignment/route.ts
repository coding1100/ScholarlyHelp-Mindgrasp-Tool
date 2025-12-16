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
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    const client = new MongoClient(databaseUrl);
    await client.connect();
    const db = client.db('scholarly_help');
    
    // Query by slug for subject pages, or by id (if slug matches id), or by id: "assignment_page" for main page
    let query;
    if (slug) {
      // Handle different slug formats
      let slugVariations = [slug];
      
      // If slug is like "assignment_english", also try "english"
      if (slug.startsWith('assignment_')) {
        slugVariations.push(slug.replace('assignment_', ''));
      } else {
        // If slug is like "english", also try "assignment_english"
        slugVariations.push(`assignment_${slug}`);
      }
      
      // Build query to match any variation
      const orConditions = [];
      for (const variation of slugVariations) {
        orConditions.push({ slug: variation });
        orConditions.push({ id: variation });
      }
      query = { $or: orConditions, status: { $ne: 'draft' } }; // Only published pages
    } else {
      // Query for main assignment page
      query = { 
        $or: [{ id: "assignment_page" }, { id: "main" }],
        status: { $ne: 'draft' }
      };
    }
    
    const content = await db.collection('assignments').findOne(query);
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
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500, headers: corsHeaders });
  }
}

