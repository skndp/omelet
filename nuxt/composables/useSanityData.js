import debounce from 'debounce';

export default async function ({ query, params }) {
  const route = useRoute();
  const isPreview = route.query && route.query.preview === 'true' ? true : false;
  const sanity = useOmeletSanityClient(isPreview ? 'preview' : 'default');

  onMounted(() => {
    if (isPreview) {
      const debouncedRefresh = debounce(refresh, 1000);

      sanity.client.listen(query, params, { includeResult: true }).subscribe((event) => {
        if (event.result) {
          debouncedRefresh();
        }
      });
    }
  });

  const key = `sanity-data-${route.fullPath}`;
  const { data, refresh } = await useLazyAsyncData(key, () => sanity.fetch(query, params || {}), {
    server: true
  });

  return data;
}
