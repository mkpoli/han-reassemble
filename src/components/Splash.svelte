<script lang="ts">
	import screenshot from '#assets/screenshot.png';

	import Settings from './Settings.svelte';

	import { config } from '../lib/states.svelte';

	import { createEventDispatcher } from 'svelte';
	export let loading = false;
	export let error = '';
	const dispatch = createEventDispatcher<{
		newgame: {
			groupSize: number;
			maxRetry: number;
		};
	}>();

	let { groupSize, maxRetry } = config.config;
</script>

<div class="dialog">
	<h2>ゲーム説明</h2>

	<div class="description"><span>漢字を組み換えて、</span><span>熟語を作ろう！</span></div>

	<img src={screenshot} alt="重・委・拉を組み換えて接種にする例" />

	<Settings bind:groupSize bind:maxRetry />

	{#if error}<p class="load-error" role="alert">{error}</p>{/if}
	<button
		disabled={loading}
		class="primary"
		on:click={() => {
			dispatch('newgame', { groupSize, maxRetry });
		}}>スタート！</button
	>
</div>

<style>
	.load-error {
		max-width: 18em;
		margin: 0 auto;
		color: var(--color-error);
		font-size: 0.75em;
		line-height: 1.4;
		overflow-wrap: anywhere;
	}
	h2 {
		font-size: 1.6rem;
		margin: 0;
	}
	.description span {
		display: inline-block;
	}
	.description {
		font-size: 0.9em;
	}
	.dialog {
		box-sizing: border-box;
		width: min(420px, calc(100vw - 32px));
		background: white;
		border-radius: 0.8em;
		box-shadow: 0 0.5em 2em rgba(0, 0, 0, 0.25);
		padding: 1.2em;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.7em;
		text-align: center;
	}
	.dialog > :global(button),
	.dialog > :global(fieldset) {
		box-sizing: border-box;
		min-width: 0;
		width: 100%;
	}
	img {
		width: min(220px, 70%);
		height: auto;
	}
	@media (max-height: 650px) {
		.dialog {
			padding: 0.8em;
			gap: 0.4em;
		}
		h2 {
			font-size: 1.3rem;
		}
		img {
			width: min(160px, 65%);
		}
	}
</style>
