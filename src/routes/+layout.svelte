<script lang="ts">
	import 'iconify-icon';
</script>

<slot />

<style global>
	:root {
		--color-accent: #563973;
		--color-accent-light: rgb(166, 123, 143);
		--color-link: #542ecf;
		--color-error: rgb(255, 26, 26);

		accent-color: var(--color-accent);

		box-sizing: border-box;
	}

	button {
		padding: 0.5em 1em;
		font-size: 1.2em;
		border: none;
		border-radius: 0.25em;
	}

	button:hover {
		background-color: rgb(166, 123, 143, 0.1);
	}

	button.primary {
		background-color: var(--color-accent);
		color: white;
	}

	button.primary:hover {
		opacity: 0.8;
	}

	a {
		color: var(--color-link);
	}

	a:visited {
		color: var(--color-accent);
	}

	a:hover {
		color: var(--color-accent-light);
	}
</style>
