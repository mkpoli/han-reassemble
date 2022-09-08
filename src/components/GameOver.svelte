<script lang="ts">
	import type { Quiz } from '$lib/quiz';

	import { createEventDispatcher } from 'svelte';
	import Settings from './Settings.svelte';
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
		<ol class="result">
			{#each quizzes as quiz, i}
				<li class:failed={failed.includes(i)}>
					<div class="result-item">
						<div class="anagram">{quiz.anagram}</div>
						<div class="lemma">{quiz.lemma}</div>
					</div>
				</li>
			{/each}
		</ol>
	{/if}

	<Settings bind:groupSize bind:maxRetry />

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
		max-height: 40vh;
		overflow-y: auto;
		text-align: center;
	}

	li.failed {
		color: var(--color-error);
	}

	.result-item {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
</style>
