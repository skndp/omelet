export function withTrailingSlash(path) {
  if (!path || path === '/') {
    return '/';
  }

  const [pathname, query = ''] = path.split('?');
  const normalizedPath = pathname.endsWith('/') ? pathname : `${pathname}/`;

  return query ? `${normalizedPath}?${query}` : normalizedPath;
}
