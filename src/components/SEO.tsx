import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  type?: string;
}

const SITE_NAME = 'RefractLabs';
const DEFAULT_DESC = 'RefractLabs — Premium Web Development, UI/UX Design & Digital Identity Agency. We bend ideas into reality with cutting-edge technology.';
const DEFAULT_IMAGE = 'https://refractlabs.com/og-image.png';
const BASE_URL = 'https://refractlabs.com';

const SEO = ({
  title,
  description = DEFAULT_DESC,
  keywords = 'web development, UI UX design, digital agency, React, Next.js, branding, software development, RefractLabs',
  url,
  image = DEFAULT_IMAGE,
  type = 'website',
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — We Bend Ideas Into Reality`;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="RefractLabs" />
      <meta name="theme-color" content="#c75b2a" />
    </Helmet>
  );
};

export default SEO;
