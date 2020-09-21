<template>
  <nav class="madoc-navbar">
    <ul class="madoc-navbar-list left">
      <li
        v-for="(link, index) in navbar.links"
        :key="index">
        <router-link :to="link.path">
          {{ link.title }}
        </router-link>
      </li>
    </ul>
    <ul class="madoc-navbar-list right">
      <li v-if="navbar.github" class="icon">
				<a :href="navbar.github.link" target='_blank'>
          <eva-icon name="github" animation="pulse" width="30" height="30"></eva-icon>
				</a>
			</li>
      <li class="icon menu" @click="showColorPicker = !showColorPicker">
        <div class="icon-container">
          <eva-icon name="color-palette" animation="pulse" width="30" height="30"></eva-icon>
        </div>
        <ColorPicker v-show="showColorPicker"></ColorPicker>
      </li>
    </ul>
  </nav>
</template>

<script>
import { EvaIcon } from 'vue-eva-icons';
import ColorPicker from '@/components/ColorPicker.vue';
export default {
  name: 'Navbar',
  components: {
    ColorPicker,
    [EvaIcon.name]: EvaIcon
  },
  data () {
    return {
      showColorPicker: false
    };
  },
  computed: {
    page () {
      return this.$store.getters.pages[this.$route.name];
    },
    navbar () {
      return this.page.metadata.navbar;
    }
  }
};
</script>

<style lang="scss" scoped>
nav.madoc-navbar {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--madoc-heading-underline-color);
  > ul.madoc-navbar-list {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;
    height: 50px;
    line-height: 50px;
    &:first-child {
      margin-left: 10px;
    }
    &.right {
      margin-left: auto;
    }
    > li {
      height: 50px;
      &:last-child {
        margin-right: 10px;
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
        &.router-link-exact-active {
          border-bottom: 2px solid var(--madoc-accent);
        }
        > i {
          display: flex;
          align-items: center;
          fill: var(--madoc-navbar-icon-color);
        }
      }
    }
  }
}
</style>
