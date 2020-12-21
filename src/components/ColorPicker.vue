<template>
  <div class="madoc-color-picker" :class="{ left, right }">
    <ul class="madoc-theme-list">
      <li
        v-for="(theme, key) in themes"
        :key="key"
        :theme="key"
        :title="theme.name"
        class="madoc-theme-item"
        :class="{ 'active': (activeTheme === key) }"
        @click="setTheme(key)">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ColorPicker',
  props: {
    right: {
      type: Boolean,
      default: false
    },
    left: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    activeTheme () {
      return this.$store.getters.theme;
    },
    themes () {
      return this.$store.getters.themes;
    }
  },
  methods: {
    setTheme (theme) {
      this.$store.commit('theme', theme);
    }
  }
};
</script>

<style lang="scss" scoped>
div.madoc-color-picker {
  position: absolute;
  z-index: 1;
  background-color: var(--madoc-html-background-color);
  border: 1px solid var(--madoc-heading-underline-color);
  &.left {
    left: 0;
  }
  &.right {
    right: 0;
    border-right: none;
  }
  > ul.madoc-theme-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(6, 0fr);
    > li.madoc-theme-item {
      border-radius: 50%;
      height: 35px;
      width: 35px;
      background: linear-gradient(90deg, var(--madoc-display-left) 50%, var(--madoc-display-right) 50%);
      margin: 5px;
      border: 2px solid var(--madoc-display-border);
      &.active {
        border-style: dashed;
      }
    }
  }
}
</style>
