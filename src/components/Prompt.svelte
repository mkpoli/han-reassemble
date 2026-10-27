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
	<div class="content" class:success class:failure><slot /></div>
</div>

<style>
	.prompt {
		position: absolute;
		top: 0.35rem;
		right: 0.35rem;
		pointer-events: none;
	}

	.content {
		padding: 0.25rem 0.55rem;
		border: 1px solid #c7bdd0;
		border-radius: 0.25rem;
		background: #f8f5fa;
		color: #563973;
		font-size: 0.85rem;
		line-height: 1.4;
	}

	.failure {
		border-color: #d8b9b9;
		background: #fcf6f6;
		color: #a33838;
	}
</style>
