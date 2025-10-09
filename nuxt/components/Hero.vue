<template>
  <section class="hero-section pad-bl">
    <div class="hero-section-inner">
      <div class="hero-media">
        <ResponsiveImage v-if="media.type === 'singleImage'" v-bind="media.image" />
        <VideoCover v-if="media.type !== 'singleImage' && video" :vimeo="video.vimeo" :cover="true" :hero="true" />
      </div>
      <div class="hero-title pad-b">
        <div class="gutter">
          <h2>{{ title }}</h2>
          <p v-if="subtitle" class="fs-p2">{{ subtitle }}</p>
        </div>
      </div>
      <div v-if="getPrevSlug && getNextSlug" class="hero-controls gutter pad-b">
        <NuxtLink class="arrow --prev" :to="getPrevSlug" />
        <NuxtLink class="arrow --next" :to="getNextSlug" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useSiteStore } from '~/stores/store';

const route = useRoute();
const store = useSiteStore();
const props = defineProps({
  title: {
    type: String
  },
  slug: {
    type: String
  },
  subtitle: {
    type: String
  },
  media: {
    type: Object
  }
});

let vimeo_poster = false;
let video = false;

if (props.media.type !== 'singleImage') {
  video = props.media;
}

const homeQuery = groq`*[(_type == "home")][0]{
  caseStudies[]-> {
    title,
    'slug': slug.current
  }
}`

// Async data
const uniqKey = 'home-hero';
const { data } = await useAsyncData(uniqKey, () => useSanity().fetch(homeQuery));
const home = data.value;

// Computed
const getPrevSlug = computed(() => {
  if (!home.caseStudies) return;

  const current_index = home.caseStudies.findIndex(cs => cs.slug === route.params.slug);
  const prev_slug = current_index > 0 ? home.caseStudies[current_index - 1].slug : home.caseStudies[home.caseStudies.length - 1 ].slug;

  if (current_index < 0) {
    // Doesn't exist in case studies list (deep-linking to one-off project)
    return false;
  } else {
    return prev_slug;
  }
});

const getNextSlug = computed(() => {
  if (!home.caseStudies) return;

  const current_index = home.caseStudies.findIndex(cs => cs.slug === route.params.slug);
  const next_slug = current_index < home.caseStudies.length - 1 ? home.caseStudies[current_index + 1].slug : home.caseStudies[0].slug;

  if (current_index < 0) {
    // Doesn't exist in case studies list (deep-linking to one-off project)
    return false;
  } else {
    return next_slug;
  }
});
</script>

<style lang='scss'>
section.hero-section {
  position: relative;
  overflow: hidden;

  .hero-section-inner {
    position: relative;
    background-color: $black;
  }

  .hero-media {
    position: relative;
    width: 100%;
    aspect-ratio: 375/320;
    max-height: 500px;
    overflow: hidden;
    display: flex;

    img,
    video,
    iframe {
      @include abs-fill;
      object-fit: cover;
      object-position: 50% 50%;
    }
  }

  .hero-title {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    color: $white;

    h2 {
      max-width: 500px;
    }

    p.fs-p2 {
      margin-top: $space-xs;
      line-height: 24px;
    }
  }

  .hero-controls {
    position: absolute;
    bottom: 0px;
    right: 0px;
    display: inline-flex;

    .arrow {
      width: 24px;
      height: 24px;
      @include arrow($white);
      cursor: pointer;
      display: inline-flex;

      &.--prev {
        margin-right: $space-l;
        transform: rotate(180deg);
      }
    }
  }

  @include respond-to($tablet) {
    .hero-title {
      h2 {
        width: span(10);
        max-width: none;
      }

      p.fs-p2 {
        margin-top: $space-m;
        line-height: 34px;
      }
    }

    .hero-controls {
      .arrow {
        width: 34px;
        height: 34px;
      }
    }
  }

  @include respond-to($average-desktop) {
    .hero-title {
      h2 {
        width: span(8);
      }
    }
  }
}
</style>
