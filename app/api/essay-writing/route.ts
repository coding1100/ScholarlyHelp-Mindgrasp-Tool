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

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    const client = new MongoClient(databaseUrl, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    
    await client.connect();
    const db = client.db('scholarly_help');
    
    // Query by slug for subject pages, or by id (if slug matches id), or by id: "essay_writing_page" for main page
    let query;
    if (slug) {
      // Handle different slug formats
      let slugVariations = [slug];
      
      // If slug is like "essay_writing_english", also try "english"
      if (slug.startsWith('essay_writing_')) {
        slugVariations.push(slug.replace('essay_writing_', ''));
      } else if (slug.startsWith('essay_writings_')) {
        slugVariations.push(slug.replace('essay_writings_', ''));
        slugVariations.push(slug.replace('essay_writings_', 'essay_writing_'));
      } else {
        // If slug is like "english", also try "essay_writing_english"
        slugVariations.push(`essay_writing_${slug}`);
        slugVariations.push(`essay_writings_${slug}`);
      }
      
      // Build query to match any variation
      const orConditions = [];
      for (const variation of slugVariations) {
        orConditions.push({ slug: variation });
        orConditions.push({ id: variation });
      }
      query = { $or: orConditions, status: { $ne: 'draft' } }; // Only published pages
      console.log(`Querying essay_writing with slug: ${slug}, query:`, JSON.stringify(query));
    } else {
      // Query for main essay-writing page - try multiple variations including with/without 's'
      query = { 
        $or: [
          { id: "essay_writing_page" }, 
          { id: "essay_writings_page" },
          { id: "main" },
          { id: "essay-writing" },
          { slug: "essay_writing_page" },
          { slug: "essay_writings_page" },
          { slug: "main" }
        ],
        status: { $ne: 'draft' }
      };
      console.log('Querying essay_writing for main page, query:', JSON.stringify(query));
    }
    
    const content = await db.collection('essay_writing').findOne(query);
    console.log('Found content:', content ? 'Yes' : 'No');
    
    // If no content found, try without status filter
    if (!content) {
      const queryWithoutStatus = query.$or ? { $or: query.$or } : query;
      delete queryWithoutStatus.status;
      const contentWithoutStatus = await db.collection('essay_writing').findOne(queryWithoutStatus);
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

