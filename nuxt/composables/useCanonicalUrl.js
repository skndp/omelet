import { withTrailingSlash } from '~/utils/trailing-slash';

export function useCanonicalUrl(path) {
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();
  const siteUrl = runtimeConfig.public.siteUrl || 'https://omelet.com';

  return computed(() => {
    const normalizedPath = withTrailingSlash(path ?? route.path);

    return new URL(normalizedPath, siteUrl).href;
  });
}
