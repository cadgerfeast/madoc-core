<template>
  <nav class="madoc-sidebar">
    <template v-for="(group, index) in groups">
      <span class="madoc-sidebar-title" v-if="group.name" :key="`title-${index}`">{{ group.name }}</span>
      <ul class="madoc-sidebar-list" :key="`list-${index}`">
        <li
          class="madoc-sidebar-list-item"
          v-for="link in group"
          :key="link.title">
          <router-link :to="link.path">
            {{ link.title }}
          </router-link>
        </li>
      </ul>
    </template>
  </nav>
</template>

<script>
export default {
  name: 'Sidebar',
  data () {
    return {};
  },
  computed: {
    page () {
      return this.$store.getters.pages[this.$route.name];
    },
    groups () {
      const groups = {};
      let group = 0;
      for (const link of this.page.metadata.sidebar.links) {
        if (link.group) {
          group++;
          groups[group] = groups[group] || [];
          groups[group].name = link.group;
          groups[group].push(...link.links);
          group++;
        } else {
          groups[group] = groups[group] || [];
          groups[group].push(link);
        }
      }
      return groups;
    }
  }
};
</script>

<style lang="scss" scoped>
nav.madoc-sidebar {
  min-width: 250px;
  border-right: 1px solid var(--madoc-heading-underline-color);
  > span.madoc-sidebar-title {
    display: block;
    font-weight: bold;
    padding: 0 1em;
  }
  > ul.madoc-sidebar-list {
    margin: 0;
    padding: 0 1em;
    list-style: none;
    &:first-child {
      padding-top: 1em;
    }
    &:not(:last-child) {
      padding-bottom: 1em;
    }
    > li.madoc-sidebar-list-item {
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
