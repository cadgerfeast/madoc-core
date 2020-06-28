<script>
	import { stores } from '@sapper/app';
  const { page } = stores();
  export let links;

  function computedStyle (link) {
    return `margin-left: ${link.tab ? link.tab : 0}em`;
  }
</script>

<style lang="scss" scoped>
	nav {
    min-width: 250px;
    border-right: 1px solid var(--madoc-heading-underline-color);
    transition: border .25s ease-out;
    ul {
      margin: 0;
      padding: 1em;
      list-style: none;
      li {
        border-top: 1px solid var(--madoc-heading-underline-color);
        border-left: 1px solid var(--madoc-heading-underline-color);
        border-right: 1px solid var(--madoc-heading-underline-color);
        margin-left: 1px;
        cursor: pointer;
        &:hover , &.selected {
          border-left: 2px solid var(--madoc-accent);
          margin-left: 0;
        }
        &:last-child {
          border-bottom: 1px solid var(--madoc-heading-underline-color)
        }
        a {
          display: block;
          padding: 1em;
          color: inherit;
          text-decoration: none;
        }
      }
    }
  }
</style>

{#if links}
  <nav>
    <ul>
      {#each links as link}
        <li class:selected='{$page.path === link.path}'><a rel=prefetch href={link.path} style={computedStyle(link)}>{link.title}</a></li>
      {/each}
    </ul>
  </nav>
{/if}
