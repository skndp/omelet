<template>
  <header :class="{'--hidden': store.hide_header, '--shield': state.shield_mode, '--dark-mode': store.dark_mode, '--menu-mode': store.menu_open}">
    <div class="inner">
      <NuxtLink :class="{'logo': true, 'marg-l': true, 'appear': !store.loading, 'reset': state.loading_cb}" to="/" @click.native="onClickLogo">
        Omelet<span /><span /><span /><span /><span /><span />
      </NuxtLink>
      <h1 class="pre" v-html="getTitleLines" />
      <nav id="mobile-nav" class="marg-r">
        <button class="icon --accessibility" :class="{'--enabled': store.accessibility}" aria-label="Accessibility" @click="onClickAccessibility" />
        <button id="menu-btn" @click="toggleMenu" aria-label="Menu">
          <div class="lines"><span inert /><span /></div>
          <div class="lines"><span inert /><span /></div>
        </button>
      </nav>
      <nav id="primary-nav">
        <NuxtLink v-for="item in site_nav" class="nav-item nav-a1" :to="`/?${item.id}`" @click.native="onClickNavItem(item.id)">{{ item.label }}</NuxtLink>
        <NuxtLink class="icon --contact" to="/?contact" @click.native="onClickNavItem('contact')" aria-label="Contact" />
        <button class="icon --accessibility marg-r" :class="{'--enabled': store.accessibility}" aria-label="Accessibility" @click="onClickAccessibility" />
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useSiteStore } from '~/stores/store';
import { smoothScrollTo } from '~/utils/smooth-scroll-to';

const route = useRoute();
const store = useSiteStore();
const state = reactive({
  event_horizon: 0,
  diff_scroll: 0,
  last_scroll: 0,
  hidden: false,
  shield_mode: false,
  scrolling_cb: false,
  loading_cb: false
});

const site_nav = [
  { id: 'work', label: 'Work' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'leadership', label: 'Leadership' }
]

const siteQuery = groq`*[(_type == "site")][0]{
  headerTitle
}`

// Async data
const uniqKey = 'site-header';
const { data } = await useAsyncData(uniqKey, () => useSanity().fetch(siteQuery));
const site = data.value;

// Computed
const getTitleLines = computed(() => {
  let html = '';

  if (site.headerTitle) {
    const lines = site.headerTitle.split('\n');
    lines.forEach((line, index) => {
      let br = index < lines.length - 1 ? '\n' : '';
      if (index === 0) {
        html += `<strong>${line}</strong>${br}`;
      } else {
        html += `${line}${br}`;
      }
    });
  }

  return html;
});

// Mounted
onMounted(() => {
  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', onScroll);

  checkAccessibilityMode();
  onResize();
  onScroll();
  checkRoute();
});

// Before Unmount
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  window.removeEventListener('scroll', onScroll);
});

// Methods
function onResize() {
  if (window.innerWidth >= 768 && store.menu_open) {
    store.setMenuClose();
  }
};

function onScroll() {
  state.event_horizon = window.pageYOffset;
  clearTimeout(state.scrolling_cb);

  if (state.event_horizon <= 1) {
    state.shield_mode = false;
    store.setShowHeader();
  } else {
    state.shield_mode = true;

    if (state.event_horizon - state.last_scroll >= 0) {
      state.diff_scroll = 0;
      store.setHideHeader();
    } else {
      state.diff_scroll = state.diff_scroll + 1;
      if (state.diff_scroll >= 1) {
        store.setShowHeader();
      }

      state.scrolling_cb = setTimeout(() => {
        state.diff_scroll = 0;
      }, 50);
    }
  }

  state.last_scroll = state.event_horizon;
};

function toggleMenu() {
  if (store.menu_open) {
    store.setMenuClose();
  } else {
    store.setMenuOpen();
  }
}

function checkRoute() {
  if (route.name === 'index') {
    store.setLightMode();
  } else {
    store.setDarkMode();
  }
}

function checkAccessibilityMode() {
  if (localStorage.getItem('OML_ACC')) {
    store.setAccessibilityOn();
  } else {
    store.setAccessibilityOff();
  }
}

function onClickAccessibility() {
  if (store.accessibility) {
    turnAccessibilityOff();
  } else {
    turnAccessibilityOn();
  }
}

function turnAccessibilityOff() {
  localStorage.removeItem('OML_ACC');
  store.setAccessibilityOff();
}

function turnAccessibilityOn() {
  localStorage.setItem('OML_ACC', true);
  store.setAccessibilityOn();
}

function onClickLogo() {
  if (route.name === 'index') {
    smoothScrollTo(0);
  } else {
    if (store.menu_open) {
      store.setPageChangeFromMenu(true);
    }
  }
  store.setMenuClose();
}

function onClickNavItem(id) {
  if (route.name === 'index') {
    smoothScrollTo(document.getElementById(`${id}-section`), () => {
      setTimeout(() => {
        store.setHideHeader();
      }, 27);
    });
  }
}

// Watchers
watch(route, () => {
  store.setMenuClose();
  store.setPageChangeFromMenu(false);
  checkRoute();
});

watch(() => store.loading, (newValue, oldValue) => {
  if (!newValue) {
    setTimeout(() => {
      state.loading_cb = true;
    }, 3021);
  }
});
</script>

<style lang='scss'>
header {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  overflow: hidden;
  z-index: 100;
  transform: translateY(0%);
  transition: transform $speed-666 $evil-ease, color $speed-666 $evil-ease;

  &.--dark-mode:not(.--menu-mode) {
    color: $white;

    &:before {
      background-color: $black;
    }

    .inner {
      .logo {
        &.appear {
          span {
            @include omelet-logo($white);
          }
        }

        &.reset {
          &:before {
            opacity: 0;
          }

          &:after {
            opacity: 1;
          }
        }
      }

      nav#mobile-nav {
        .icon {
          &.--accessibility {
            @include icon-accessibility($white);
            background-size: 16px 16px;
          }
        }

        #menu-btn {
          .lines {
            &:first-child {
              span {
                &:before {
                  background-color: $white;
                }
              }
            }

            &:last-child {
              span {
                &:before {
                  background-color: $white;
                }
              }
            }
          }
        }
      }

      nav#primary-nav {
        .icon {
          &.--contact {
            @include icon-mail($white);
            background-size: 16px 16px;
          }

          &.--accessibility {
            @include icon-accessibility($white);
            background-size: 16px 16px;
          }

          @include respond-to($tablet) {
            &.--contact {
              background-size: 18px 18px;
            }

            &.--accessibility {
              background-size: 18px 18px;
            }
          }
        }
      }
    }
  }

  &.--hidden {
    transform: translateY(-100%);
  }

  &.--shield {
    &:before {
      transform: translateY(0%);
    }
  }

  &.--menu-mode {
    transform: translateY(0%);

    .inner {
      nav#mobile-nav {
        #menu-btn {
          .lines {
            &:first-child {
              span {
                &:before {
                  transform: translateX(-100%);
                  transition: background-color $speed-333 $ease-out, transform $speed-333 $ease-out;
                }
              }

              span:last-child {
                &:before {
                  transition: background-color $speed-333 $ease-out, transform $speed-333 $ease-out calc($speed-333 / 2);
                }
              }
            }

            &:last-child {
              span {
                &:before {
                  transform: translateX(0%);
                  transition: background-color $speed-333 $ease-out, transform $speed-333 $ease-out $speed-333;
                }
              }

              span:last-child {
                &:before {
                  transform: translateY(0%);
                  transition: background-color $speed-333 $ease-out, transform $speed-333 $ease-out calc($speed-333 * 1.5);
                }
              }
            }
          }
        }
      }
    }
  }

  &:before {
    content: '';
    @include abs-fill;
    background-color: $white;
    overflow: hidden;
    transform: translateY(-100%);
    transition: transform $speed-666 $evil-ease, background-color $speed-666 $evil-ease;
  }

  .inner {
    position: relative;
    height: $header-height;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo {
      position: relative;
      width: 104px;
      height: 20px;
      font-size: 0px;
      color: transparent;
      overflow: hidden;
      display: inline-flex;
      flex-shrink: 0;

      &.appear {
        span {
          transform: translate(0, 0);
        }
      }

      &.reset {
        &:before,
        &:after {
          content: '';
          @include abs-fill;
          background-size: 104px 20px;
          background-position: 0px 0px;
          transition: opacity $speed-666 $evil-ease;
        }

        &:before {
          @include omelet-logo($black);
          opacity: 1;
        }

        &:after {
          @include omelet-logo($white);
          opacity: 0;
        }

        span {
          display: none;
        }
      }

      span {
        @include omelet-logo($black);
        background-size: 104px 20px !important;
        transform: translate(0, -100%);

        &:nth-child(1) {
          width: 21px;
          background-position: 0px 0px !important;
          transition: transform $speed-666 1800ms cubic-bezier(0.075, 0.820, 0.165, 1.000), background-image $speed-666 $evil-ease;
        }

        &:nth-child(2) {
          width: 24px;
          background-position: -21px 0px !important;
          transition: transform $speed-666 1911ms cubic-bezier(0.075, 0.820, 0.165, 1.000), background-image $speed-666 $evil-ease;
        }

        &:nth-child(3) {
          width: 14px;
          background-position: -45px 0px !important;
          transition: transform $speed-666 2022ms cubic-bezier(0.075, 0.820, 0.165, 1.000), background-image $speed-666 $evil-ease;
        }

        &:nth-child(4) {
          width: 13px;
          background-position: -59px 0px !important;
          transition: transform $speed-666 2133ms cubic-bezier(0.075, 0.820, 0.165, 1.000), background-image $speed-666 $evil-ease;
        }

        &:nth-child(5) {
          width: 14px;
          background-position: -72px 0px !important;
          transition: transform $speed-666 2244ms cubic-bezier(0.075, 0.820, 0.165, 1.000), background-image $speed-666 $evil-ease;
        }

        &:nth-child(6) {
          width: 18px;
          background-position: -86px 0px !important;
          transition: transform $speed-666 2355ms cubic-bezier(0.075, 0.820, 0.165, 1.000), background-image $speed-666 $evil-ease;
        }
      }
    }

    h1 {
      position: absolute;
      top: 50%;
      left: span(5.5);
      transform: translateY(-50%);
    }

    nav#mobile-nav {
      display: inline-flex;
      align-items: center;
      flex-wrap: nowrap;
      flex-shrink: 0;

      .icon {
        position: relative;
        width: 24px;
        height: 24px;
        margin-right: $space-xs;
        color: transparent;
        white-space: nowrap;
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        cursor: pointer;
        transition: background-image $speed-666 $evil-ease;

        &.--accessibility {
          @include icon-accessibility($black);
          background-size: 16px 16px;
        }
      }

      #menu-btn {
        position: relative;
        width: 24px;
        height: 24px;
        margin-right: -4px;
        color: transparent;
        overflow: hidden;
        cursor: pointer;

        .lines {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 16px;
          height: 16px;
          overflow: hidden;
          pointer-events: none;
          backface-visibility: hidden;
          transform: translateX(-50%) translateY(-50%);

          &:first-child {
            span {
              position: absolute;
              top: 9px;
              left: 0px;
              width: 100%;
              height: 2px;
              overflow: hidden;
              transform: translateX(0%);

              &:before {
                content: '';
                @include abs-fill;
                background-color: $black;
                transform: translateX(0%);
                transition: background-color $speed-333 $ease-out, transform $speed-333 $ease-out calc($speed-333 * 1.5);
              }
            }

            span:last-child {
              top: auto;
              bottom: 9px;

              &:before {
                transition: background-color $speed-333 $ease-out, transform $speed-333 $ease-out $speed-333;
              }
            }
          }

          &:last-child {
            transform: translateX(-50%) translateY(-50%) rotate(45deg);

            span {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 100%;
              height: 2px;
              overflow: hidden;
              transform: translateX(-50%) translateY(-50%);

              &:before {
                content: '';
                @include abs-fill;
                background-color: $black;
                transform: translateX(-100%);
                transition: background-color $speed-333 $ease-out, transform $speed-333 $ease-out calc($speed-333 / 2);
              }
            }

            span:last-child {
              width: 2px;
              height: 100%;

              &:before {
                transform: translateY(-100%);
                transition: background-color $speed-333 $ease-out, transform $speed-333 $ease-out;
              }
            }
          }
        }
      }
    }

    nav#primary-nav {
      display: none;
    }
  }

  .icon {
    &.--accessibility {
      &:after {
        content: '';
        position: absolute;
        top: 0px;
        right: 0px;
        width: 12px;
        height: 12px;
        background-color: $orange;
        border-radius: 50%;
        opacity: 0;
        pointer-events: none;
        @include checkmark($white);
        transform: translateX(50%) translateY(-50%);
        transition: opacity $speed-333 $ease-out;
      }

      &.--enabled {
        &:after {
          opacity: 1;
        }
      }
    }
  }

  @include respond-to($mobile) {
    .inner {
      .logo {
        width: 122px;
        height: 24px;

        &.appear {
          span {
            background-size: 122px 24px !important;

            &:nth-child(1) {
              width: 24px;
              background-position: 0px 0px !important;
            }

            &:nth-child(2) {
              width: 29px;
              background-position: -24px 0px !important;
            }

            &:nth-child(3) {
              width: 16px;
              background-position: -53px 0px !important;
            }

            &:nth-child(4) {
              width: 16px;
              background-position: -69px 0px !important;
            }

            &:nth-child(5) {
              width: 17px;
              background-position: -85px 0px !important;
            }

            &:nth-child(6) {
              width: 20px;
              background-position: -102px 0px !important;
            }
          }
        }

        &.reset {
          &:before,
          &:after {
            background-size: 122px 24px;
          }
        }
      }

      h1 {
        left: span(6);
      }

      nav#mobile-nav {
        .icon {
          margin-right: $space-s;
        }
      }
    }
  }

  @include respond-to($small-tablet) {
    .inner {
      h1 {
        left: span(4.5);
      }
    }
  }

  @include respond-to($tablet) {
    .inner {
      h1 {
        left: span(3);
      }

      nav#mobile-nav {
        display: none;
      }

      nav#primary-nav {
        width: span(7);
        display: inline-flex;
        align-items: center;
        justify-content: space-between;

        .nav-item {
          height: 24px;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
        }

        .icon {
          position: relative;
          width: 24px;
          height: 24px;
          font-size: 0px;
          color: transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-image $speed-666 $evil-ease;

          &.--contact {
            @include icon-mail($black);
            background-size: 18px 18px;
          }

          &.--accessibility {
            @include icon-accessibility($black);
            background-size: 18px 18px;
          }
        }
      }
    }
  }

  @include respond-to($large-tablet) {
    .inner {
      h1 {
        left: span(2.5);
      }

      nav#primary-nav {
        width: span(6);
      }
    }
  }

  @include respond-to($desktop) {
    .inner {
      h1 {
        left: span(2);
      }

      nav#primary-nav {
        width: span(5);
      }
    }
  }

  @include respond-to($retina-macbook) {
    .inner {
      h1 {
        left: span(1.5);
      }
    }
  }
}
</style>
