export function getVimeoAsset(vimeo) {
  return vimeo?.asset || vimeo || null;
}

export function getVimeoId(vimeo) {
  const asset = getVimeoAsset(vimeo);

  return asset?.vimeoId || asset?.id || null;
}

export function getVimeoPoster(vimeo, suffix = '_1920?r=rpad') {
  const asset = getVimeoAsset(vimeo);
  const baseLink = asset?.thumbnail || asset?.pictures?.base_link;
  const sizes = asset?.pictures?.sizes || [];
  const size = sizes[sizes.length - 1] || {};

  if (!baseLink) {
    return {
      src: '',
      width: 0,
      height: 0,
      alt: asset?.name || 'Vimeo video'
    };
  }

  return {
    src: `${baseLink.replace('?r=pad', '')}${suffix}`,
    width: size.width || 0,
    height: size.height || 0,
    alt: asset?.name || 'Vimeo video'
  };
}

export function getVimeoAspectRatio(vimeo) {
  const asset = getVimeoAsset(vimeo);
  const width = asset?.width;
  const height = asset?.height;

  if (!width || !height) {
    return '16/9';
  }

  return width / height < 1 ? `${width}/${height}` : '16/9';
}
