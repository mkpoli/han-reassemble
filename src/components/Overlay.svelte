<script lang="ts">
	interface Props {
		enabled?: boolean;
		label: string;
		children?: import('svelte').Snippet;
	}

	let { enabled, label, children }: Props = $props();
</script>

{#if enabled}
	<div class="overlay" role="presentation">
		<div class="foreground" role="dialog" aria-modal="true" aria-label={label}>
			{@render children?.()}
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: grid;
		place-items: center;
		padding: 16px;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
	}
	.foreground {
		max-width: 100%;
		max-height: calc(100dvh - 32px);
		overflow-y: auto;
	}
</style>
