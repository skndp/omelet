function stripEmpty(value) {
  return value || undefined;
}

function stripEmptyArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : undefined;
}

function createNodeId(url, suffix) {
  return `${url}#${suffix}`;
}

export function jsonLdScript(schema, key) {
  return {
    key,
    type: 'application/ld+json',
    children: JSON.stringify(schema)
  };
}

export function buildOrganizationJsonLd({
  name,
  url,
  logo,
  description,
  sameAs,
  email,
  telephone,
  address,
  contactPoint
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': createNodeId(url, 'organization'),
    name,
    url,
    description: stripEmpty(description)
  };

  if (logo) {
    schema.logo = logo;
  }

  const socialProfiles = stripEmptyArray(sameAs);
  if (socialProfiles?.length) {
    schema.sameAs = socialProfiles;
  }

  if (email) {
    schema.email = email;
  }

  if (telephone) {
    schema.telephone = telephone;
  }

  if (address) {
    schema.address = address;
  }

  if (Array.isArray(contactPoint) ? contactPoint.length : contactPoint) {
    schema.contactPoint = contactPoint;
  }

  return schema;
}

export function buildWebSiteJsonLd({ name, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': createNodeId(url, 'website'),
    name,
    url
  };
}

export function buildWebPageJsonLd({
  type = 'WebPage',
  name,
  description,
  url,
  siteName,
  siteUrl,
  image,
  mainEntity,
  about,
  publisher
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': createNodeId(url, 'webpage'),
    name,
    description: stripEmpty(description),
    url,
    isPartOf: {
      '@type': 'WebSite',
      '@id': createNodeId(siteUrl, 'website'),
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

  if (mainEntity) {
    schema.mainEntity = mainEntity;
  }

  if (about) {
    schema.about = about;
  }

  if (publisher) {
    schema.publisher = publisher;
  }

  return schema;
}

export function buildItemListJsonLd({ url, name, itemListElement }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': createNodeId(url, 'itemlist'),
    name: stripEmpty(name),
    url,
    itemListElement
  };
}

export function buildServiceJsonLd({ url, name, description, provider, serviceType }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': createNodeId(url, 'service'),
    url,
    name,
    description: stripEmpty(description)
  };

  if (provider) {
    schema.provider = provider;
  }

  if (serviceType) {
    schema.serviceType = serviceType;
  }

  return schema;
}

export function buildPersonJsonLd({ url, name, jobTitle, image, worksFor }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': createNodeId(url, 'person'),
    name,
    jobTitle: stripEmpty(jobTitle),
    image: stripEmpty(image)
  };

  if (worksFor) {
    schema.worksFor = worksFor;
  }

  return schema;
}

export function buildCaseStudyJsonLd({
  url,
  name,
  description,
  image,
  keywords,
  about,
  publisher,
  mainEntityOfPage
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CaseStudy',
    '@id': createNodeId(url, 'case-study'),
    url,
    name,
    description: stripEmpty(description),
    image: stripEmpty(image),
    keywords: stripEmpty(keywords)
  };

  if (about) {
    schema.about = about;
  }

  if (publisher) {
    schema.publisher = publisher;
  }

  if (mainEntityOfPage) {
    schema.mainEntityOfPage = mainEntityOfPage;
  }

  return schema;
}
