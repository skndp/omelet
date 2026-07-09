import { setHeader } from 'h3';
import { createClient } from '@sanity/client';

const SITE_FALLBACK_NAME = 'Omelet';
const SITE_FALLBACK_DESCRIPTION = 'Omelet is an independent creative agency in Los Angeles that helps brands thrive through integrated campaigns, brand strategy, and original content.';

const LLMS_QUERY = `{
  "site": *[_type == "site"][0]{
    siteName,
    seoSocial {
      title,
      description
    },
    generalEmail,
    businessEmail,
    address,
    phoneNumber
  },
  "caseStudies": *[_type == "caseStudy"] | order(title asc) {
    title,
    subtitle,
    slug
  }
}`;

function normalizeUrl(siteUrl, path) {
  return new URL(path, siteUrl).href;
}

function buildCaseStudyLine(siteUrl, caseStudy) {
  const title = caseStudy.title || 'Case Study';
  const subtitle = caseStudy.subtitle || title;
  const slug = caseStudy.slug?.current;

  if (!slug) {
    return null;
  }

  return `- [${title}](${normalizeUrl(siteUrl, `/${slug}/`)}): ${subtitle}`;
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const siteUrl = runtimeConfig.public.siteUrl || 'https://omelet.com';
  const client = createClient({
    projectId: runtimeConfig.public.sanityProjectId,
    dataset: runtimeConfig.public.sanityDataset || 'production',
    apiVersion: runtimeConfig.public.sanityApiVersion || '2022-03-07',
    useCdn: false
  });
  const data = await client.fetch(LLMS_QUERY);

  const siteName = data?.site?.siteName || SITE_FALLBACK_NAME;
  const siteDescription = data?.site?.seoSocial?.description || SITE_FALLBACK_DESCRIPTION;
  const caseStudyLines = (data?.caseStudies || [])
    .map((caseStudy) => buildCaseStudyLine(siteUrl, caseStudy))
    .filter(Boolean);

  const llms = [
    `# ${siteName} llms.txt`,
    '',
    `> ${siteDescription}`,
    '',
    '## Site',
    `[Home](${normalizeUrl(siteUrl, '/')})`,
    `[Work](${normalizeUrl(siteUrl, '/?work')})`,
    `[Capabilities](${normalizeUrl(siteUrl, '/?capabilities')})`,
    `[Leadership](${normalizeUrl(siteUrl, '/?leadership')})`,
    `[Contact](${normalizeUrl(siteUrl, '/?contact')})`,
    '',
    '## Capabilities',
    `[Capabilities](${normalizeUrl(siteUrl, '/?capabilities')}): An overview of the services and expertise offered by Omelet, highlighting their approach to integrated marketing and brand strategy.`,
    '',
    '## Leadership',
    `[Leadership](${normalizeUrl(siteUrl, '/?leadership')}): Information about the leadership team at Omelet, detailing their experience and vision for the agency.`,
    '',
    '## Case Studies',
    ...caseStudyLines,
    '',
    '## Contact',
    data?.site?.generalEmail ? `- Email: [${data.site.generalEmail}](mailto:${data.site.generalEmail})` : null,
    data?.site?.businessEmail ? `- Email: [${data.site.businessEmail}](mailto:${data.site.businessEmail})` : null,
    data?.site?.address ? `- Address: ${data.site.address}` : null,
    data?.site?.phoneNumber ? `- Phone: ${data.site.phoneNumber}` : null
  ].filter(Boolean);

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
  setHeader(event, 'Cache-Control', 'public, max-age=300, stale-while-revalidate=86400');

  return llms.join('\n');
});
