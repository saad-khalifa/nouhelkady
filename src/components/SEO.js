import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'منصة نوح القاضي - تعلم المونتاج والذكاء الاصطناعي',
  description = 'منصة نوح القاضي التعليمية - دورات احترافية في مونتاج الفيديو، الذكاء الاصطناعي، تصميم الجرافيك والإنتاج الإبداعي',
  keywords = 'مونتاج فيديو, ذكاء اصطناعي, دورات مونتاج, نوح القاضي',
  image = 'https://nouhelkady.nouhelkady.com/og-image.jpg',
  url = 'https://nouhelkady.nouhelkady.com',
  type = 'website',
  author = 'نوح القاضي',
  publishedTime,
  modifiedTime,
  schema
}) => {
  const siteTitle = 'منصة نوح القاضي';
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="ar_EG" />
      
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@nouhelkady" />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;