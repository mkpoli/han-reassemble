<script lang="ts">
	import type { Difficulty } from '../lib/quiz';
	export let groupSize: number;
	export let difficulty: Difficulty;
	export let maxRetry: number;
</script>

<fieldset class="settings">
	<legend>設定</legend>
	<label class="difficulty"
		>難易度
		<select bind:value={difficulty}>
			<option value="easy">やさしい（パーツ1〜2個）</option>
			<option value="normal">ふつう（パーツ3〜4個）</option>
			<option value="hard">むずかしい（パーツ5個以上）</option>
		</select>
	</label>
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

	.difficulty {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5em;
	}
	.difficulty select {
		min-width: 0;
		max-width: 100%;
		padding: 0.4em;
		border: 1px solid #ccc;
		border-radius: 0.25em;
		background: white;
		color: inherit;
	}
	@media (max-width: 480px) {
		.difficulty {
			flex-direction: column;
			gap: 0.2em;
		}
		.difficulty select {
			width: 100%;
			font-size: 0.85em;
		}
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
