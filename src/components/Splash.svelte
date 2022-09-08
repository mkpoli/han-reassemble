<script lang="ts">
	import screenshot from '$assets/screenshot.png';

	import Settings from './Settings.svelte';

	import { config } from '$lib/stores';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{
		newgame: {
			groupSize: number;
			maxRetry: number;
		};
	}>();

	let { groupSize, maxRetry } = $config;
</script>

<div class="dialog">
	<h2>ゲーム説明</h2>

	<div>漢字を組み換えて、熟語を作ろう！</div>

	<img src={screenshot} alt="Screenshot" />

	<Settings bind:groupSize bind:maxRetry />

	<button
		class="primary"
		on:click={() => {
			dispatch('newgame', { groupSize, maxRetry });
		}}>スタート！</button
	>
</div>

<style>
	h2 {
		font-size: 2rem;
		text-align: center;
		margin: 0.5em;
	}

	.dialog {
		background: white;
		border-radius: 1em;
		box-shadow: 0 0 1em rgba(0, 0, 0, 0.5);
		padding: 1em 2em;
		display: flex;
		flex-direction: column;
		gap: 0.6em;
		text-align: center;
	}

	.result {
		display: grid;
		grid-template-columns: auto auto;
		gap: 0.5em;
		max-height: 50vh;
		overflow-y: auto;
		text-align: center;
	}

	.result-item {
		display: contents;
	}

	.result-item.failed {
		color: var(--error-color);
	}

	img {
		max-width: 25vw;
	}
</style>
