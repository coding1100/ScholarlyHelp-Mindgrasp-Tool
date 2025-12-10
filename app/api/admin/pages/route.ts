import { NextRequest, NextResponse } from "next/server";

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
    const directusUrl = process.env.DIRECTUS_URL;
    if (!directusUrl) {
      return NextResponse.json({ error: 'Directus not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    let url = `${directusUrl}/items/pages`;
    const filters: string[] = [];
    if (category) filters.push(`filter[category][_eq]=${category}`);
    if (slug) filters.push(`filter[slug][_eq]=${slug}`);
    if (filters.length > 0) url += '?' + filters.join('&');

    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json(data.data, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: NextRequest) {
  try {
    const directusUrl = process.env.DIRECTUS_URL;
    if (!directusUrl) {
      return NextResponse.json({ error: 'Directus not configured' }, { status: 500 });
    }

    const body = await request.json();
    const method = body.id ? 'PATCH' : 'POST';
    const url = body.id ? `${directusUrl}/items/pages/${body.id}` : `${directusUrl}/items/pages`;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error) {
    console.error('Error saving page:', error);
    return NextResponse.json({ error: 'Failed to save page' }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const directusUrl = process.env.DIRECTUS_URL;
    if (!directusUrl) {
      return NextResponse.json({ error: 'Directus not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const response = await fetch(`${directusUrl}/items/pages/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500, headers: corsHeaders });
  }
}