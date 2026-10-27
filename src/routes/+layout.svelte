<script lang="ts">
	import '../app.css';
	import favicon from '../lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>漢字組直しクイズ</title>
	<meta name="description" content="漢字のパーツを組み換えて熟語を作るクイズ。" />
	<link rel="canonical" href="https://han-reasm.mkpo.li/" />
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
