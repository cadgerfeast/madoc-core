<script context="module">  
	export async function preload() {
    const res = await this.fetch('sitemap.json');
    const data = await res.json();
    if (res.status === 200) {
      return { sitemap: data };
    } else {
      this.error(res.status, data.message);
    }
  };
</script>

<script>
  export let sitemap = [];
</script>

<svelte:head>
	<title>Sitemap</title>
</svelte:head>

<section class='map'>
  {#each sitemap as href}
    <a {href}>{href}</a>
  {/each}
</section>
