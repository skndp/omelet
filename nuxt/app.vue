<template>
  <div>
    <transition name="loading" :duration="2100">
      <Loader v-if="store.loading" />
    </transition>
    <Transition name="p2p-loading">
      <PageToPageLoader v-if="pageToPageLoader" />
    </Transition>
    <DevOnly>
      <GridOverlay />
    </DevOnly>
    <Header />
    <transition :name="store.page_mask_name">
      <PageMask v-if="store.page_mask" />
    </transition>
    <transition name="menu">
      <Menu v-if="store.menu_open" />
    </transition>
    <NuxtPage />
  </div>
</template>

<script setup>
import { useNuxtApp } from '#app';
import { useRouter } from 'vue-router';
import { useSiteStore } from '~/stores/store';

const nuxtApp = useNuxtApp();
const router = useRouter();
const store = useSiteStore();

const pageToPageLoader = ref(false);
let pageToPageLoaderTimeout = null;

router.beforeResolve((to, from, next) => {
  if (to.path !== from.path) {
    pageToPageLoaderTimeout = setTimeout(() => {
      pageToPageLoader.value = true;
    }, 333); // loader only appears if page load > 333ms
  }
  next();
});

nuxtApp.hook('page:finish', () => {
  clearTimeout(pageToPageLoaderTimeout);
  if (pageToPageLoader.value) {
    pageToPageLoader.value = false;
  }
});

const siteQuery = groq`*[(_type == "site")][0]{
  siteName,
  seoSocial {
    description,
    'image': image.asset->url
  }
}`

// Async data
const uniqKey = 'site-app';
const { data } = await useAsyncData(uniqKey, () => useSanity().fetch(siteQuery));
const site = data.value;

store.setGlobalSeo(site);

// Mounted
onMounted(() => {
  window.addEventListener('resize', onResize);
  onResize();
});

// Before Unmount
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});

// Methods
function onResize() {
  updateScrollbarWidth();
};

function updateScrollbarWidth() {
  // NOTE: Store scrollbar width in css custom property to calculate grid spans properly
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
};
</script>

<style lang='scss'>
// Default page transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity $speed-666 $evil-ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Directional page transition
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform $speed-666 $evil-ease;
}

.slide-left-enter-from,
.slide-right-leave-to {
  transform: translateX(#{span(2)});
}

.slide-right-enter-from,
.slide-left-leave-to {
  transform: translateX(#{span(-2)});
}
</style>
