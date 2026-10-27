<script lang="ts">
	import type { Difficulty } from '../lib/quiz';
	export let groupSize: number;
	export let difficulty: Difficulty;
	export let maxRetry: number;
</script>

<fieldset class="settings">
	<legend>設定</legend>
	<div class="difficulty" role="group" aria-label="難易度">
		<span class="difficulty-label">難易度</span>
		<div class="difficulty-buttons">
			<button
				type="button"
				class:selected={difficulty === 'easy'}
				aria-pressed={difficulty === 'easy'}
				on:click={() => (difficulty = 'easy')}>やさしい</button
			>
			<button
				type="button"
				class:selected={difficulty === 'normal'}
				aria-pressed={difficulty === 'normal'}
				on:click={() => (difficulty = 'normal')}>ふつう</button
			>
			<button
				type="button"
				class:selected={difficulty === 'hard'}
				aria-pressed={difficulty === 'hard'}
				on:click={() => (difficulty = 'hard')}>むずかしい</button
			>
		</div>
	</div>
	<small class="difficulty-detail"
		>{difficulty === 'easy'
			? 'パーツ1〜2個'
			: difficulty === 'normal'
				? 'パーツ3〜4個'
				: 'パーツ5個以上'}</small
	>
	<div class="form">
		<label for="group-size">問題数</label>
		<input type="number" min={1} max={50} bind:value={groupSize} id="group-size" />
		<label for="max-retry">再試行</label>
		<input type="number" min={0} max={5} bind:value={maxRetry} id="max-retry" />
	</div>
</fieldset>

<style>
	.settings {
		border: 1px solid var(--control-border);
		border-radius: 0.3em;
	}

	.settings legend {
		padding: 0 0.4em;
		color: var(--control-text);
	}

	.settings input {
		box-sizing: border-box;
		width: 5em;
		padding: 0.4em 0.5em;
		border: 1px solid var(--control-border);
		border-radius: 0.3em;
		background: var(--control-surface);
		color: var(--control-text);
		font: inherit;
		text-align: center;
	}

	.difficulty-label {
		display: block;
		margin-bottom: 0.3em;
	}
	.difficulty-buttons {
		display: flex;
		justify-content: center;
		gap: 0.3em;
	}
	.difficulty-buttons button {
		flex: 1;
		min-width: 0;
		padding: 0.45em 0.15em;
		border: 1px solid #d2c9da;
		border-radius: 0.3em;
		background: #faf8fb;
		color: #46384e;
		font-size: 0.7em;
		white-space: nowrap;
	}
	.difficulty-buttons button:hover {
		border-color: #80638e;
		background: #f2ebf6;
	}
	.difficulty-buttons button.selected {
		border-color: #563973;
		background: #563973;
		color: white;
	}
	.difficulty-buttons button:focus-visible {
		outline: 2px solid #80638e;
		outline-offset: 2px;
	}
	.difficulty-detail {
		display: block;
		margin-top: 0.25em;
		font-size: 0.65em;
		color: #666;
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
	@media (max-height: 650px) {
		.difficulty-label {
			margin-bottom: 0.15em;
		}
		.difficulty-buttons button {
			padding: 0.3em 0.1em;
		}
		.settings .form {
			padding: 0.1em;
			gap: 0.2em;
		}
		.settings legend {
			padding: 0.1em 0.4em;
		}
	}
</style>
