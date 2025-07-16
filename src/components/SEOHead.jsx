import React from 'react';
import { Helmet } from 'react-helmet';

const SEOHead = ({ 
  title = "DreamDive - AI-Powered Dream Journal & Interpretation App",
  description = "Transform your dreams into insights with DreamDive. AI-powered dream journaling, interpretation, and analysis. Track your dreams, understand their meaning, and discover patterns in your subconscious mind.",
  keywords = "dream journal, dream interpretation, AI dreams, dream analysis, dream tracking, lucid dreaming, dream meaning, dream app, dream diary, subconscious mind, dream symbols, dream psychology",
  image = "https://thedreamdive.com/logo512.png",
  url = "https://thedreamdive.com",
  type = "website"
}) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="DreamDive" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEOHead; 