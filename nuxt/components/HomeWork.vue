<template>
  <section id="work-section" class="pad-t">
    <div class="title-block gutter">
      <h3 class="pad-b">{{ title }}</h3>
    </div>
    <div class="work-list" @mouseenter="backsplashDirection" @mouseleave="backsplashDirection">
      <NuxtLink
        v-for="(item, index) in caseStudies"
        class="list-item"
        :class="state.items[index]"
        :to="withTrailingSlash(`/${item.slug.current}`)"
        @mouseenter="onMouseenterListItem($event, index)"
        @mouseleave="onMouseleaveListItem($event, index)"
        :key="index"
      >
        <div class="inner">
          <div class="mask-outer">
            <div class="mask-inner">
              <p class="fs-p3"><span class="marg-r">{{ item.ctaTags.categoryTag.tag }}</span></p>
              <p class="fs-p3"><span class="marg-r">{{ item.ctaTags.industryTag.tag }}</span></p>
            </div>
          </div>
          <div class="gutter">
            <p class="fs-p1">{{ item.title }}</p>
          </div>
        </div>
      </NuxtLink>
      <div :class="`backsplash bg-${state.color}`" :style="{'height': `${100 / caseStudies.length}%`, 'transform': `translateY(${state.translate_y}%) scaleY(${state.scale_y})`, 'transformOrigin': `50% ${state.origin_y}%`}" />
    </div>
  </section>
</template>

<script setup>
import { withTrailingSlash } from '~/utils/trailing-slash';

// Props
const props = defineProps({
  title: {
    type: String
  },
  caseStudies: {
    type: Array
  }
});

const colors_arr = ['gold', 'green', 'orange', 'purple'];
const class_names = ['--in', '--in-top', '--in-bottom', '--out', '--out-top', '--out-bottom'];
const projects = [
  { title: 'Google Small Business' },
  { title: 'Netflix Extraction' },
  { title: 'Hogwarts Legacy' },
  { title: 'Youtube Premium' },
  { title: 'Asana' },
  { title: 'Hikup' },
  { title: 'Google One' },
  { title: 'Google Play' }
];
const state = reactive({
  translate_y: 0,
  scale_y: 0,
  origin_y: 0,
  colors: colors_arr,
  color: colors_arr[0],
  items: []
});
let audioContext, frequencies, convolver;

projects.forEach((item) => {
  state.items.push('--out');
});

// Mounted
onMounted(() => {
  audioContext = new AudioContext();
  frequencies = getMajorScaleFrequencies(220);
});

// Methods
function backsplashDirection(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const dir = e.type === 'mouseenter' ? 1 : 0;
  const mouse_x = e.clientX;
  const mouse_y = e.clientY;
  const top = Math.abs(rect.top - mouse_y);
  const bottom = Math.abs(rect.bottom - mouse_y);
  const left = Math.abs(rect.left - mouse_x);
  const right = Math.abs(rect.right - mouse_x);
  const min = Math.min(top, bottom, left, right);

  state.scale_y = dir;

  if (min === top) {
    state.origin_y = 0;
  } else if (min == bottom) {
    state.origin_y = 100;
  } else {
    state.origin_y = 50;
  }
};

function onMouseenterListItem(e, index) {
  state.translate_y = index * 100;
  state.color = state.colors[index % 4];

  listItemDirection(e, index);
  startAudio(index);
};

function onMouseleaveListItem(e, index) {
  listItemDirection(e, index);
};

function listItemDirection(e, index) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const prefix = e.type === 'mouseenter' ? '--in' : '--out';
  const mouse_x = e.clientX;
  const mouse_y = e.clientY;
  const top = Math.abs(rect.top - mouse_y);
  const bottom = Math.abs(rect.bottom - mouse_y);
  const left = Math.abs(rect.left - mouse_x);
  const right = Math.abs(rect.right - mouse_x);
  const min = Math.min(top, bottom, left, right);

  let edge = '';

  if (min === top) {
    edge = '-top';
  } else if (min == bottom) {
    edge = '-bottom';
  }

  state.items[index] = `${prefix}${edge}`;
}

function getMajorScaleFrequencies(rootFrequency) {
  const scaleRatios = [
    1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8,
    2, 9/8*2, 5/4*2, 4/3*2, 3/2*2, 5/3*2, 15/8*2,
    3, 9/8*3, 5/4*3, 4/3*3, 3/2*3, 5/3*3, 15/8*3
  ];
  return scaleRatios.map(ratio => ratio * rootFrequency);
}

function startAudio(id) {
  if(navigator.userActivation.hasBeenActive === false) return;

  let osc = audioContext.createOscillator();
  let vol = audioContext.createGain();
  let compressor = audioContext.createDynamicsCompressor();
  
  osc.type = "sine";
  osc.frequency.value = frequencies[id];
  
  vol.gain.value = 0.25;
  
  osc.connect(vol).connect(compressor).connect(audioContext.destination);
  
  vol.gain.exponentialRampToValueAtTime(
    vol.gain.value,
    audioContext.currentTime + 0.03
  );

  vol.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.33);

  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.33 + 0.03);
}
</script>

<style lang='scss'>
section#work-section {
  width: 100%;
  padding-bottom: span(2);
  overflow: hidden;

  .title-block {
    padding-bottom: $space-s;
  }

  .work-list {
    position: relative;

    .backsplash {
      display: none;
    }

    @include can-hover {
      .backsplash {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 0px;
        display: flex;
        pointer-events: none;
        transform-origin: 50% 0%;
        transform: translateY(0%) scaleY(0);
        transition: background-color $speed-333 $ease-out, transform $speed-333 $ease-out;
        will-change: background-color transform;

        &:before,
        &:after, {
          content: '';
          position: absolute;
          top: 100%;
          left: 0px;
          width: 100%;
          height: 3px;
          margin-top: -1px;
          background-color: inherit;
        }

        &:before {
          top: 0px;
          margin-top: -2px;
        }
      }
    }

    .list-item {
      position: relative;
      width: 100%;
      box-sizing: border-box;
      border-bottom: 1px solid $ash;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      &:first-child {
        border-top: 1px solid $ash;
      }

      .inner {
        position: relative;
        padding: 16px 0;
        overflow: hidden;
        z-index: 1;

        .mask-outer {
          @include abs-fill;
          overflow: hidden;
          display: none;

          .mask-inner {
            @include abs-fill;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex-shrink: 0;

            p {
              width: span(3.5);
              display: flex;
              align-items: center;
              line-height: 1.1em;

              span {
                display: flex;
                align-items: center;
              }
            }
          }
        }

        .gutter {
          position: relative;
          display: flex;
          align-items: center;

          p {
            position: relative;
            white-space: nowrap;
            display: inline-flex;
            flex-wrap: nowrap;
            flex-shrink: 0;
          }
        }
      }
    }

    @include can-hover {
      .list-item {
        .inner {
          .mask-outer {
            transform: translateY(-100%);
            transition: transform $speed-333 $ease-out;

            .mask-inner {
              transform: translateY(100%);
              transition: transform $speed-333 $ease-out;
            }
          }
        }

        &.--out {
          .inner {
            .mask-outer {
              transform: translateY(-100%);

              .mask-inner {
                transform: translateY(100%);
              }
            }
          }
        }
        &.--out-top {
          .inner {
            .mask-outer {
              transform: translateY(-100%);

              .mask-inner {
                transform: translateY(75%);
              }
            }
          }
        }
        &.--out-bottom {
          .inner {
            .mask-outer {
              transform: translateY(100%);

              .mask-inner {
                transform: translateY(-75%);
              }
            }
          }
        }

        &.--in,
        &.--in-top,
        &.--in-bottom {
          .inner {
            .mask-outer {
              transform: translateY(0%);

              .mask-inner {
                transform: translateY(0%);
              }
            }
          }
        }
      }
    }
  }

  @include respond-to($tablet) {
    padding-bottom: span(1);

    .work-list {
      .list-item {
        .inner {
          padding: 24px 0;

          .mask-outer {
            display: flex;
          }

          .gutter {
            p {
              width: 50%;
            }
          }
        }
      }
    }
  }
}
</style>
