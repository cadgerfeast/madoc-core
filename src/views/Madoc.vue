<template>
  <div class="madoc-page" :class="{ 'full': page.vue }">
    <template v-if="page.vue">
      <component v-bind:is="page.vue.type" :context="page.vue.context"></component>
    </template>
    <VRuntimeTemplate v-else :template="page.html"></VRuntimeTemplate>
  </div>
</template>

<script>
import VRuntimeTemplate from 'v-runtime-template';
export default {
  name: 'Madoc',
  components: {
    VRuntimeTemplate
  },
  data () {
    return {};
  },
  computed: {
    page () {
      return this.$store.getters.pages[this.$route.name];
    }
  },
  methods: {
    getContext (tag, instance = 0) {
      return this.$store.getters.config.components.find((c) => c.tag === tag).context[instance];
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
