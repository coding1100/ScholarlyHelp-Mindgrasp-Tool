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

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const listAll = searchParams.get('list') === 'all';

    const client = new MongoClient(databaseUrl, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    
    await client.connect();
    const db = client.db('scholarly_help');
    
    // If list=all, return all online-class pages
    if (listAll) {
      const pages = await db.collection('online_classes').find({}).toArray();
      console.log(`Found ${pages.length} pages in online_classes collection`);
      await client.close();
      return NextResponse.json({ pages }, { headers: corsHeaders });
    }
    
    // Query by slug for subject pages, or by id (if slug matches id), or by id: "online_class_page" for main page
    let query;
    if (slug) {
      // Check if slug is for main page
      if (slug === 'online_class_page' || slug === 'online_classes_page' || slug === 'main') {
        // Query for main online-class page - try multiple variations including with/without 's'
        query = { 
          $or: [
            { id: "online_class_page" }, 
            { id: "online_classes_page" },
            { id: "main" },
            { slug: "online_class_page" },
            { slug: "online_classes_page" },
            { slug: "main" }
          ] 
        };
        console.log('Querying online_classes for main page (via slug), query:', JSON.stringify(query));
      } else {
        // Handle different slug formats for subject pages
        let slugVariations = [slug];
        
        // If slug is like "online_class_english", also try "english"
        if (slug.startsWith('online_class_')) {
          slugVariations.push(slug.replace('online_class_', ''));
        } else if (slug.startsWith('online_classes_')) {
          // Handle online_classes_ prefix
          slugVariations.push(slug.replace('online_classes_', ''));
          slugVariations.push(slug.replace('online_classes_', 'online_class_'));
        } else {
          // If slug is like "english", also try "online_class_english"
          slugVariations.push(`online_class_${slug}`);
          slugVariations.push(`online_classes_${slug}`);
        }
        
        // Build query to match any variation
        const orConditions = [];
        for (const variation of slugVariations) {
          orConditions.push({ slug: variation });
          orConditions.push({ id: variation });
        }
        query = { $or: orConditions };
        console.log(`Querying online_classes with slug: ${slug}, query:`, JSON.stringify(query));
      }
    } else {
      // Query for main online-class page - try multiple variations including with/without 's'
      query = { 
        $or: [
          { id: "online_class_page" }, 
          { id: "online_classes_page" },
          { id: "main" },
          { slug: "online_class_page" },
          { slug: "online_classes_page" },
          { slug: "main" }
        ] 
      };
      console.log('Querying online_classes for main page, query:', JSON.stringify(query));
    }
    
    const content = await db.collection('online_classes').findOne(query);
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
    console.log('POST /api/admin/online-class - Starting save operation');

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
    const finalId = id || slug || "online_class_page";
    
    if (id === "online_class_page" || id === "online_classes_page") {
      // Main online-class page - normalize to online_class_page
      query = { 
        $or: [
          { id: "online_class_page" }, 
          { id: "online_classes_page" },
          { id: "main" }
        ] 
      };
      dataToSave = { ...updateData, id: "online_class_page", pageType: "online_class_page" };
    } else if (id && id.startsWith("online_class_")) {
      // Subject pages like online_class_english, online_class_math, etc.
      const subjectSlug = id.replace("online_class_", "");
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
      // Default to online_class_page
      query = { 
        $or: [
          { id: "online_class_page" }, 
          { id: "online_classes_page" },
          { id: "main" }
        ] 
      };
      dataToSave = { ...updateData, id: "online_class_page", pageType: "online_class_page" };
    }
    
    const result = await db.collection('online_classes').replaceOne(query, dataToSave, { upsert: true });
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
    const result = await db.collection('online_classes').deleteOne({ $or: [{ slug }, { id: slug }] });
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
