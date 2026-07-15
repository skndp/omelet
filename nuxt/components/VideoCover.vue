<template>
  <div ref="wrapper" class="video-cover-wrapper" :class="{'--no-controls': !controls}">
    <p class="screen-reader">Video name: {{ poster.alt }}</p>
    <div class="video-holder" :aria-label="poster.alt" :class="{'--show': state.playing_mode, '--cover': cover}" :style="[cover && {'width': `${state.player_width}px`, 'height': `${state.player_height}px`}]">
      <client-only>
        <vueVimeoPlayer ref="player"
          :video-id="vid"
          :options="state.options"
          :player-width="state.player_width"
          :player-height="state.player_height"
          @loaded="onLoaded"
          @playing="isPlaying"
          @ended="onEnded"
        />
      </client-only>
    </div>
    <div class="video-poster" :class="{'--show': !state.playing_mode}">
      <ResponsiveImage v-bind="poster" :nosr="true" />
      <button v-if="controls || store.accessibility" class="play-btn" @click="clickToPlay">
        <span class="fs-p2">Play</span>
      </button>
    </div>
    <div v-if="hero && store.accessibility" class="video-poster --show force-poster">
      <ResponsiveImage v-bind="poster" :nosr="true" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useSiteStore } from '~/stores/store';
import { vueVimeoPlayer } from 'vue-vimeo-player';
import { getVimeoAsset, getVimeoId, getVimeoPoster } from '~/utils/vimeo';

defineExpose({
  carouselSlideChange
});

const store = useSiteStore();

// Props
const props = defineProps({
  hero: {
    type: Boolean,
    default: false,
    required: false
  },
  vimeo: {
    type: Object
  },
  controls: {
    type: Boolean,
    default: false,
    required: false
  },
  cover: {
    type: Boolean,
    default: false,
    required: false
  }
});

const state = reactive({
  playing_mode: false,
  player_width: 0,
  player_height: 0,
  options: {
    controls: props.controls ? true : false,
    loop: props.controls ? false : true,
    muted: props.controls ? false : true,
    playsinline: true,
    autopause: 0
  }
});

if (store.accessibility) {
  state.options.loop = false;
}

let player = ref();
const wrapper = ref();
const vimeo = computed(() => getVimeoAsset(props.vimeo));
const poster = computed(() => getVimeoPoster(props.vimeo));
const vid = computed(() => getVimeoId(props.vimeo));

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
function onLoaded() {
  if (!props.controls && !store.accessibility) {
    player.value.play();
  }
}

function isPlaying() {
  state.playing_mode = true;
}

function clickToPlay() {
  player.value.play();
  state.playing_mode = true;
}

function onEnded() {
  player.value.pause();
  state.playing_mode = false;
}

function onResize() {
  if (!props.cover) return false;

  const wrapper_width = wrapper.value.clientWidth;
  const wrapper_height = wrapper.value.clientHeight;
  const video_ratio = vimeo.value?.width && vimeo.value?.height
    ? vimeo.value.width / vimeo.value.height
    : 16 / 9;
  let new_width = wrapper_width;
  let new_height = wrapper_height;

  if (wrapper_width / wrapper_height > video_ratio) {
    new_height = wrapper_width / video_ratio;
  } else {
    new_width = wrapper_height * video_ratio;
  }

  state.player_width = new_width + 2;
  state.player_height = new_height + 2;
}

function carouselSlideChange() {
  if (props.controls || store.accessibility) {
    if (player) {
      player.value.pause();
    }

    state.playing_mode = false;
  }
};

// Watchers
watch(() => store.accessibility, (newValue, oldValue) => {
  if (newValue === true) {
    if (player) {
      player.value.pause();
    }

    state.playing_mode = false;
  } else {
    if (!props.controls) {
      player.value.play();
    }
  }
});
</script>

<style lang='scss'>
.video-cover-wrapper {
  @include abs-fill;
  overflow: hidden;

  &.--no-controls {
    pointer-events: none;
  }

  .video-holder {
    position: absolute;
    opacity: 0;

    &:not(.--cover) {
      @include abs-fill;
    }

    &.--cover {
      top: 50%;
      left: 50%;
      width: 0px;
      height: 0px;
      transform: translateX(-50%) translateY(-50%);
    }

    &.--show {
      opacity: 1;
    }
  }

  .video-poster {
    @include abs-fill;
    background-color: $black;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
    transition: opacity $speed-666 $ease-out;

    &.--show {
      pointer-events: auto;
      opacity: 1;
    }

    .play-btn {
      @include abs-fill;
      color: $white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      @include can-hover {
        &:hover {
          &:before {
            opacity: 1;
          }

          span {
            &:after {
              transform: scaleX(1) translateX(-50%);
            }
          }
        }
      }

      &:before {
        content: '';
        @include abs-fill;
        background-color: rgba($black, 0.4);
        opacity: 0;
        transition: $speed-333 $ease-out;
      }

      span {
        position: relative;
        height: 34px;
        display: inline-flex;
        align-items: center;

        &:after {
          content: '';
          position: absolute;
          bottom: 0px;
          left: 50%;
          width: 100%;
          height: 2px;
          background-color: $white;
          transform-origin: 0% 50%;
          transform: scaleX(1.4) translateX(-50%);
          transition: transform $speed-333 $ease-out;
        }
      }
    }
  }

  img,
  iframe {
    @include abs-fill;
    object-fit: cover;
    object-position: 50% 50%;
  }
}
</style>
