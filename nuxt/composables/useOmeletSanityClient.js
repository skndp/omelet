import { createClient } from '@sanity/client';

function buildClientOptions(clientName, runtimeConfig) {
  const options = {
    projectId: runtimeConfig.public.sanityProjectId,
    dataset: runtimeConfig.public.sanityDataset || 'production',
    apiVersion: runtimeConfig.public.sanityApiVersion || '2022-03-07',
    useCdn: false
  };

  if (clientName === 'preview') {
    options.perspective = 'previewDrafts';
    options.withCredentials = true;
  }

  return options;
}

function createHelper(options) {
  const client = createClient(options);

  return {
    client,
    fetch: (...args) => client.fetch(...args)
  };
}

export function useOmeletSanityClient(clientName = 'default') {
  if (import.meta.server) {
    return useSanity(clientName);
  }

  const nuxtApp = useNuxtApp();
  const cacheKey = clientName === 'preview' ? '_omeletSanityPreview' : '_omeletSanity';

  if (!nuxtApp[cacheKey]) {
    const runtimeConfig = useRuntimeConfig();
    nuxtApp[cacheKey] = createHelper(buildClientOptions(clientName, runtimeConfig));
  }

  return nuxtApp[cacheKey];
}
