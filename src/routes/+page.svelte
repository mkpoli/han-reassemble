<script lang="ts">
	import { run } from 'svelte/legacy';

	import GameOver from '$components/GameOver.svelte';
	import Overlay from '$components/Overlay.svelte';
	import Prompt from '$components/Prompt.svelte';
	import Splash from '$components/Splash.svelte';

	import { onMount } from 'svelte';
	import { equals, type Quiz } from '$lib/quiz';
	import { overlay, config, type Config } from '$lib/states.svelte';

	let status: 'correct' | 'wrong' | 'failed' | 'end' | null = $state(null);
	let userInput = $state('');
	let failed: number[] = $state([]);
	let loading = false;
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
	//   twitterShareText = `【漢字組直しクイズ】\n　10問中${n}問正解できたよ！これだけのヒントで正解できたよ🏆！すごい～🎉！\n\n「${quiz.paragraphs[0].substring(0, 64)}」\n\n▼あなたもわかるかな？😎▼\n`
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

	onMount(() => newGroup(config.config));
	async function newGroup(cfg: Config) {
		init();

		config.config = cfg;

		failed = [];

		loading = true;
		try {
			const res = await fetch(`/api/random?amount=${cfg.groupSize}`);
			quizzes = await res.json();
			index = 0;
		} catch (e) {
			console.error(e);
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
		if (status === 'correct' || status === 'wrong') {
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

<h1>漢字組直しクイズ</h1>

<Overlay enabled={status === 'end'}>
	<GameOver
		lastGroupSize={groupSize}
		{maxRetry}
		{quizzes}
		{failed}
		on:newgame={({ detail }) => {
			newGroup(detail);
		}}
	/>
</Overlay>

<Overlay enabled={startup}>
	<Splash
		on:newgame={({ detail }) => {
			newGroup(detail);
			startup = false;
		}}
	/>
</Overlay>

<main inert={overlay ? true : undefined}>
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
			bind:value={userInput}
			onkeyup={(event) => {
				if (event.key === 'Enter') {
					check();
				}
			}}
		/>

		{#if currentQuiz && showHint}
			<div class="hint">
				文字数　{'○'.repeat(currentQuiz.lemma.length)}（{currentQuiz.lemma.length}文字）
			</div>
		{/if}

		<button
			onclick={check}
			class="primary"
			disabled={status === 'correct' || status === 'failed' ? true : false}
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

<footer inert={overlay ? true : undefined}>
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
		padding: 2em;
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
		margin: 1em 1em;
		font-weight: normal;
		padding: 0;
		line-height: 1.3;
		font-size: 3em;
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

		border: 1px solid #ccc;
	}

	input[type='text'] {
		background: transparent;
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
