<script lang="ts">
	import GameOver from '#components/GameOver.svelte';
	import Overlay from '#components/Overlay.svelte';
	import Prompt from '#components/Prompt.svelte';
	import Splash from '#components/Splash.svelte';

	import { onMount, tick } from 'svelte';
	import { equals, type Quiz } from '../lib/quiz';
	import { config, type Config } from '../lib/states.svelte';

	let status: 'correct' | 'wrong' | 'failed' | 'end' | null = $state(null);
	let userInput = $state('');
	let loading = $state(false);
	let loadError = $state('');
	let answerInput = $state<HTMLInputElement>();
	let previewController: AbortController | undefined;
	let failed: number[] = $state([]);
	let retry: number = $state(0);
	let index = $state(0);
	let showHint = $state(false);

	let startup = $state(true);

	let groupSize: number = $derived(config.config.groupSize);
	let maxRetry: number = $derived(config.config.maxRetry);

	let quizzes: Quiz[] = $state([]);
	let currentQuiz = $derived(quizzes[index]);

	// let correct = false;
	// let twitterShareText: string
	// $: if (lemma && anagram) {
	//   twitterShareText = `【漢字組直しクイズ】\n 10問中${n}問正解できたよ！これだけのヒントで正解できたよ🏆！すごい～🎉！\n\n「${quiz.paragraphs[0].substring(0, 64)}」\n\n▼あなたもわかるかな？😎▼\n`
	// }

	// let twitterShareURL = new URL('https://quiz.mkpo.li/')
	// $: if (quiz) {
	//   twitterShareURL.searchParams.set('quiz', encode(quiz?.article))
	//   twitterShareURL = twitterShareURL
	// }
	// $: console.log(twitterShareURL)

	function init() {
		status = null;
		retry = 0;
		userInput = '';
		showHint = false;
	}

	onMount(() => {
		const controller = new AbortController();
		previewController = controller;
		void (async () => {
			try {
				const res = await fetch(`/api/random?amount=${config.config.groupSize}`, {
					signal: controller.signal
				});
				if (!res.ok) return;
				const preview: Quiz[] = await res.json();
				if (
					!controller.signal.aborted &&
					startup &&
					!loading &&
					Array.isArray(preview) &&
					preview.length > 0
				) {
					quizzes = preview;
				}
			} catch {
				// Starting a round retries the request if the background preview fails.
			}
		})();
		return () => controller.abort();
	});

	async function newGroup(cfg: Config) {
		if (loading) return;
		loading = true;
		previewController?.abort();
		loadError = '';
		const nextConfig = {
			groupSize: Math.min(50, Math.max(1, Math.trunc(Number(cfg.groupSize) || 10))),
			difficulty: cfg.difficulty,
			maxRetry: Math.min(5, Math.max(0, Math.trunc(Number(cfg.maxRetry) || 0)))
		};
		try {
			const res = await fetch(
				`/api/random?amount=${nextConfig.groupSize}&difficulty=${nextConfig.difficulty}`
			);
			if (!res.ok) throw new Error('Request failed');
			const next: Quiz[] = await res.json();
			if (!Array.isArray(next) || next.length === 0) throw new Error('No puzzles');
			config.config = nextConfig;
			quizzes = next;
			failed = [];
			index = 0;
			init();
			startup = false;
			await tick();
			answerInput?.focus();
		} catch {
			loadError = '問題を読み込めませんでした。';
		} finally {
			loading = false;
		}
	}

	function nextQuiz() {
		index++;
		if (index >= quizzes.length) {
			status = 'end';
		} else {
			init();
		}
	}

	function check() {
		if (!currentQuiz || !userInput.trim() || status === 'correct' || status === 'wrong') {
			return;
		}

		if (equals(userInput, currentQuiz.lemma)) {
			status = 'correct';
			setTimeout(() => {
				status = null;
				nextQuiz();
			}, 1000);
		} else {
			status = 'wrong';
			retry++;

			setTimeout(() => {
				status = null;
				if (retry <= maxRetry) {
					return;
				}
				failed = [...failed, index];
				status = 'failed';
				nextQuiz();
			}, 1000);
		}
	}
</script>

<svelte:head>
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="ja_JP" />
	<meta property="og:site_name" content="漢字組直しクイズ" />
	<meta property="og:title" content="漢字組直しクイズ" />
	<meta property="og:description" content="漢字のパーツを組み換えて熟語を作るクイズ。" />
	<meta property="og:url" content="https://han-reasm.mkpo.li/" />
	<meta property="og:image" content="https://han-reasm.mkpo.li/social-card.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="重・委・拉を組み換えて接種にする例" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<h1>漢字組直しクイズ</h1>

<Overlay enabled={status === 'end'} label="結果">
	<GameOver
		lastGroupSize={groupSize}
		{maxRetry}
		difficulty={config.config.difficulty}
		{quizzes}
		{failed}
		{loading}
		error={loadError}
		on:newgame={({ detail }) => {
			newGroup(detail);
		}}
	/>
</Overlay>

<Overlay enabled={startup} label="ゲーム説明">
	<Splash
		{loading}
		error={loadError}
		on:newgame={({ detail }) => {
			newGroup(detail);
		}}
	/>
</Overlay>

<main inert={startup || status === 'end'}>
	{#if currentQuiz}
		<div class="anagram">
			{#if status === 'correct'}
				<Prompt success>正解</Prompt>
			{:else if status === 'wrong'}
				<Prompt failure>誤答（後{maxRetry - retry + 1}回）</Prompt>
			{/if}
			{currentQuiz.anagram}
		</div>
	{/if}

	<section class="input">
		<input
			type="text"
			class:wrong={status === 'wrong'}
			bind:this={answerInput}
			aria-label="答え"
			bind:value={userInput}
			onkeydown={(event) => {
				if (event.key === 'Enter' && !event.repeat && !event.isComposing && event.keyCode !== 229) {
					event.preventDefault();
					check();
				}
			}}
		/>

		{#if currentQuiz && showHint}
			<div class="hint">
				文字数 {'○'.repeat(currentQuiz.lemma.length)}（{currentQuiz.lemma.length}文字）
			</div>
		{/if}

		<button
			onclick={check}
			class="primary"
			disabled={!currentQuiz ||
				!userInput.trim() ||
				status === 'correct' ||
				status === 'wrong' ||
				status === 'failed'}
		>
			{status === 'correct' || status === 'failed' ? '次の問題' : '答える'}
		</button>
		<button
			onclick={() => {
				showHint = !showHint;
			}}>ヒント</button
		>
	</section>
</main>

<footer inert={startup || status === 'end'}>
	<p>
		このゲームは、YouTubeチャンネル <a href="https://www.youtube.com/c/QuizKnock">QuizKnock</a>
		の動画「<a href="https://www.youtube.com/watch?v=vuV5EUoQnzo"
			>【大失敗】漢字のパーツが組み変わってしまいました</a
		>」から着想を得て作られた物です。
	</p>
	<p>使用されたデータは、以下です。</p>
	<ul>
		<li>
			<a href="http://kanji-database.sourceforge.net/ids/ids-analysis.html"
				>『漢字データベース』「漢字構成データベース・解字ＩＤＳデータ」</a
			>
			(MITライセンス)
		</li>
		<li>
			<a href="https://clrd.ninjal.ac.jp/bccwj/bcc-chu.html"
				>『現代日本語書き言葉均衡コーパス』短単位語彙表 ver.1.1</a
			>（一部引用、© 国立国語研究所）
		</li>
		<li>
			<a
				href="https://ja.wikipedia.org/w/index.php?title=%E5%B8%B8%E7%94%A8%E6%BC%A2%E5%AD%97%E4%B8%80%E8%A6%A7&oldid=90209923"
			>
				「常用漢字一覧」『ウィキペディア日本語版』
			</a>（一部引用、CC BY-SA 3.0、元データは文化庁<a
				href="https://www.bunka.go.jp/kokugo_nihongo/sisaku/joho/joho/kijun/naikaku/kanji/index.html"
				>「常用漢字表」（平成22年内閣告示第2号）</a
			>）
		</li>
	</ul>
	<p style="text-align:center;">制作者 <a href="https://twitter.com/mkpoli">@mkpoli</a></p>
</footer>

<style>
	:root {
		font-size: 20px;
	}

	:global(body) {
		background-color: #f8f9fa;
		color: #202122;
	}

	main,
	footer {
		max-width: 1024px;
		margin: 0 auto;
	}

	footer {
		font-size: 15px;
		border-top: 1px solid #a2a9b1;
		padding: 0.75em;
	}

	main {
		padding: clamp(1em, 4vw, 2em);
		background-color: #ffffff;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		font-family: serif;

		gap: 1em;
	}

	main > * {
		width: 100%;
	}

	h1 {
		text-align: center;
		margin: 1em 0.5em;
		font-weight: normal;
		padding: 0;
		line-height: 1.3;
		font-size: clamp(1.7em, 6vw, 3em);
		overflow: visible;
		margin-bottom: 0;
	}

	.anagram {
		font-size: 5em;
		text-align: center;
		border: 1px solid #a2a9b1;
		position: relative;
	}

	input {
		font-size: 2em;
		text-align: center;

		border: 1px solid var(--input-border);
		border-radius: 0.1em;
		box-shadow: inset 0 1px 2px rgb(32 24 36 / 0.08);
	}

	input[type='text'] {
		background: white;
	}

	input.wrong {
		border-color: var(--color-error);
	}

	section.input {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 1em;
		padding: 1em;
	}

	.hint {
		position: absolute;
		top: 0;
		right: 0;
		padding: 1.2em;
		opacity: 0.85;
		background: transparent;
		user-select: none;
	}
</style>
