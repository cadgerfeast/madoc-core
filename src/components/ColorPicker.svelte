<script>
import { theme } from '../store/theme';
import { themes } from '../store/theme';
export let active;

function setTheme (value) {
  theme.set(value);
}
</script>

<style lang="scss" scoped>
  div.color-picker {
    display: none;
    position: absolute;
    z-index: 1;
    right: 0;
    background-color: var(--madoc-html-background-color);
    border: 1px solid var(--madoc-heading-underline-color);
    border-right: none;
    &.active {
      display: block;
    }
    > ul.theme-list {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      > li.theme-item {
        border-radius: 50%;
        height: 35px;
        width: 35px;
        background: linear-gradient(90deg, var(--madoc-display-left) 50%, var(--madoc-display-right) 50%);
        margin: 5px;
        border: 2px solid var(--madoc-display-border);
        &.active {
          border: 2px dashed var(--madoc-display-border);
        }
      }
    }
  }
</style>

<div class="color-picker" class:active={active}>
  <ul class='theme-list'>
    {#each Object.keys($themes) as key}
      <li class='theme-item' class:active={$theme === key} theme={key} title={$themes[key]} on:click={() => { setTheme(key) }}></li>
    {/each}
  </ul>
</div>
