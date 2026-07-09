import { defineNuxtModule } from '@nuxt/kit';

async function fetchSanityQuery({ projectId, dataset, apiVersion, query }) {
  const apiUrl = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  apiUrl.searchParams.set('query', query);

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Sanity route fetch failed with ${response.status}`);
  }

  const payload = await response.json();
  return payload.result || [];
}

export default defineNuxtModule({
  meta: {
    name: 'sanity-routes'
  },
  async setup(_, nuxt) {
    nuxt.hook('nitro:config', async (nitroConfig) => {
      const runtimePublicConfig = nuxt.options.runtimeConfig?.public || {};
      const projectId = runtimePublicConfig.sanityProjectId || process.env.NUXT_SANITY_PROJECT_ID;
      const dataset = runtimePublicConfig.sanityDataset || process.env.NUXT_SANITY_DATASET || 'production';
      const apiVersion = runtimePublicConfig.sanityApiVersion || process.env.NUXT_SANITY_API_VERSION || '2022-03-07';

      nitroConfig.prerender = nitroConfig.prerender || {};
      nitroConfig.prerender.crawlLinks = true;

      const routes = new Set([
        ...(nitroConfig.prerender.routes || []),
        '/'
      ]);

      if (!projectId || !dataset) {
        console.warn('[sanity-routes] Skipping case study routes because project ID or dataset is missing.');
        nitroConfig.prerender.routes = [...routes];
        return;
      }

      const caseStudies = await fetchSanityQuery({
        projectId,
        dataset,
        apiVersion,
        query: `*[
          _type == "caseStudy" &&
          defined(slug.current) &&
          !(_id in path("drafts.**"))
        ]{
          "slug": slug.current
        }`
      });

      caseStudies.forEach(({ slug }) => {
        if (!slug) {
          return;
        }

        routes.add(`/${slug}`);
      });

      nitroConfig.prerender.routes = [...routes];
    });
  }
});
