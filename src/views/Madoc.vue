<template>
  <div class="madoc-page" :class="{ 'full': page.vue }">
    <template v-if="page.vue">
      <component v-bind:is="page.vue.type" :context="page.vue.context"></component>
    </template>
    <VRuntimeTemplate v-else :class="{ 'madoc-section': !page.metadata.tabs }" :style="{ 'width': pageWidth }" :template="page.html"></VRuntimeTemplate>
    <template v-if="page.metadata.tabs">
      <ul class="madoc-tabs">
        <li v-for="tab of page.metadata.tabs" :key="tab.title"><router-link :to="`#${tab.title}`">{{ tab.title }}</router-link></li>
      </ul>
      <VRuntimeTemplate class="madoc-section" :style="{ 'width': activeTabWidth }" :template="activeTabContent"></VRuntimeTemplate>
    </template>
  </div>
</template>

<script>
import VRuntimeTemplate from 'v-runtime-template';
export default {
  name: 'Madoc',
  components: {
    VRuntimeTemplate
  },
  watch: {
    page () {
      this.setActiveTab();
    }
  },
  computed: {
    pageWidth () {
      if (this.page.metadata.width) {
        return this.page.metadata.width;
      } else {
        return '60%';
      }
    },
    page () {
      return this.$store.getters.pages[this.$route.name];
    },
    activeTab () {
      return this.page.metadata.tabs.find((tab) => `#${tab.title}` === this.$route.hash);
    },
    activeTabWidth () {
      if (this.activeTab.metadata && this.activeTab.metadata.width) {
        return this.activeTab.metadata.width;
      } else {
        return '60%';
      }
    },
    activeTabContent () {
      return this.activeTab.content;
    }
  },
  methods: {
    getContext (tag, instance = 0) {
      return this.$store.getters.config.components.find((c) => c.tag === tag).context[instance];
    },
    setActiveTab () {
      if (this.page.metadata.tabs && !this.activeTab) {
        this.$router.push(`#${this.page.metadata.tabs[0].title}`);
      }
    }
  },
  created () {
    this.setActiveTab();
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
    min-width: 800px;
    margin: 0 auto;
  }
  > ul.madoc-tabs {
    display: flex;
    align-items: center;
    margin: 0 0 3em 0;
    padding: 0;
    list-style: none;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid var(--madoc-heading-underline-color);
    > li {
      height: 50px;
      > a {
        height: 50px;
        color: inherit;
        text-decoration: none;
        display: flex;
        align-items: center;
        padding: 0 1em;
        &.router-link-exact-active {
          font-weight: bold;
          border-bottom: 2px solid var(--madoc-accent);
        }
      }
    }
  }
}
</style>
