<template>
  <nav class="madoc-sidebar">
    <div class="madoc-sidebar-app-title" v-if="sidebar.title">
      <div class="madoc-sidebar-app-title-left">
        <span>{{ sidebar.title }}</span>
      </div>
      <div class="madoc-sidebar-app-title-right">
        <ul>
          <li v-if="sidebar.github" class="icon">
            <a :href="sidebar.github.link" target='_blank'>
              <eva-icon name="github" animation="pulse" width="25" height="25"></eva-icon>
            </a>
          </li>
          <li v-if="showThemePicker" class="theme icon menu" @click="showColorPicker = !showColorPicker">
            <div class="icon-container">
              <eva-icon name="color-palette" animation="pulse" width="25" height="25"></eva-icon>
            </div>
            <div class="theme-wrapper">
              <ColorPicker v-show="showColorPicker" left></ColorPicker>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <template v-for="(group, index) in groups">
      <div v-if="group.name" :key="`title-${index}`" @click="toggle(group)" class="madoc-sidebar-title" :class="{ collapsable: group.collapsable, collapsed: !group.expanded }">
        <div class="madoc-sidebar-title-left">
          <span>{{ group.name }}</span>
        </div>
        <div class="madoc-sidebar-title-right">
          <span :class="{ hidden: !group.collapsable }"><eva-icon name="chevron-down" width="24" height="24"></eva-icon></span>
        </div>
      </div>
      <ul v-show="group.expanded" :class="`madoc-sidebar-list pad-${group.padding}`" :key="`list-${index}`">
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
import ColorPicker from '@/components/ColorPicker.vue';
export default {
  name: 'Sidebar',
  components: {
    ColorPicker
  },
  data () {
    return {
      showColorPicker: false,
      groups: {}
    };
  },
  watch: {
    page () {
      this.groups = this.setGroups();
    }
  },
  computed: {
    showThemePicker () {
      return (this.sidebar['theme-picker'] !== undefined) ? this.sidebar['theme-picker'] : true;
    },
    page () {
      return this.$store.getters.pages[this.$route.name];
    },
    sidebar () {
      return this.page.metadata.sidebar;
    }
  },
  methods: {
    setGroups () {
      const groups = {};
      let group = 0;
      for (const link of this.sidebar.links) {
        if (link.group) {
          group++;
          groups[group] = groups[group] || [];
          groups[group].name = link.group;
          groups[group].collapsable = link.collapsable ? link.collapsable : true;
          groups[group].expanded = link.expanded ? link.expanded : true;
          groups[group].padding = 2;
          groups[group].push(...link.links);
          group++;
        } else {
          groups[group] = groups[group] || [];
          groups[group].expanded = true;
          groups[group].padding = 1;
          groups[group].push(link);
        }
      }
      return groups;
    },
    toggle (group) {
      if (group.collapsable) {
        group.expanded = !group.expanded;
        this.groups = { ...this.groups };
      }
    }
  },
  created () {
    this.groups = this.setGroups();
  }
};
</script>

<style lang="scss" scoped>
nav.madoc-sidebar {
  padding: 20px 0;
  min-width: 250px;
  border-right: 1px solid var(--madoc-heading-underline-color);
  > div.madoc-sidebar-app-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 1em;
    > div.madoc-sidebar-app-title-left {
      margin-left: 1em;
      > span {
        font-size: 40px;
        font-weight: bold;
      }
    }
    > div.madoc-sidebar-app-title-right {
      margin: auto 0 auto auto;
      > ul {
        display: flex;
        align-items: center;
        margin: 0;
        padding: 0;
        list-style: none;
        > li {
          height: 50px;
          &.theme {
            position: relative;
            padding-right: 1em;
            > div.theme-wrapper {
              position: absolute;
              top: 0;
              right: 0;
            }
          }
          &.menu {
            cursor: pointer;
            user-select: none;
            > div.icon-container {
              height: 100%;
              display: flex;
              align-items: center;
              > i {
                display: flex;
                align-items: center;
                fill: var(--madoc-navbar-icon-color);
              }
            }
          }
          > a {
            height: 50px;
            color: inherit;
            text-decoration: none;
            display: flex;
            align-items: center;
            padding: 0 1em;
            > i {
              display: flex;
              align-items: center;
              fill: var(--madoc-navbar-icon-color);
            }
          }
        }
      }
    }
  }
  > div.madoc-sidebar-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    &.collapsable {
      cursor: pointer;
    }
    &.collapsed {
      > div.madoc-sidebar-title-right {
        > span {
          > i {
            transform: rotate(180deg);
          }
        }
      }
    }
    > div.madoc-sidebar-title-left {
      margin-left: 1em;
    }
    > div.madoc-sidebar-title-right {
      margin-left: auto;
      > span {
        margin-right: 8px;
        &.hidden {
          visibility: hidden;
        }
        > i {
          fill: var(--madoc-navbar-icon-color);
        }
      }
    }
  }
  > ul.madoc-sidebar-list {
    margin: 0;
    padding: 0;
    list-style: none;
    &.pad-1 {
      > li.madoc-sidebar-list-item {
        > a {
          padding: 6px 0 6px 1em;
        }
      }
    }
    &.pad-2 {
      > li.madoc-sidebar-list-item {
        > a {
          padding: 6px 0 6px 3em;
        }
      }
    }
    > li.madoc-sidebar-list-item {
      box-sizing: border-box;
      > a {
        display: block;
        color: inherit;
        text-decoration: none;
        &:hover {
          background-color: var(--madoc-html-background-hover-color);
        }
        &.router-link-exact-active {
          background-color: var(--madoc-html-background-active-color);
        }
      }
    }
  }
}
</style>
