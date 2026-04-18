import { Helmet } from 'react-helmet-async';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  breadcrumbs?: BreadcrumbItem[];
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_NAME = 'RefractLabs';
const DEFAULT_TAGLINE = 'Web Development, UI/UX Design & Social Media Management Agency';
const DEFAULT_DESC = 'RefractLabs is a premium digital agency building high-performance websites, UI/UX experiences and social media strategies that turn ideas into measurable growth.';
const DEFAULT_IMAGE = 'https://refractlabs.com/og-image.png';
const DEFAULT_IMAGE_ALT = 'RefractLabs — Digital Agency for Web, Design & Social Media';
const BASE_URL = 'https://refractlabs.com';
const TWITTER_HANDLE = '@refractlabs';
const DEFAULT_KEYWORDS =
  'web development agency, UI UX design, social media management, React development, Next.js, digital marketing, software development, brand strategy, creative agency, RefractLabs';

const SEO = ({
  title,
  description = DEFAULT_DESC,
  keywords = DEFAULT_KEYWORDS,
  url,
  image = DEFAULT_IMAGE,
  imageAlt = DEFAULT_IMAGE_ALT,
  type = 'website',
  noindex = false,
  publishedTime,
  modifiedTime,
  author = SITE_NAME,
  breadcrumbs,
  schema,
}: SEOProps) => {
  const fullTitle = title
    ? `${title} | ${SITE_NAME} — ${DEFAULT_TAGLINE}`
    : `${SITE_NAME} — ${DEFAULT_TAGLINE}`;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;

  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: b.url.startsWith('http') ? b.url : `${BASE_URL}${b.url}`,
        })),
      }
    : null;

  const extraSchemas: Record<string, unknown>[] = [];
  if (schema) {
    if (Array.isArray(schema)) extraSchemas.push(...schema);
    else extraSchemas.push(schema);
  }

  return (
    <Helmet prioritizeSeoTags>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      {/* Robots */}
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
      />
      <meta
        name="googlebot"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
      />
      <meta name="bingbot" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {/* Additional discovery hints */}
      <meta name="theme-color" content="#c75b2a" />
      <meta name="format-detection" content="telephone=no" />
      <link rel="alternate" hrefLang="en" href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />

      {/* Breadcrumbs Structured Data */}
      {breadcrumbSchema && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}

      {/* Page-level Structured Data */}
      {extraSchemas.map((s, i) => (
        <script key={`schema-${i}`} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
