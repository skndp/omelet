import { imageProps } from '~/utils/groq-common';

const SITE_NAME = 'Omelet';
const SEO_DEFAULTS_QUERY = `*[(_type == "site")][0]{
  siteName,
  seoSocial {
    title,
    description,
    image ${imageProps}
  },
  generalEmail,
  businessEmail,
  address,
  addressLink,
  phoneNumber,
  linkedin,
  instagram
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
  const { client } = useOmeletSanityClient();
  const runtimeConfig = useRuntimeConfig();
  const siteUrl = runtimeConfig.public.siteUrl || 'https://omelet.com';
  const fallbackOgImage = `${siteUrl.replace(/\/$/, '')}/apple-touch-icon.png`;
  const { data } = await useAsyncData('seo-defaults', () => client.fetch(SEO_DEFAULTS_QUERY));

  const siteName = data.value?.siteName || SITE_NAME;
  const homeTitle = data.value?.seoSocial?.title || siteName;
  const siteDescription = data.value?.seoSocial?.description || '';
  const ogImage = formatOgImage(data.value?.seoSocial?.image?.src, fallbackOgImage);
  const sameAs = [data.value?.linkedin, data.value?.instagram].filter(Boolean);

  return {
    siteName,
    siteTitle: homeTitle,
    homeTitle,
    siteDescription,
    ogImage,
    siteUrl,
    generalEmail: data.value?.generalEmail || '',
    businessEmail: data.value?.businessEmail || '',
    address: data.value?.address || '',
    addressLink: data.value?.addressLink || '',
    phoneNumber: data.value?.phoneNumber || '',
    linkedin: data.value?.linkedin || '',
    instagram: data.value?.instagram || '',
    sameAs,
    meta: {
      title: homeTitle,
      ogTitle: homeTitle,
      ogSiteName: siteName,
      description: siteDescription,
      ogDescription: siteDescription,
      ogImage,
      ogUrl: siteUrl
    }
  };
}
