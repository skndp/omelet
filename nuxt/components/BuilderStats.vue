<template>
  <section class="builder-stats pad-bl">
    <div class="cols gutter">
      <div v-for="(item, index) in stats" class="col">
        <p class="stat">{{ item.title }}</p>
        <RichTextContent :content="item.copy" />
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  stats: {
    type: Array
  }
});
</script>

<style lang='scss'>
.builder-stats {
  .cols {
    .col {
      text-align: center;

      p {
        margin: 0 $space-s;
      }

      p:last-child {
        padding-top: $space-s;
        line-height: 1.1em;
      }

      &:not(:last-child) {
        margin-bottom: span(2);
      }
    }
  }

  @include respond-to($tablet) {
    .gutter {
      margin: 0 span(1);
    }

    .cols {
      display: flex;
      justify-content: center;

      .col {
        width: 33.333%;

        &:not(:last-child) {
          margin-bottom: 0px;
        }
      }
    }
  }

  @include respond-to($large-tablet) {
    .gutter {
      margin: 0 span(1);
    }
  }

  @include respond-to($desktop) {
    .gutter {
      margin: 0 span(2);
    }
  }

  @include respond-to($retina-macbook) {
    .gutter {
      margin: 0 span(2.5);
    }
  }
}
</style>
