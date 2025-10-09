<template>
  <footer>
    <div class="directory">
      <div class="shape">
        <div class="inner">
          <div class="content">
            <img inert :src="`/images/contact-shape.svg`" :alt="site.handwriting" />
            <p class="fs-t2 pre" v-html="formatLines" />
          </div>
        </div>
      </div>
      <div id="contact-section" class="contact-info">
        <h4>{{ site.footerTitle }}</h4>
        <div class="cols">
          <div class="col">
            <div class="email-block">
              <p class="fs-p4">{{ site.generalLabel }}</p>
              <div class="row">
                <NuxtLink class="fs-p2 underline" :to="`mailto:${site.generalEmail}`" target="_blank">{{ site.generalEmail }}</NuxtLink>
                <NuxtLink v-if="social_links[0]" class="icon" :to="social_links[0].url" target="_blank" :aria-label="social_links[0].label" />
              </div>
            </div>
            <div class="email-block">
              <p class="fs-p4">{{ site.businessLabel }}</p>
              <div class="row">
                <NuxtLink class="fs-p2 underline" :to="`mailto:${site.businessEmail}`" target="_blank">{{ site.businessEmail }}</NuxtLink>
                <NuxtLink v-if="social_links[1]" class="icon" :to="social_links[1].url" target="_blank" :aria-label="social_links[1].label" />
              </div>
            </div>
            <NuxtLink v-if="social_links[0]" class="col-icon" :to="social_links[0].url" target="_blank" :aria-label="social_links[0].label" />
          </div>
          <div class="col">
            <div class="block">
              <NuxtLink class="pre" :to="`${site.addressLink}`" target="_blank">{{ site.address }}</NuxtLink>
            </div>
            <div class="block">
              <NuxtLink class="underline" :to="`tel:${site.phoneNumber}`" target="_blank">{{ site.phoneNumber }}</NuxtLink>
            </div>
            <NuxtLink v-if="social_links[1]" class="col-icon" :to="social_links[1].url" target="_blank" :aria-label="social_links[1].label" />
          </div>
        </div>
      </div>
    </div>
    <div class="gutter">
      <NuxtLink class="logo" to="/" @click.native="onClickLogo">Omelet</NuxtLink>
      <ul class="legals nav-a2">
        <li><span class="tm r" />,&nbsp;<span class="tm c" />,&nbsp;Omelet, LLC. All rights reserved.</li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
import { smoothScrollTo } from '~/utils/smooth-scroll-to';

const route = useRoute();

const siteQuery = groq`*[(_type == "site")][0]{
  footerTitle,
  generalLabel,
  businessLabel,
  handwriting,
  generalEmail,
  businessEmail,
  address,
  addressLink,
  phoneNumber,
  linkedin,
  instagram
}`

// Async data
const uniqKey = 'site-footer';
const { data } = await useAsyncData(uniqKey, () => useSanity().fetch(siteQuery));
const site = data.value;
const social_links = ref([]);

// Computed
const formatLines = computed(() => {
  let html = '';

  if (site.handwriting) {
    const lines = site.handwriting.split('\n');
    lines.forEach((line, index) => {
      html += `<span>${line}</span>`;
    });
  }

  return html;
});

// Mounted
onMounted(() => {
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
})

// Methods
function onClickLogo() {
  if (route.name === 'index') {
    smoothScrollTo(0);
  }
}
</script>

<style lang='scss'>
footer {
  width: 100%;
  overflow: hidden;

  .directory {
    margin: 0px 0px $space-l span(2);

    .shape {
      margin: 0px $space-s $space-s;
      display: flex;

      .inner {
        position: relative;
        width: 100%;
        max-width: 350px;
        margin-left: auto;

        .content {
          position: relative;
          width: 64%;
          margin-left: auto;

          img {
            width: 100%;
            display: flex;
          }

          p {
            position: absolute;
            top: 50%;
            left: 50%;
            color: $gold;
            text-align: center;
            display: flex;
            flex-direction: column;
            transform: rotate(1deg) translateX(-50%) translateY(-50%);

            span {
              white-space: nowrap;
              display: flex;
            }
          }
        }
      }
    }

    h4 {
      margin-bottom: $space-m;
    }

    .cols {
      .col {
        display: flex;
        flex-direction: column;

        a {
          margin-bottom: $space-m;
          display: inline-flex;
        }

        .email-block {
          a {
            text-decoration: underline;
          }

          > p.fs-p4 {
            line-height: 16px;
          }

          .row {
            display: flex;
            align-items: center;

            a.underline {
              width: calc(#{span(10.5)} - 18px);

              @include respond-to($small-tablet) {
                width: span(6);
              }
            }

            .icon {
              width: 20px;
              height: 20px;
              color: transparent;
              white-space: nowrap;
              overflow: hidden;
              display: inline-flex;
              align-items: center;
              justify-content: center;

              &[href*="linkedin"] {
                @include linkedin($black);
              }

              &[href*="instagram"] {
                @include instagram($black);
              }
            }
          }
        }

        .col-icon {
          display: none;
        }
      }
    }
  }

  .gutter {
    .logo {
      width: 100%;
      aspect-ratio: 720/140;
      font-size: 0px;
      color: transparent;
      overflow: hidden;
      @include omelet-logo($black);
      background-position: 0% 50%;
      background-size: contain;
      display: flex;
      flex-shrink: 0;
    }

    .legals {
      width: 100%;
      padding: $space-s 0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      li {
        display: inline-flex;
        align-items: center;

        span.tm {
          width: 8px;
          height: 8px;
          display: inline-flex;

          &.r {
            @include registered($black);
          }

          &.c {
            @include copyright($black);
          }
        }
      }
    }
  }

  @include respond-to($tablet) {
    .directory {
      margin: 0px span(0.5) $space-xl span(2);

      .shape {
        .inner {
          .content {
            width: 80%;
          }
        }
      }

      .cols {
        .col {
          display: flex;
          flex-direction: row;

          a {
            margin-bottom: 0px;
          }

          .email-block {
            width: span(4.5);
            margin-bottom: $space-l;

            > p.fs-p4 {
              line-height: 24px;
            }

            .row {
              display: flex;
              align-items: center;

              a.underline {
                width: auto;
              }

              .icon {
                display: none;
              }
            }
          }

          .block {
            width: span(4.5);
            margin-bottom: $space-m;
          }

          .col-icon {
            width: 20px;
            height: 20px;
            font-size: 0px;
            color: transparent;
            white-space: nowrap;
            overflow: hidden;
            display: inline-flex;
            align-items: center;
            justify-content: center;

            &[href*="linkedin"] {
              margin-top: 24px;
              @include linkedin($black);
            }

            &[href*="instagram"] {
              @include instagram($black);
            }
          }
        }
      }
    }

    .gutter {
      .legals {
        margin: 0 (-$space-m);
        justify-content: flex-start;

        li {
          &:nth-child(1) {
            margin-left: span(2);
            width: span(4);
          }

          &:nth-child(2) {
            width: span(4);
          }

          &:nth-child(3) {
            width: auto;
          }
        }
      }
    }
  }

  @include respond-to($large-tablet) {
    .directory {
      margin: 0px 0px $space-s span(2);
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;

      .shape {
        order: 2;
        width: span(3.5);
        margin: 0 span(0.5) 0 0;

        .inner {
          max-width: 400px;

          .content {
            width: 100%;
          }
        }
      }

      .contact-info {
        order: 1;
        margin-top: auto;
      }

      h4 {
        margin-bottom: $space-l;
      }

      .cols {
        .col {
          .email-block {
            width: span(3.5);
            margin-bottom: $space-xl;
          }

          .block {
            width: span(3.5);
            padding-bottom: $space-xl;
            margin-bottom: $space-xl;
          }
        }
      }
    }

    .gutter {
      .legals {
        margin: 0 (-$space-l);

        li {
          &:nth-child(1) {
            width: span(3.5);
          }

          &:nth-child(2) {
            width: span(3.5);
          }
        }
      }
    }
  }

  @include respond-to($average-desktop) {
    .directory {
      margin: 0px 0px $space-xl span(3);

      .shape {
        width: span(4);
      }

      .cols {
        .col {
          .email-block {
            width: span(2.5);
          }

          .block {
            width: span(2.5);
          }
        }
      }
    }

    .gutter {
      .legals {
        li {
          &:nth-child(1) {
            margin-left: span(3);
            width: span(2.5);
          }

          &:nth-child(2) {
            width: span(2.5);
          }
        }
      }
    }
  }

  @include respond-to($macbook) {
    .directory {
      .shape {
        width: span(4.5);
        margin: 0 span(1) 0 0;
      }
    }
  }
}
</style>
