<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	export let success: boolean = false;
	export let failure: boolean = false;
</script>

<div class="prompt" in:fly={{ y: -200, duration: 500 }} out:fade>
	<div class="content" class:success class:failure>
		{#if success}
			<iconify-icon icon="mdi:checkbox-marked-circle-outline" />
		{:else if failure}
			<iconify-icon icon="mdi:close-circle-outline" />
		{:else}
			<iconify-icon icon="gridicons:info-outline" />
		{/if}
		<slot />
	</div>
</div>

<style>
	.prompt {
		position: absolute;

		inset: 0;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.content {
		height: 60%;
		padding: 0.8rem 1.2rem;
		background: white;

		text-align: center;

		display: flex;
		gap: 0.5rem;
		align-items: center;

		font-size: 1.5rem;
		border-radius: 0.3rem;
	}

	.success {
		color: rgb(31, 231, 0);
		box-shadow: 0 0 0.3rem rgba(31, 231, 0, 0.5);
		background: rgba(215, 255, 215, 0.99);
	}

	.failure {
		color: var(--color-error);
		box-shadow: 0 0 0.3rem rgba(255, 26, 26, 0.5);
		background: rgba(255, 216, 216, 0.99);
	}
</style>
