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
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const listAll = searchParams.get('list') === 'all';

    const client = new MongoClient(databaseUrl);
    await client.connect();
    const db = client.db('scholarly_help');
    
    // If list=all, return all homework pages
    if (listAll) {
      const pages = await db.collection('homework').find({}).toArray();
      await client.close();
      return NextResponse.json({ pages }, { headers: corsHeaders });
    }
    
    // Query by slug for subject pages, or by id (if slug matches id), or by id: "homework_page" for main page
    let query;
    if (slug) {
      // Handle different slug formats
      let slugVariations = [slug];
      
      // If slug is like "homework_english", also try "english"
      if (slug.startsWith('homework_')) {
        slugVariations.push(slug.replace('homework_', ''));
      } else {
        // If slug is like "english", also try "homework_english"
        slugVariations.push(`homework_${slug}`);
      }
      
      // Build query to match any variation
      const orConditions = [];
      for (const variation of slugVariations) {
        orConditions.push({ slug: variation });
        orConditions.push({ id: variation });
      }
      query = { $or: orConditions };
    } else {
      // Query for main homework page - try both "main" and "homework_page" for backward compatibility
      query = { $or: [{ id: "homework_page" }, { id: "main" }] };
    }
    const content = await db.collection('homework').findOne(query);
    await client.close();

    return NextResponse.json(content || {}, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching from MongoDB:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/admin/homework - Starting save operation');

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
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      connectTimeoutMS: 10000, // 10 second timeout
    });

    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB successfully');

    const db = client.db('scholarly_help');
    console.log('Using database: scholarly_help');

    // Determine query and data to save
    let query;
    let dataToSave;
    
    // Use the id from the body to determine the page type
    // pageType should match the id value
    const finalId = id || slug || "homework_page";
    
    if (id === "homework_page") {
      // Main homework page
      query = { $or: [{ id: "homework_page" }, { id: "main" }] };
      dataToSave = { ...updateData, id: "homework_page", pageType: "homework_page" };
    } else if (id && id.startsWith("homework_")) {
      // Subject pages like homework_english, homework_math, etc.
      const subjectSlug = id.replace("homework_", "");
      query = { $or: [{ id }, { slug: subjectSlug }, { id: subjectSlug }] };
      dataToSave = { ...updateData, id, slug: slug || subjectSlug, pageType: id };
    } else if (slug) {
      // For subject pages: query by slug or id, and ensure both slug and id are set
      const finalIdValue = id || slug;
      query = { $or: [{ slug }, { id: slug }] };
      dataToSave = { ...updateData, slug, id: finalIdValue, pageType: finalIdValue };
    } else if (id && id !== "main") {
      // If id is provided and it's not "main", treat it as a subject page
      query = { $or: [{ slug: id }, { id }] };
      dataToSave = { ...updateData, slug: id, id, pageType: id };
    } else {
      // Default to homework_page
      query = { $or: [{ id: "homework_page" }, { id: "main" }] };
      dataToSave = { ...updateData, id: "homework_page", pageType: "homework_page" };
    }
    
    const result = await db.collection('homework').replaceOne(query, dataToSave, { upsert: true });
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

export async function DELETE(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500, headers: corsHeaders });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required for deletion' }, { status: 400, headers: corsHeaders });
    }

    const client = new MongoClient(databaseUrl);
    await client.connect();
    const db = client.db('scholarly_help');
    
    // Try to delete by slug or id
    const result = await db.collection('homework').deleteOne({ $or: [{ slug }, { id: slug }] });
    await client.close();

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully',
      deletedCount: result.deletedCount
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error deleting from MongoDB:', error);
    return NextResponse.json({
      error: 'Failed to delete data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500, headers: corsHeaders });
  }
}

