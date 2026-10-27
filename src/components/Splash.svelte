<script lang="ts">
	import screenshot from '#assets/screenshot.png';

	import Settings from './Settings.svelte';
	import type { Difficulty } from '../lib/quiz';

	import { config } from '../lib/states.svelte';

	import { createEventDispatcher } from 'svelte';
	export let loading = false;
	export let error = '';
	const dispatch = createEventDispatcher<{
		newgame: {
			groupSize: number;
			difficulty: Difficulty;
			maxRetry: number;
		};
	}>();

	let { groupSize, maxRetry, difficulty } = config.config;
</script>

<div class="dialog">
	<h2>ゲーム説明</h2>

	<div class="description"><span>漢字を組み換えて、</span><span>熟語を作ろう！</span></div>

	<img src={screenshot} alt="重・委・拉を組み換えて接種にする例" />

	<details class="tutorial">
		<summary>はじめての方へ</summary>
		<p>
			漢字を部品に分けて組み直し、二字熟語を作ります。たとえば「重・委・拉」からは「接種」ができます。
		</p>
		<p>答えを入力して「答える」を押します。迷ったときは「ヒント」で文字数を確認できます。</p>
	</details>

	<Settings bind:groupSize bind:maxRetry bind:difficulty />

	{#if error}<p class="load-error" role="alert">{error}</p>{/if}
	<button
		disabled={loading}
		class="primary"
		on:click={() => {
			dispatch('newgame', { groupSize, maxRetry, difficulty });
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
	.tutorial {
		width: 100%;
		font-size: 0.7em;
		line-height: 1.5;
		text-align: left;
	}
	.tutorial summary {
		width: fit-content;
		margin: 0 auto;
		color: var(--color-accent);
		cursor: pointer;
	}
	.tutorial summary:focus-visible {
		outline: 2px solid #80638e;
		outline-offset: 2px;
	}
	.tutorial p {
		margin: 0.5em 0 0;
	}
	img {
		width: min(220px, 70%);
		height: auto;
	}
	@media (max-height: 650px) {
		.dialog {
			padding: 0.65em;
			gap: 0.3em;
		}
		h2 {
			font-size: 1.2rem;
		}
		img {
			width: min(125px, 60%);
		}
		.description {
			font-size: 0.8em;
		}
	}
</style>
