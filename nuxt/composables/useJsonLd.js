function stripEmpty(value) {
  return value || undefined;
}

export function jsonLdScript(schema, key) {
  return {
    key,
    type: 'application/ld+json',
    children: JSON.stringify(schema)
  };
}

export function buildOrganizationJsonLd({ name, url, logo }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url
  };

  if (logo) {
    schema.logo = logo;
  }

  return schema;
}

export function buildWebSiteJsonLd({ name, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url
  };
}

export function buildWebPageJsonLd({ name, description, url, siteName, siteUrl, image }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description: stripEmpty(description),
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: siteName,
      url: stripEmpty(siteUrl)
    }
  };

  if (image) {
    schema.primaryImageOfPage = {
      '@type': 'ImageObject',
      url: image
    };
  }

  return schema;
}
