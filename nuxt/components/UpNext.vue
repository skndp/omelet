<template>
  <section class="up-next-section pad-bl">
    <div class="gutter">
      <NuxtLink class="up-next-cta pad-t pad-b" :to="`/${cta.slug}`">
        <img :src="`/images/next-arrows.png`" :alt="`Next Case Study - ${cta.title}`" />
        <h2 class="pre">{{ cta.title }}</h2>
        <p class="fs-p1">Next</p>
      </NuxtLink>
    </div>
  </section>
</template>
<script setup>
// Props
const props = defineProps({
  cta: {
    type: Object
  }
});
</script>

<style lang='scss'>
.up-next-section {
  position: relative;
  padding-top: span(1);

  .gutter {
    text-align: center;
    display: flex;
    justify-content: center;
  }

  .up-next-cta {
    display: inline-flex;
    flex-direction: column;

    img {
      width: auto;
      height: 40px;
      margin: 0 auto $space-m;
      display: flex;
    }

    h2 {
      width: 100%;
      max-width: 900px;
      margin: 0 auto $space-m;
    }
  }

  @include respond-to($tablet) {
    .up-next-cta {
      img {
        height: 50px;
      }

      h2 {
        margin: 0 auto $space-l;
      }
    }
  }

  @include respond-to($large-tablet) {
    .up-next-cta {
      img {
        height: 60px;
      }
    }
  }

  @include respond-to($average-desktop) {
    padding-top: span(0.5);

    .up-next-cta {
      img {
        height: 66px;
      }
    }
  }
}
</style>
