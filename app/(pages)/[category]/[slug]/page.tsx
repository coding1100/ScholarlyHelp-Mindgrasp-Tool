import Head from 'next/head';
import { notFound } from 'next/navigation';

interface PageProps { params: { category: string; slug: string; }; pageData?: any; }

async function fetchPageData(category: string, slug: string) {
  const response = await fetch(`${process.env.DIRECTUS_URL}/items/pages?filter[category][_eq]=${category}&filter[slug][_eq]=${slug}`);
  const data = await response.json();
  return data.data[0];
}

export async function getServerSideProps(context: any) {
  const { category, slug } = context.params;
  const pageData = await fetchPageData(category, slug);

  if (!pageData || pageData.status !== 'published') {
    return { notFound: true };
  }

  return {
    props: { pageData },
  };
}

export default function DynamicPage({ pageData }: PageProps) {
  return (
    <div>
      <Head>
        <title>{pageData.meta_title || pageData.title}</title>
        <meta name="description" content={pageData.meta_description} />
      </Head>
      <h1>{pageData.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}