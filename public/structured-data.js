// Structured Data for DreamDive
export const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "DreamDive",
  "description": "AI-powered dream journal and interpretation app that helps users track, analyze, and understand their dreams using artificial intelligence.",
  "url": "https://thedreamdive.com",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free dream journaling with AI interpretation"
  },
  "author": {
    "@type": "Organization",
    "name": "DreamDive"
  },
  "publisher": {
    "@type": "Organization",
    "name": "DreamDive"
  },
  "featureList": [
    "AI-powered dream interpretation",
    "Dream journaling and tracking",
    "Mood analysis",
    "Dream pattern recognition",
    "Premium features for advanced users"
  ],
  "screenshot": "https://thedreamdive.com/logo512.png",
  "softwareVersion": "1.0.0",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150"
  }
};

// Organization structured data
export const organizationData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "DreamDive",
  "url": "https://thedreamdive.com",
  "logo": "https://thedreamdive.com/logo512.png",
  "description": "AI-powered dream journal and interpretation platform",
  "sameAs": [
    "https://thedreamdive.com"
  ]
};

// Website structured data
export const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "DreamDive",
  "url": "https://thedreamdive.com",
  "description": "Transform your dreams into insights with AI-powered dream journaling and interpretation",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://thedreamdive.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}; 