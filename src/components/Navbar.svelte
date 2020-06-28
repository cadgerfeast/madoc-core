<script>
	import { stores } from '@sapper/app';
	import { onMount } from 'svelte';
	import eva from 'eva-icons';
	import ColorPicker from './ColorPicker.svelte';

	const { page } = stores();
	export let navbar;

	let openTogglePicker = false;

	onMount(() => {
		eva.replace();
	});
	function toggleColorPicker () {
		openTogglePicker = !openTogglePicker;
	}
</script>

<style lang="scss" scoped>
	nav {
		display: flex;
		align-items: center;
		border-bottom: 1px solid var(--madoc-heading-underline-color);
		font-weight: 400;
		transition: border .25s ease-out;
		> ul {
			display: flex;
			align-items: center;
			margin: 0;
			padding: 0;
			list-style: none;
			height: 50px;
			line-height: 50px;
			> li {
				height: 100%;
				> a {
					height: 100%;
				}
				&:first-child {
					margin-left: 10px;
				}
			}
			&.links {
				> li {
					border-bottom: 2px solid transparent;
					&:hover, &.selected {
						border-bottom: 2px solid var(--madoc-accent);
					}
					> a {
						color: inherit;
						text-decoration: none;
						display: block;
						padding: 0 1em;
					}
				}
			}
			&.options {
				margin-left: auto;
				> li.icon {
					position: relative;
					display: inline-block;
					padding: 0 5px;
					fill: var(--madoc-navbar-icon-color);
					> div.icon-container {
						height: 100%;
						display: flex;
						align-items: center;
					}
					cursor: pointer;
					&:hover {
						fill: var(--madoc-navbar-icon-hover-color);
					}
					&.github {
						> a {					
							display: flex;
							align-items: center;
							fill: var(--madoc-navbar-icon-color);
							&:hover {
								fill: var(--madoc-navbar-icon-hover-color);
							}
						}
					}
				}
				> li:last-child {
					padding-right: 10px;
				}
			}
		}
	}
</style>

<nav>
	<ul class='links'>
		{#each navbar.links as link}
			<li class:selected={$page.path === link.path}><a rel=prefetch href={link.path}>{link.title}</a></li>
		{/each}
	</ul>
	<ul class='options'>
		{#if navbar.github}
			<li class='github icon'>
				<a href={navbar.github.link} target='_blank'>
					<i data-eva="github" data-eva-height="30" data-eva-width="30" data-eva-animation="pulse" data-eva-hover="false" data-eva-infinite="false"></i>
				</a>
			</li>
			{/if}
		<li class='icon' on:click={toggleColorPicker}>
			<div class='icon-container'>
				<i data-eva="color-palette" data-eva-height="30" data-eva-width="30" data-eva-animation="pulse" data-eva-hover="false" data-eva-infinite="false"></i>
			</div>
			<ColorPicker active={openTogglePicker}></ColorPicker>
		</li>
	</ul>
</nav>
