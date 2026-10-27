<script lang="ts">
	import { onMount } from 'svelte';
	import screenshot from '#assets/screenshot.png';

	type Glyph = { text: string; paint: string };
	type Example = { parts: Glyph[]; answer: Glyph[]; label: string };
	const blue = 'linear-gradient(#4824ff, #4824ff)';
	const pink = 'linear-gradient(#f21ec5, #f21ec5)';
	const teal = 'linear-gradient(#12aaa9, #12aaa9)';
	const green = 'linear-gradient(#84a920, #84a920)';
	const red = 'linear-gradient(#f32d2d, #f32d2d)';
	const vertical = (top: string, bottom: string) =>
		`linear-gradient(to bottom, ${top} 50%, ${bottom} 50%)`;
	const horizontal = (left: string, right: string) =>
		`linear-gradient(to right, ${left} 50%, ${right} 50%)`;
	const examples: Example[] = [
		{
			parts: [
				{ text: '交', paint: red },
				{ text: '子', paint: teal },
				{ text: '栄', paint: vertical('#f21ec5', '#84a920') }
			],
			answer: [
				{ text: '学', paint: vertical('#f21ec5', '#12aaa9') },
				{ text: '校', paint: horizontal('#84a920', '#f32d2d') }
			],
			label: '交・子・栄を組み換えて学校にする例'
		},
		{
			parts: [
				{ text: '口', paint: green },
				{ text: '心', paint: teal },
				{ text: '未', paint: red },
				{ text: '音', paint: blue }
			],
			answer: [
				{ text: '意', paint: vertical('#4824ff', '#12aaa9') },
				{ text: '味', paint: horizontal('#84a920', '#f32d2d') }
			],
			label: '口・心・未・音を組み換えて意味にする例'
		},
		{
			parts: [
				{ text: '才', paint: pink },
				{ text: '斗', paint: red },
				{ text: '木', paint: teal },
				{ text: '米', paint: green }
			],
			answer: [
				{ text: '材', paint: horizontal('#12aaa9', '#f21ec5') },
				{ text: '料', paint: horizontal('#84a920', '#f32d2d') }
			],
			label: '才・斗・木・米を組み換えて材料にする例'
		}
	];
	const labels = ['重・委・拉を組み換えて接種にする例', ...examples.map((item) => item.label)];
	let index = 0;
	export let playing = false;
	let announcement = '';
	let touchX = 0;
	let touchY = 0;

	onMount(() => {
		const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
		playing = !motion.matches;
		const onMotionChange = () => {
			if (motion.matches) playing = false;
		};
		motion.addEventListener('change', onMotionChange);
		const timer = window.setInterval(() => {
			if (playing && !document.hidden) index = (index + 1) % labels.length;
		}, 6000);
		return () => {
			window.clearInterval(timer);
			motion.removeEventListener('change', onMotionChange);
		};
	});

	function move(delta: number) {
		index = (index + delta + labels.length) % labels.length;
		playing = false;
		announcement = `${index + 1} / ${labels.length}、${labels[index]}`;
	}

	function touchStart(event: TouchEvent) {
		touchX = event.changedTouches[0].clientX;
		touchY = event.changedTouches[0].clientY;
	}

	function touchEnd(event: TouchEvent) {
		const x = event.changedTouches[0].clientX - touchX;
		const y = event.changedTouches[0].clientY - touchY;
		if (Math.abs(x) > 40 && Math.abs(x) > Math.abs(y)) move(x < 0 ? 1 : -1);
	}
</script>

<div class="gallery" role="group" aria-label="組み直しの例">
	<div
		class="viewport"
		role="group"
		aria-label="例の画像"
		on:touchstart|passive={touchStart}
		on:touchend|passive={touchEnd}
	>
		<div class="track" style:transform={`translateX(-${index * 100}%)`}>
			<div class="slide" aria-hidden={index !== 0}>
				<img src={screenshot} alt={labels[0]} />
			</div>
			{#each examples as example, i (example.label)}
				<div class="slide" aria-hidden={index !== i + 1}>
					<div class="illustration" role="img" aria-label={example.label}>
						<div class="parts">
							{#each example.parts as piece (piece.text)}
								<span style:background-image={piece.paint}>{piece.text}</span>
							{/each}
						</div>
						<div class="answer">
							{#each example.answer as piece (piece.text)}
								<span style:background-image={piece.paint}>{piece.text}</span>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="controls">
		<button type="button" aria-label="前の例" on:click={() => move(-1)}>‹</button>
		<span aria-hidden="true">{index + 1} / {labels.length}</span>
		<button type="button" aria-label="次の例" on:click={() => move(1)}>›</button>
		<button type="button" class="play" on:click={() => (playing = !playing)}
			>{playing ? '一時停止' : '自動再生'}</button
		>
	</div>
	<span class="sr-only" aria-live="polite">{announcement}</span>
</div>

<style>
	.gallery {
		width: min(220px, 70%);
		container-type: inline-size;
	}
	.viewport {
		overflow: hidden;
		aspect-ratio: 423 / 350;
		touch-action: pan-y;
	}
	.track {
		display: flex;
		height: 100%;
		transition: transform 0.4s ease;
	}
	.slide {
		flex: 0 0 100%;
		height: 100%;
	}
	.slide img {
		display: block;
		width: 100%;
		height: 100%;
	}
	.illustration {
		height: 100%;
		display: grid;
		grid-template-rows: 9% 54% 14% 18% 5%;
		font-family: serif;
	}
	.parts {
		grid-row: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		border-top: 1px solid #a2a9b1;
		border-bottom: 1px solid #a2a9b1;
		font-size: 21cqw;
		line-height: 1;
	}
	.answer {
		grid-row: 4;
		display: flex;
		align-items: center;
		justify-content: center;
		border-top: 1px solid #202122;
		border-bottom: 1px solid #202122;
		font-size: 8cqw;
		line-height: 1;
	}
	.parts span,
	.answer span {
		color: #563973;
	}
	@supports (background-clip: text) {
		.parts span,
		.answer span {
			background-clip: text;
			color: transparent;
		}
	}
	.controls {
		position: relative;
		left: 50%;
		width: max-content;
		transform: translateX(-50%);
		white-space: nowrap;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.2em;
		color: #62576a;
		font-size: 0.6em;
	}
	.controls button {
		min-width: 32px;
		min-height: 32px;
		padding: 0.1em 0.4em;
		border: 0;
		background: transparent;
		color: var(--color-accent);
		font-size: 1em;
	}
	.controls button:not(.play) {
		font-size: 1.5em;
		line-height: 1;
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
	}
	@media (prefers-reduced-motion: reduce) {
		.track {
			transition: none;
		}
	}
	@media (max-height: 650px) {
		.gallery {
			width: min(125px, 60%);
		}
	}
</style>
