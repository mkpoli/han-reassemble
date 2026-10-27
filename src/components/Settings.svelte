<script lang="ts">
	export let groupSize: number;
	export let maxRetry: number;
</script>

<fieldset class="settings">
	<legend>設定</legend>
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
