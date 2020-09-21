<template>
  <nav class="madoc-sidebar">
    <ul class="madoc-sidebar-list">
      <li
        v-for="(link, index) in sidebar.links"
        :key="index">
        <router-link :to="link.path">
          {{ link.title }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data () {
    return {};
  },
  computed: {
    page () {
      return this.$store.getters.pages[this.$route.name];
    },
    sidebar () {
      return this.page.metadata.sidebar;
    }
  }
};
</script>

<style lang="scss" scoped>
nav.madoc-sidebar {
  min-width: 250px;
  border-right: 1px solid var(--madoc-heading-underline-color);
  > ul.madoc-sidebar-list {
    margin: 0;
    padding: 1em;
    list-style: none;
    > li {
      border-left: 1px solid var(--madoc-heading-underline-color);
      &:last-child {
        border-bottom: 1px solid var(--madoc-heading-underline-color);
      }
      > a {
        border-top: 1px solid var(--madoc-heading-underline-color);
        border-left: 2px solid transparent;
        border-right: 1px solid var(--madoc-heading-underline-color);
        display: block;
        padding: 1em;
        color: inherit;
        text-decoration: none;
        &.router-link-exact-active {
          border-left: 2px solid var(--madoc-accent);
        }
      }
    }
  }
}
</style>
