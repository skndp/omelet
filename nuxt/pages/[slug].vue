<template>
  <div class="case-study-page page">
    <template v-if="pageData">
      <Hero
        :title="pageData.title"
        :slug="pageData.slug.current"
        :subtitle="pageData.subtitle"
        :media="pageData.heroMedia[0]"
      />
      <BuilderTextBlock
        alignment="left"
        :headline="pageData.overview.headline"
        :richtext="pageData.overview.richtext"
        :tags="pageData.tags"
      />
      <template v-for="(block, index) in pageData.blocks">
        <BuilderTextBlock
          v-if="block.type === 'textBlock'"
          :alignment="block.alignment"
          :headline="block.headline"
          :richtext="block.richtext"
        />
        <BuilderPullQuote
          v-if="block.type === 'pullQuote'"
          :quote="block.title"
          :citee="block.citee"
        />
        <BuilderImage
          v-if="block.type === 'singleImage'"
          :image="block.image"
        />
        <BuilderVideo
          v-if="block.type === 'videoLoop'"
          :vimeo="block.vimeo"
          :controls="false"
        />
        <BuilderVideo
          v-if="block.type === 'videoPlayer'"
          :vimeo="block.vimeo"
          :controls="true"
        />
        <BuilderCarousel
          v-if="block.type === 'carousel'"
          :slides="block.slides"
        />
        <BuilderMediaGrid
          v-if="block.type === 'mediaGrid'"
          :items="block.items"
        />
        <BuilderMultiColumn
          v-if="block.type === 'multiColumn'"
          :items="block.items"
          :orientation="block.orientation"
        />
        <BuilderStats
          v-if="block.type === 'stats'"
          :stats="block.items"
        />
      </template>
      <UpNext
        v-if="getNextCta"
        :cta="getNextCta"
      />
      <Footer />
    </template>
  </div>
</template>

<script setup>
import { useSiteStore } from '~/stores/store';

const route = useRoute();
const router = useRouter();
const store = useSiteStore();
const { client } = useSanity();

const pageQuery = groq`*[_type == 'caseStudy' && slug.current == $slug][0]{
  title,
  slug,
  subtitle,
  heroMedia[] {
    _type == 'singleImage' => {
      'type': _type,
      image ${imageProps}
    },
    _type == 'videoLoop' => {
      'type': _type,
      vimeo
    }
  },
  overview {
    headline,
    richtext
  },
  tags[]-> {
    tag
  },
  blocks[] {
    _type == 'textBlock' => {
      'type': _type,
      alignment,
      headline,
      richtext
    },
    _type == 'pullQuote' => {
      'type': _type,
      title,
      citee
    },
    _type == 'singleImage' => {
      'type': _type,
      image ${imageProps}
    },
    _type == 'videoLoop' => {
      'type': _type,
      vimeo
    },
    _type == 'videoPlayer' => {
      'type': _type,
      vimeo
    },
    _type == 'carousel' => {
      'type': _type,
      slides[] {
        _type == 'singleImage' => {
          'type': _type,
          image ${imageProps}
        },
        _type == 'videoLoop' => {
          'type': _type,
          vimeo
        },
        _type == 'videoPlayer' => {
          'type': _type,
          vimeo
        }
      }
    },
    _type == 'mediaGrid' => {
      'type': _type,
      items[] {
        _type == 'singleImage' => {
          'type': _type,
          image ${imageProps}
        },
        _type == 'videoLoop' => {
          'type': _type,
          vimeo
        },
        _type == 'videoPlayer' => {
          'type': _type,
          vimeo
        }
      }
    },
    _type == 'multiColumn' => {
      'type': _type,
      items[] {
        _type == 'singleImage' => {
          'type': _type,
          image ${imageProps}
        },
        _type == 'videoLoop' => {
          'type': _type,
          vimeo
        },
        _type == 'videoPlayer' => {
          'type': _type,
          vimeo
        },
        _type == 'textColumn' => {
          'type': _type,
          richtext
        }
      },
      orientation
    },
    _type == 'stats' => {
      'type': _type,
      items[] {
        title,
        copy
      }
    },
  }
}`;
const homeQuery = groq`*[(_type == "home")][0]{
  caseStudies[]-> {
    title,
    'slug': slug.current
  }
}`

// Async data
const uniqKey = `home-and-cs-${route.params.slug}`;
const { data } = await useAsyncData(uniqKey,
  async () => {
    const page = await client.fetch(pageQuery, { slug: route.params.slug });
    if (!page) {
      throw createError({
        statusCode: 404
      });
    }

    // Got page? Great, route exists. Now get home query...
    const home = await client.fetch(homeQuery);

    return { page, home };
  }
);

const pageData = computed(() => data.value?.page);
const homeData = computed(() => data.value?.home);

// Page transitions...
// Define a default name and mode...
definePageMeta({
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  }
});

if (pageData && pageData.value) {
  const seo_title = `${pageData.value.title} | ${store.siteName}`;
  const seo_description = pageData.value.subtitle ? pageData.value.subtitle : store.siteDescription;
  const hero_media = pageData.value.heroMedia[0];
  const seo_url = `https://www.omelet.com/${route.params.slug}`;
  let seo_image = store.ogImage;

  if (hero_media.type !== 'singleImage') {
    seo_image = hero_media.vimeo.pictures.base_link.replace('?r=pad', '') + '_1920?r=rpad';
  } else {
    seo_image = hero_media.image.src;
  }

  // Composables
  useSeoMeta({
    title: seo_title,
    ogTitle: seo_title,
    description: seo_description,
    ogDescription: seo_description,
    ogImage: seo_image,
    ogUrl: seo_url
  })
}

// Computed
const getNextCta = computed(() => {
  if (!homeData.value) return;

  const current_index = homeData.value.caseStudies.findIndex(cs => cs.slug === route.params.slug);
  const next_case_study = current_index < homeData.value.caseStudies.length - 1 ? homeData.value.caseStudies[current_index + 1] : homeData.value.caseStudies[0];

  if (current_index < 0) {
    // Doesn't exist in case studies list (deep-linking to one-off project)
    return false;
  } else {
    return next_case_study;
  }
});

// Now check to and from names to determine directional page transitions...
let beforeEachExecuted = false;

router.beforeEach(async (to, from) => {
  const from_name = from.name;
  const to_name = to.name;

  // Only run this if we haven't executed the beforeEach logic already
  if (from_name && to_name && !beforeEachExecuted) {
    // Wait for the async data to be available
    await data; // This ensures that the data is fetched before proceeding

    let direction = 'slide-left';

    // Once the data is available, run the transition logic
    if (from_name === 'index' && to_name === 'slug') {
      direction = 'slide-left';
    }
    // Case Study to Case Study
    else if (from_name === 'slug' && to_name === 'slug') {
      // Ensure homeData is available before proceeding
      if (!homeData.value?.caseStudies) {
        return; // Prevent logic from executing if homeData is still undefined or loading
      }

      const from_index = homeData.value.caseStudies.findIndex(cs => cs.slug === from.params.slug);
      const to_index = homeData.value.caseStudies.findIndex(cs => cs.slug === to.params.slug);
      const last_index = homeData.value.caseStudies.length - 1;

      if (to_index === 0 && from_index === last_index) {
        direction = 'slide-left';
      } else if (to_index === last_index && from_index === 0) {
        direction = 'slide-right';
      } else {
        if (to_index < from_index) {
          direction = 'slide-right';
        }
      }
    }
    // Case Study to Home Page
    else if (from_name === 'slug' && to_name === 'index') {
      direction = 'slide-right';
    }

    if (store.page_change_from_menu) {
      direction = 'fade';
    }

    to.meta.pageTransition.name = direction;
    from.meta.pageTransition.name = direction;
    store.setPageMaskName(direction);

    beforeEachExecuted = true;
  }
});

// Mounted
onMounted(() => {
  if (store.loading) {
    setTimeout(() => {
      store.setLoaderComplete();
    }, 1800);
  }

  store.setPageMask(false);
})

// Before Unmount
onBeforeUnmount(() => {
  store.setPageMask(true);
});
</script>

<style lang='scss'>
.case-study-page {
}
</style>
