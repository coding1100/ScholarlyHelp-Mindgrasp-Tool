type PageData = {
  title?: unknown;
  meta?: {
    title?: unknown;
    description?: unknown;
    canonicalUrl?: unknown;
  };
  meta_title?: unknown;
  meta_description?: unknown;
  heroSection?: {
    mainHeading?: unknown;
  };
  faq?: {
    faqs?: unknown;
  };
  faqs?: unknown;
};

interface ServiceJsonLdOptions {
  pageData: PageData | null;
  canonicalUrl: string;
  title: string;
  description: string;
}

interface FaqItem {
  question?: unknown;
  answer?: unknown;
}

export function normalizeSiteUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function stripHtml(value: unknown) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function text(value: unknown, fallback = "") {
  const cleaned = stripHtml(value);
  return cleaned || fallback;
}

function getFaqItems(pageData: PageData | null) {
  const rawFaqs = pageData?.faq?.faqs || pageData?.faqs;

  if (!Array.isArray(rawFaqs)) {
    return [];
  }

  return rawFaqs
    .map((faq: FaqItem) => ({
      question: text(faq.question),
      answer: text(faq.answer),
    }))
    .filter((faq) => faq.question && faq.answer);
}

export function getServiceMeta({
  pageData,
  canonicalUrl,
  title,
  description,
}: ServiceJsonLdOptions) {
  return {
    canonicalUrl: text(pageData?.meta?.canonicalUrl, canonicalUrl),
    title: text(
      pageData?.meta?.title ||
        pageData?.meta_title ||
        pageData?.title ||
        pageData?.heroSection?.mainHeading,
      title,
    ),
    description: text(
      pageData?.meta?.description || pageData?.meta_description,
      description,
    ),
  };
}

export function buildServiceJsonLd(options: ServiceJsonLdOptions) {
  const meta = getServiceMeta(options);
  const faqs = getFaqItems(options.pageData);

  const graph: unknown[] = [
    {
      "@type": "Organization",
      "@id": "https://scholarlyhelp.com/#organization",
      name: "Scholarly Help",
      url: "https://scholarlyhelp.com/",
      logo: {
        "@type": "ImageObject",
        url: "https://scholarlyhelp.com/assets/images/logo.png",
      },
    },
    {
      "@type": "Product",
      "@id": `${meta.canonicalUrl}#product`,
      name: meta.title,
      description: meta.description,
      brand: {
        "@id": "https://scholarlyhelp.com/#organization",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "127",
        bestRating: "5",
        worstRating: "3",
      },
      review: [
        {
          "@type": "Review",
          author: {
            "@type": "Person",
            name: "Sarah M.",
          },
          datePublished: "2023-11-10",
          reviewBody:
            "The experts here are absolute lifesavers! They helped me manage my academic workload efficiently.",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
            worstRating: "3",
          },
        },
      ],
    },
  ];

  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${meta.canonicalUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replace(/</g, "\\u003c");
}
