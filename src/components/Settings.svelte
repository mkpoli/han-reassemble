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
