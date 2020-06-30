<script context="module">
	export async function preload() {
		const res = await this.fetch('_config.json');
		const data = await res.json();
		if (res.status === 200) {
			return {
				config: data.config,
				navbar: data.navbar,
				sidebar: data.sidebar
			};
		} else {
			this.error(res.status, data.message);
		}
	}
</script>

<script>
	import { stores } from '@sapper/app';
	import { onMount } from 'svelte';
	import { storePage } from './_store.js';
	import { dummy } from '../utils.js';

	const { page } = stores();

	let theme, themes, Navbar, Sidebar;
	onMount(async () => {
		theme = (await import('../store/theme')).theme;
		themes = (await import('../store/theme')).themes;
		Navbar = (await import('../components/Navbar.svelte')).default;
		Sidebar = (await import('../components/Sidebar.svelte')).default;
		theme.subscribe((value) => {
			document.getElementsByTagName('html')[0].setAttribute('theme', value);
			document.getElementsByTagName('html')[0].setAttribute('theme-type', $themes[value].type);
		});
	});

	export let config;
	export let navbar;
	export let sidebar;
	export let segment;
	dummy(segment);

	let sidebarLinks = sidebar && sidebar.links;
	storePage.subscribe((_page) => {
		if (_page && _page.sidebar) {
			sidebarLinks = _page.sidebar;
		} else {
			sidebarLinks = sidebar && sidebar.links;
		}
	});
</script>

<style lang="scss" global>
	@import "../style/global.scss";
	@import "../style/prism.scss";
	@import "../style/_variables.scss";
</style>

<svelte:head>
	{#if config.head && config.head.length}
		{#each config.head as link}
			{@html link}
		{/each}
	{/if}
</svelte:head>

{#if navbar}
	<svelte:component this={Navbar} navbar={navbar}/>
{/if}

<main>
	<div class='app-container'>
		{#if sidebarLinks}
			<svelte:component this={Sidebar} links={sidebarLinks}/>
		{/if}
		<slot></slot>
	</div>
</main>
