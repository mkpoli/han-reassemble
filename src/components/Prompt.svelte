<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	export let success: boolean = false;
	export let failure: boolean = false;
	const reducedMotion =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
</script>

<div
	class="prompt"
	in:fly={{ y: reducedMotion ? 0 : -40, duration: reducedMotion ? 0 : 250 }}
	out:fade={{ duration: reducedMotion ? 0 : 150 }}
>
	<div class="content" class:success class:failure>
		{#if success}
			<iconify-icon icon="mdi:checkbox-marked-circle-outline"></iconify-icon>
		{:else if failure}
			<iconify-icon icon="mdi:close-circle-outline"></iconify-icon>
		{:else}
			<iconify-icon icon="gridicons:info-outline"></iconify-icon>
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
