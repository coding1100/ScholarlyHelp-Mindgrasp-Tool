import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps { 
  params: { category: string; slug: string; }; 
}

async function fetchPageData(category: string, slug: string) {
  try {
    const directusUrl = process.env.DIRECTUS_URL;
    if (!directusUrl) {
      return null;
    }
    
    const response = await fetch(
      `${directusUrl}/items/pages?filter[category][_eq]=${category}&filter[slug][_eq]=${slug}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.data?.[0] || null;
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
  
  return {
    title: pageData.meta_title || pageData.title || 'Page',
    description: pageData.meta_description || '',
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const pageData = await fetchPageData(params.category, params.slug);

  if (!pageData || pageData.status !== 'published') {
    notFound();
  }

  return (
    <div>
      <h1>{pageData.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}