<script lang="ts">
	interface Props {
		enabled?: boolean;
		label: string;
		children?: import('svelte').Snippet;
	}

	let { enabled, label, children }: Props = $props();

	function focusDialog(node: HTMLElement) {
		const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		node.focus();
		return {
			destroy() {
				queueMicrotask(() => {
					if (document.activeElement && document.activeElement !== document.body) return;
					if (
						previous &&
						previous !== document.body &&
						previous.isConnected &&
						!previous.closest('[inert]')
					) {
						previous.focus();
					} else {
						document.querySelector<HTMLElement>('main input:not([disabled])')?.focus();
					}
				});
			}
		};
	}
</script>

{#if enabled}
	<div class="overlay" role="presentation">
		<div
			class="foreground"
			role="dialog"
			aria-modal="true"
			aria-label={label}
			tabindex="-1"
			use:focusDialog
		>
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
		border-radius: 0.8em;
		max-width: 100%;
		max-height: calc(100dvh - 32px);
		overflow-y: auto;
	}
	.foreground:focus-visible {
		outline: 2px solid #a787bb;
		outline-offset: 2px;
	}
</style>
