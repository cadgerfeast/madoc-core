<script context="module">
	export async function preload({ path }) {
		const res = await this.fetch('index.json', {
			headers: {
				'x-madoc-path': path
			}
		});
		const data = await res.json();
		if (res.status === 200) {
			return { page: data };
		} else {
			this.error(res.status, data.message);
		}
	}
</script>

<script>
	import { afterUpdate, onMount } from 'svelte';
	import { storePage } from './_store.js';
	import { goTo, frame } from '../utils.js';
	export let page;

	let lastPage;
	let theme;
	let themes;
	let customComponents = [];
	let rootElement;
	let wrapperElement;
	let sectionElement;

	$: pageClass = page.class ? `content ${page.class.join(' ')}` : 'content';

	afterUpdate(async () => {
		storePage.set(page);
		if (lastPage !== page.title) {
			rootElement.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
			customComponents = (await import('custom-madoc-components')).default;
		}
		lastPage = page.title;
	});
	onMount(async () => {
		theme = (await import('../store/theme')).theme;
		themes = (await import('../store/theme')).themes;
		customComponents = (await import('custom-madoc-components')).default;
	});
</script>

<style lang="scss" scoped>
	div.content {
		display: flex;
		flex-direction: column;
		width: 100%;
		background-color: var(--madoc-html-background-color);
		color: var(--madoc-html-color);
		padding: 50px 0;
		overflow-x: auto;
		> div.section-wrapper {
			padding-bottom: 50px;
			> div.section-container {
				display: flex;
				flex-direction: column;
				min-height: 100%;
				> section {
					&.md {
						max-width: 60%;
						min-width: 800px;
						margin: 0 auto;
						padding: 0 50px;
					}
					&:only-child {
						position: relative;
						flex-grow: 1;
					}
				}
			}
		}
	}
	footer.sitemap {
		display: none;
	}
</style>

<svelte:head>
	<title>{page.title}</title>
</svelte:head>

<div bind:this={rootElement} class={pageClass}>
	<div bind:this={wrapperElement} class="section-wrapper">
		<div bind:this={sectionElement} class="section-container">
			{#each page.sections as section}
				{#if section.type === 'md'}
					<section class='md'>{@html section.content}</section>
				{:else}
					{#each customComponents as component}
						{#if section.type === component.tag}
							{#await component.getElement() then el}
								<section><svelte:component this={el.default} theme={theme} themes={themes} context={section.content}/></section>
							{/await}
						{/if}
					{/each}
				{/if}
			{/each}
		</div>
	</div>
</div>
<!-- Dummy Sitemap -->
<footer class="sitemap"><a href="/sitemap">Sitemap</a></footer>
