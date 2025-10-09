<template>
  <div id="mobile-menu" :class="{'--menu-mode': store.menu_open}">
    <div id="mobile-menu-inner">
      <div id="mobile-menu-mask">
        <div id="mobile-menu-content" ref="contentRef">
          <ul class="menu-nav gutter">
            <li v-for="item in site_nav">
              <NuxtLink class="nav-item nav-a1 --alt" :to="`/?${item.id}`" @click.native="onClickNavItem(item.id)">{{ item.label }}</NuxtLink>
            </li>
          </ul>
          <div class="smiley gutter" />
          <div class="menu-footer">
            <ul>
              <li v-for="link in social_links">
                <NuxtLink class="icon" :to="link.url" target="_blank" :aria-label="link.label" />
              </li>
            </ul>
            <ul>
              <li>
                <NuxtLink class="icon --contact" to="/?contact" @click.native="onClickNavItem('contact')" aria-label="Contact" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSiteStore } from '~/stores/store';
import { smoothScrollTo } from '~/utils/smooth-scroll-to';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

const route = useRoute();
const store = useSiteStore();
const contentRef = ref(null);

const site_nav = [
  { id: 'work', label: 'Work' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'leadership', label: 'Leadership' }
]

const siteQuery = groq`*[(_type == "site")][0]{
  linkedin,
  instagram
}`

// Async data
const uniqKey = 'site-menu';
const { data } = await useAsyncData(uniqKey, () => useSanity().fetch(siteQuery));
const site = data.value;
const social_links = ref([]);

// Mounted
onMounted(() => {
  if (contentRef.value) {
    disableBodyScroll(contentRef.value);
  }

  // Build social links based on fields with values...  
  let arr = [];
  if (site.linkedin) {
    arr.push({ 'label': 'Visit our LinkedIn profile', 'url': site.linkedin });
  }
  if (site.instagram) {
    arr.push({ 'label': 'Visit our Instagram account', 'url': site.instagram });
  }

  if (arr.length > 0) {
    social_links.value = arr;
  }
});

// Before Unmount
onBeforeUnmount(() => {
  if (contentRef.value) {
    enableBodyScroll(contentRef.value);
  }
});

// Methods
function onClickNavItem(id) {
  store.setPageChangeFromMenu(true);
  store.setMenuClose();
  if (route.name === 'index') {
    smoothScrollTo(document.getElementById(`${id}-section`), () => {
      setTimeout(() => {
        store.setHideHeader();
      }, 27);
    });
  }
}
</script>

<style lang='scss'>
#mobile-menu {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 50;

  &.menu-enter-active,
  &.menu-leave-active {
    transition: opacity $speed-666 $evil-ease;

    #mobile-menu-inner,
    #mobile-menu-mask {
      transition: transform $speed-666 $evil-ease;
    }
  }

  &.menu-enter-from,
  &.menu-leave-to {
    opacity: 0.999;

    #mobile-menu-inner {
      transform: translateY(-100%);
    }

    #mobile-menu-mask {
      transform: translateY(100%);
    }
  }

  #mobile-menu-inner {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: $white;
    overflow: hidden;
  }

  #mobile-menu-mask {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  #mobile-menu-content {
    position: absolute;
    top: $header-height;
    left: 0px;
    right: 0px;
    bottom: 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    ul.menu-nav {
      padding: $space-s 0 span(1.5);

      li {
        .nav-item {
          padding: $space-s 0;
          display: inline-flex;
          cursor: pointer;
        }
      }
    }

    .smiley {
      display: none;

      @include respond-to($portrait) {
        min-height: 200px;
        margin-top: auto;
        margin-bottom: auto;
        @include shape-smiley($green);
        display: flex;
        flex: 1 0 auto;
      }
    }

    .menu-footer {
      padding: span(1.5) $space-s $space-s;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      @include respond-to($portrait) {
        padding: span(1.5) span(1) span(1);
      }

      ul {
        margin: 0 -14px;
        display: inline-flex;
        flex-wrap: nowrap;
        align-items: center;

        li {
          margin: 0 14px;
          display: inline-flex;
          align-items: center;

          .icon {
            width: 18px;
            height: 18px;
            color: transparent;
            white-space: nowrap;
            overflow: hidden;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-image $speed-666 $evil-ease;

            &.--contact {
              @include icon-mail($black);
            }

            &[href*="linkedin"] {
              @include linkedin($black);
            }

            &[href*="instagram"] {
              @include instagram($black);
            }
          }
        }
      }
    }
  }
}
</style>
