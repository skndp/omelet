<template>
  <div id="home-page" class="page space-t">
    <HomeHero
      v-if="pageData"
      :video="pageData.heroVideo"
    />
    <HomeOverview
      v-if="pageData"
      :title="pageData.overviewTitle"
      :subtitle="pageData.overviewSubtitle"
      :copy="pageData.overviewSubcopy"
    />
    <HomeWork
      v-if="pageData"
      :title="pageData.workTitle"
      :caseStudies="pageData.caseStudies"
    />
    <HomeCapabilities
      v-if="pageData"
      :title="pageData.capabilitiesTitle"
      :handwriting="pageData.capabilitiesHandwriting"
      :tags="pageData.capabilitiesTags"
      :ctas="[pageData.servicesCTA1, pageData.servicesCTA2]"
    />
    <HomeTeam
      v-if="pageData"
      :title="pageData.teamTitle"
      :members="pageData.members"
    />
    <Footer />
  </div>
</template>

<script setup>
import { useSiteStore } from '~/stores/store';
import { smoothScrollTo } from '~/utils/smooth-scroll-to';

const route = useRoute();
const router = useRouter();
const store = useSiteStore();
const homeQuery = groq`*[(_type == "home")][0]{
  heroVideo,
  overviewTitle,
  overviewSubtitle,
  overviewSubcopy,
  workTitle,
  caseStudies[]-> {
    title,
    slug,
    ctaTags {
      categoryTag->{ tag },
      industryTag->{ tag }
    }
  },
  capabilitiesTitle,
  capabilitiesHandwriting,
  capabilitiesTags[]-> {
    tag
  },
  servicesCTA1 {
    title,
    copy,
    label,
    url
  },
  servicesCTA2 {
    title,
    copy,
    label,
    url
  },
  teamTitle,
  members[] {
    name,
    title,
    image ${imageProps}
  }
}`;
const pageData = await useSanityData({ query: homeQuery });

useSeoMeta({
  title: store.siteTitle,
  ogTitle: store.siteTitle,
  description: store.siteDescription,
  ogDescription: store.siteDescription,
  ogImage: store.ogImage,
  ogUrl: store.ogUrl
})

// Page transitions
definePageMeta({
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  },
  middleware: function(to, from) {
    const from_name = from.name;
    const to_name = to.name;

    // Going page-to-page, not just first time landing on page...
    if (from_name && to_name) {
      // Home Page to Case Study...
      if (from_name === 'index' && to_name === 'slug') {
        to.meta.pageTransition.name = 'slide-left';
        from.meta.pageTransition.name = 'slide-left';
      }
      // Case Study to Home Page...
      if (from_name === 'slug' && to_name === 'index') {
        to.meta.pageTransition.name = 'slide-right';
        from.meta.pageTransition.name = 'slide-right';
      }
    }
  }
})

// Now check to and from names to determine directional page transitions...
let beforeEachExecuted = false;
router.beforeEach(async (to, from) => {
  const from_name = from.name;
  const to_name = to.name;

  // Going page-to-page, not just first time landing on page...
  if (from_name && to_name && from_name && !beforeEachExecuted) {
    beforeEachExecuted = true;
    let direction = 'slide-left';

    // Home Page to Case Study...
    if (from_name === 'index' && to_name === 'slug') {
      direction = 'slide-left';
    }
    // Case Study to Home Page...
    if (from_name === 'slug' && to_name === 'index') {
      direction = 'slide-right';
    }

    to.meta.pageTransition.name = direction;
    from.meta.pageTransition.name = direction;
    store.setPageMaskName(direction);
  }
});

// Mounted
onMounted(() => {
  if (store.loading) {
    setTimeout(() => {
      store.setLoaderComplete();
      setTimeout(() => {
        checkSearchParams();
      }, 27);
    }, 1800);
  } else {
    setTimeout(() => {
      checkSearchParams();
    }, 666);
  }

  store.setPageMask(false);
});

// Before Unmount
onBeforeUnmount(() => {
  store.setPageMask(true);
});

// Methods
function checkSearchParams() {
  const query = window.location.search;

  if (query) {
    const el = document.getElementById(`${query.replace('?','')}-section`);
    if (el) {
      smoothScrollTo(el, () => {
        setTimeout(() => {
          store.setHideHeader();
        }, 27);
      });
    }
  }
}

// Watchers
watch(() => route.query, (newQuery, oldQuery) => {
  if (!Object.keys(newQuery)[0]) {
    smoothScrollTo(0);
  } else {
    const el = document.getElementById(`${Object.keys(newQuery)[0]}-section`);
    if (el) {
      smoothScrollTo(el, () => {
        setTimeout(() => {
          store.setHideHeader();
        }, 27);
      });
    }
  }
});
</script>
