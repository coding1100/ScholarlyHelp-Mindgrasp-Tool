import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps { 
  params: { category: string; slug: string; }; 
}

async function fetchPageData(category: string, slug: string) {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('Database URL not configured');
      return null;
    }

    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(databaseUrl, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      maxPoolSize: 1,
      readPreference: 'primary',
    });
    await client.connect();
    const db = client.db('scholarly_help');
    
    // Query for page by id (slug) in pages collection
    // The slug should match the id in the pages collection
    const query = { 
      id: slug
    };
    
    const content = await db.collection('pages').findOne(query);
    
    await client.close();

    if (!content) {
      console.log(`No content found for slug: ${slug} in pages collection`);
    } else {
      console.log(`Successfully fetched data for slug: ${slug} from MongoDB`);
    }

    return content as any;
  } catch (error) {
    console.error('Error fetching page data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pageData = await fetchPageData(params.category, params.slug);
  
  if (!pageData) {
    return {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
    };
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com/";
  const canonicalUrl = `${baseUrl}${params.category}/${params.slug}`;
  
  return {
    title: pageData.meta?.title || pageData.meta_title || pageData.title || 'Page',
    description: pageData.meta?.description || pageData.meta_description || '',
    alternates: {
      canonical: pageData.meta?.canonicalUrl || canonicalUrl,
    },
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const pageData = await fetchPageData(params.category, params.slug);

  // Only return 404 if explicitly set to not published, otherwise show the page
  if (!pageData) {
    notFound();
  }

  // If status is explicitly 'draft', return 404
  if (pageData.status === 'draft') {
    notFound();
  }

  return (
    <div>
      <h1>{pageData.title || pageData.heroSection?.mainHeading || 'Page'}</h1>
      {pageData.content && (
        <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
      )}
      {!pageData.content && pageData.heroSection?.description && (
        <div dangerouslySetInnerHTML={{ __html: pageData.heroSection.description }} />
      )}
    </div>
  );
}