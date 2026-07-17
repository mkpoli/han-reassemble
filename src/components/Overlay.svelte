<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import { overlay } from '$lib/states.svelte';
	interface Props {
		enabled?: boolean;
		children?: import('svelte').Snippet;
	}

	let { enabled, children }: Props = $props();
</script>

<!-- <svelte:body> 
  <div>
  <slot /> -->

<!-- </svelte:body> -->

<div class="overlay" class:hidden={!enabled}>
	<div class="foreground">
		{@render children?.()}
	</div>
	<div class="background" onclick={bubble('click')}></div>
</div>

<style>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
		z-index: 100;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hidden {
		display: none;
	}

	.foreground {
		z-index: 101;
	}

	.background {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>
