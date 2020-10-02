<template>
  <div class="madoc-page" :class="{ 'full': page.vue }">
    <template v-if="page.vue">
      <component v-bind:is="page.vue.type" :context="page.vue.context"></component>
    </template>
    <template v-else v-for="(section, index) in page.sections">
      <div v-if="section.type === 'md'" :key="index" class="madoc-section"  v-html="section.content"></div>
      <div v-else :key="index" class="madoc-section">
        <component v-bind:is="section.type" :context="section.content"></component>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Madoc',
  data () {
    return {};
  },
  computed: {
    page () {
      return this.$store.getters.pages[this.$route.name];
    }
  }
};
</script>

<style lang="scss" scoped>
div.madoc-page {
  flex-grow: 1;
  overflow: auto;
  &:not(.full) {
    padding: 50px;
  }
  > div.madoc-section {
    max-width: 60%;
    min-width: 800px;
    margin: 0 auto;
  }
}
</style>
