export function useCanonicalUrl(path) {
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();
  const siteUrl = runtimeConfig.public.siteUrl || 'https://omelet.com';

  return computed(() => {
    const resolvedPath = path ?? route.path;
    const normalizedPath = resolvedPath === '/'
      ? '/'
      : `${resolvedPath.replace(/\/$/, '')}/`;

    return new URL(normalizedPath, siteUrl).href;
  });
}
