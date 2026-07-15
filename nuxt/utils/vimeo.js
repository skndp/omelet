export function getVimeoAsset(vimeo) {
  return vimeo?.asset || vimeo || null;
}

export function getVimeoId(vimeo) {
  const asset = getVimeoAsset(vimeo);

  return asset?.vimeoId || asset?.id || null;
}

export function getVimeoPoster(vimeo, { removePad = true } = {}) {
  const asset = getVimeoAsset(vimeo);
  const sizes = asset?.pictures?.sizes || [];

  // Pick the widest available size instead of assuming array order
  const largest = sizes.reduce(
    (biggest, current) => (current.width > (biggest?.width || 0) ? current : biggest),
    null
  );

  const src = largest?.link || asset?.thumbnail || '';

  if (!src) {
    return {
      src: '',
      width: 0,
      height: 0,
      alt: asset?.name || 'Vimeo video'
    };
  }

  return {
    // '&r=pad' pads to a target aspect ratio instead of cropping;
    // strip it if you're relying on object-fit/background-size: cover
    src: removePad ? src.replace('&r=pad', '') : src,
    width: largest?.width || 0,
    height: largest?.height || 0,
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

  return width / height > 1 ? `${width}/${height}` : '16/9';
}