import { defineStore } from 'pinia';

export const useSiteStore = defineStore('site', {
  state: () => ({
    accessibility: false,
    loading: true,
    page_mask: false,
    page_mask_name: 'slide-left',
    page_change_from_menu: false,
    hide_header: false,
    menu_open: false,
    dark_mode: false,
    preview_is_active: false,
    siteName: '',
    siteTitle: '',
    siteDescription: '',
    ogImage: '',
    ogUrl: ''
  }),
  actions: {
    setAccessibilityOff() {
      this.accessibility = false;
    },
    setAccessibilityOn() {
      this.accessibility = true;
    },
    setLoaderComplete() {
      this.loading = false;
    },
    setPageMask(val) {
      this.page_mask = val;
    },
    setPageMaskName(val) {
      this.page_mask_name = val;
    },
    setPageChangeFromMenu(val) {
      this.page_change_from_menu = val;
    },
    setHideHeader() {
      this.hide_header = true;
    },
    setShowHeader() {
      this.hide_header = false;
    },
    setMenuOpen() {
      this.menu_open = true;
    },
    setMenuClose() {
      this.menu_open = false;
    },
    setDarkMode() {
      this.dark_mode = true;
    },
    setLightMode() {
      this.dark_mode = false;
    },
    setGlobalSeo(settings) {
      this.siteName = settings.siteName;
      this.siteTitle = settings.siteName;
      this.siteDescription = settings.seoSocial.description;
      this.ogImage = settings.seoSocial.image;
      this.ogUrl = 'https://www.omelet.com';
    }
  }
})
