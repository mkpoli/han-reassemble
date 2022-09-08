<script lang="ts">
	import type { Quiz } from '$lib/quiz';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{
		newgame: {
			groupSize: number;
			maxRetry: number;
		};
	}>();

	export let maxRetry: number;
	export let lastGroupSize: number;
	export let quizzes: Quiz[];
	export let failed: number[];

	$: groupSize = lastGroupSize;
</script>

<div class="dialog">
	<h2>GAME OVER!</h2>

	<div>{lastGroupSize - failed.length}/{lastGroupSize}</div>

	{#if quizzes}
		<div class="result">
			{#each quizzes as quiz, i}
				<div class="result-item" class:failed={failed.includes(i)}>
					<div class="anagram">{quiz.anagram}</div>
					<div class="lemma">{quiz.lemma}</div>
				</div>
			{/each}
		</div>
	{/if}

	<fieldset class="settings">
		<legend>設定</legend>
		<div class="form">
			<label for="group-size">問題数</label>
			<input type="number" min={1} max={50} bind:value={groupSize} id="group-size" />
			<label for="max-retry">再試行</label>
			<input type="number" min={0} max={5} bind:value={maxRetry} id="max-retry" />
		</div>
	</fieldset>

	<button
		on:click={() => {
			dispatch('newgame', { groupSize, maxRetry });
		}}>Next Game</button
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

	.settings {
		border-radius: 0.25em;
		border: none;
		box-shadow: 1px 1px 0.2em rgba(0, 0, 0, 0.25);
	}

	.settings legend {
		border-radius: 0.25em;
		background-color: white;
		box-shadow: 1px 1px 0.2em rgba(0, 0, 0, 0.25);
		padding: 0.25em 0.5em;
		margin: 0 0.5em;
	}

	.settings input {
		border-radius: 0.25em;
		border: none;
		padding: 1em;
		width: 5em;
		background-color: white;
		box-shadow: 1px 1px 0.5em rgba(0, 0, 0, 0.25);
		padding: 0.5em 0.5em;
		text-align: center;
		appearance: none;
	}

	.settings .form {
		display: grid;
		grid-template-columns: auto auto;
		grid-template-rows: auto auto;
		grid-auto-flow: column;
		justify-items: center;
		align-items: center;

		padding: 0.3em 1em 0.5em 1em;
		gap: 0.5em;

		text-align: center;
	}
</style>
