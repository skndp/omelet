import { imageProps } from '~/utils/groq-common';

const SITE_NAME = 'Omelet';
const SEO_DEFAULTS_QUERY = `*[(_type == "site")][0]{
  siteName,
  seoSocial {
    title,
    description,
    image ${imageProps}
  }
}`;

function trimImageQuery(src) {
  return typeof src === 'string' ? src.replace(/\?.*/, '') : '';
}

function formatOgImage(src, fallback) {
  const cleanSrc = trimImageQuery(src);

  if (!cleanSrc) {
    return fallback;
  }

  return `${cleanSrc}?q=95&w=1200`;
}

export function formatSeoTitle(title, siteName) {
  if (!title || title === siteName || title.includes(siteName)) {
    return title || siteName;
  }

  return `${title} | ${siteName}`;
}

export async function useSeoDefaults() {
  const { client } = useSanity();
  const runtimeConfig = useRuntimeConfig();
  const siteUrl = runtimeConfig.public.siteUrl || 'https://omelet.com';
  const fallbackOgImage = `${siteUrl.replace(/\/$/, '')}/apple-touch-icon.png`;
  const { data } = await useAsyncData('seo-defaults', () => client.fetch(SEO_DEFAULTS_QUERY));

  const siteName = data.value?.siteName || SITE_NAME;
  const siteTitle = data.value?.seoSocial?.title || siteName;
  const siteDescription = data.value?.seoSocial?.description || '';
  const ogImage = formatOgImage(data.value?.seoSocial?.image?.src, fallbackOgImage);

  return {
    siteName,
    siteTitle,
    siteDescription,
    ogImage,
    siteUrl,
    meta: {
      title: formatSeoTitle(siteTitle, siteName),
      ogTitle: formatSeoTitle(siteTitle, siteName),
      ogSiteName: siteName,
      description: siteDescription,
      ogDescription: siteDescription,
      ogImage,
      ogUrl: siteUrl
    }
  };
}
