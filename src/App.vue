<template>
  <div id="app" :theme="theme" :theme-type="themeType">
    <Navbar v-if="navbar"/>
    <div class="madoc-container">
      <Sidebar v-if="sidebar"/>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';
export default {
  name: 'App',
  components: {
    Navbar,
    Sidebar
  },
  data () {
    return {};
  },
  computed: {
    theme () {
      return this.$store.getters.theme;
    },
    themeType () {
      return this.$store.getters.themeType;
    },
    page () {
      return this.$store.getters.pages[this.$route.name];
    },
    navbar () {
      return this.page.metadata.navbar;
    },
    sidebar () {
      return this.page.metadata.sidebar;
    }
  }
};
</script>

<style lang="scss">
html {
  position: fixed;
  height: 100%;
  width: 100%;
  font-family: 'Roboto';
  font-size: 14px;
}
body {
  height: 100%;
  margin: 0;
}
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--madoc-html-background-color);
  color: var(--madoc-html-color);
  > div.madoc-container {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }
}
@import '@/style/variables.scss';
@import '@/style/markdown.scss';
@import '@/style/prism.scss';
</style>
