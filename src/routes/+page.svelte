<script lang="ts">
	import { equals, type Difficulty, type Quiz } from '../lib/quiz';

	type Phase = 'start' | 'playing' | 'result';
	type Outcome = { quiz: Quiz; solved: boolean };
	const levels: { value: Difficulty; name: string; detail: string; attempts: number }[] = [
		{ value: 'easy', name: 'やさしい', detail: 'パーツ 1〜2個 · 3回まで', attempts: 3 },
		{ value: 'normal', name: 'ふつう', detail: 'パーツ 3〜4個 · 3回まで', attempts: 3 },
		{ value: 'hard', name: 'むずかしい', detail: 'パーツ 5個以上 · 2回まで', attempts: 2 }
	];
	let difficulty: Difficulty = $state('normal');
	let phase: Phase = $state('start');
	let quizzes: Quiz[] = $state([]);
	let outcomes: Outcome[] = $state([]);
	let index = $state(0);
	let answer = $state('');
	let attempts = $state(0);
	let hint = $state(false);
	let feedback: 'correct' | 'wrong' | 'failed' | null = $state(null);
	let loading = $state(false);
	let error = $state('');
	let sound = $state(true);
	let current = $derived(quizzes[index]);
	let level = $derived(levels.find((item) => item.value === difficulty)!);
	let score = $derived(outcomes.filter((item) => item.solved).length);
	let audio: AudioContext | undefined;

	function chime(kind: 'correct' | 'wrong' | 'start') {
		if (!sound) return;
		try {
			audio ??= new AudioContext();
			void audio.resume();
			const notes =
				kind === 'correct' ? [523, 659, 784] : kind === 'wrong' ? [220, 185] : [392, 523];
			notes.forEach((frequency, i) => {
				const oscillator = audio!.createOscillator();
				const gain = audio!.createGain();
				const at = audio!.currentTime + i * 0.09;
				oscillator.type = 'sine';
				oscillator.frequency.value = frequency;
				gain.gain.setValueAtTime(0.0001, at);
				gain.gain.exponentialRampToValueAtTime(0.12, at + 0.02);
				gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.18);
				oscillator.connect(gain);
				gain.connect(audio!.destination);
				oscillator.start(at);
				oscillator.stop(at + 0.19);
			});
		} catch {
			/* Sound is optional. */
		}
	}

	async function start() {
		if (loading) return;
		loading = true;
		error = '';
		chime('start');
		try {
			const response = await fetch(`/api/random?amount=10&difficulty=${difficulty}`);
			if (!response.ok) throw new Error('Request failed');
			const next: Quiz[] = await response.json();
			if (!next.length) throw new Error('No puzzles');
			quizzes = next;
			outcomes = [];
			index = 0;
			resetQuestion();
			phase = 'playing';
		} catch {
			error = '問題を読み込めませんでした。もう一度お試しください。';
		} finally {
			loading = false;
		}
	}
	function resetQuestion() {
		answer = '';
		attempts = 0;
		hint = false;
		feedback = null;
	}
	function submit() {
		if (!current || !answer.trim() || feedback === 'correct' || feedback === 'failed') return;
		if (equals(answer, current.lemma)) {
			feedback = 'correct';
			outcomes = [...outcomes, { quiz: current, solved: true }];
			chime('correct');
		} else {
			attempts++;
			feedback = attempts >= level.attempts ? 'failed' : 'wrong';
			if (feedback === 'failed') outcomes = [...outcomes, { quiz: current, solved: false }];
			chime('wrong');
		}
	}
	function next() {
		if (index + 1 >= quizzes.length) phase = 'result';
		else {
			index++;
			resetQuestion();
		}
	}
</script>

<svelte:head>
	<title>漢字組直しクイズ</title>
	<meta name="description" content="漢字のパーツを組み直して熟語を見つけよう。" />
</svelte:head>

<div class="shell">
	<header class="topbar">
		<div class="brand">
			<span class="brand-mark">組</span><span
				>漢字組直し<span class="brand-sub">KANJI REASSEMBLE</span></span
			>
		</div>
		<button
			class="sound"
			type="button"
			onclick={() => (sound = !sound)}
			aria-pressed={sound}
			aria-label={sound ? '効果音をオフにする' : '効果音をオンにする'}
			>{sound ? '♪ 音あり' : '♪ 音なし'}</button
		>
	</header>

	<main>
		{#if phase === 'start'}
			<section class="intro panel">
				<div class="eyebrow"><span class="dot"></span> KANJI PUZZLE</div>
				<h1>漢字をほどいて、<br /><em>熟語を見つけよう。</em></h1>
				<p class="lead">
					バラバラになった漢字のパーツを組み直すと、<br class="desktop" />二字熟語になります。
				</p>
				<div class="example">
					<span>たとえば</span><strong>交 子 栄</strong><span class="arrow">→</span><strong
						>学校</strong
					>
				</div>
				<div class="section-label">難易度を選ぶ <span>全10問</span></div>
				<div class="levels" role="group" aria-label="難易度">
					{#each levels as item (item.value)}
						<button
							type="button"
							class:chosen={difficulty === item.value}
							aria-pressed={difficulty === item.value}
							onclick={() => (difficulty = item.value)}
							><strong>{item.name}</strong><small>{item.detail}</small></button
						>
					{/each}
				</div>
				<button class="primary start" onclick={start} disabled={loading}
					>{loading ? '読み込み中…' : 'ゲームを始める'} <span>→</span></button
				>
				{#if error}<p class="error" role="alert">{error}</p>{/if}
			</section>
		{:else if phase === 'playing' && current}
			<section class="game panel">
				<div class="game-heading">
					<div>
						<div class="eyebrow"><span class="dot"></span> {level.name}</div>
						<h1>パーツを組み直そう</h1>
					</div>
					<div class="counter">
						<strong>{String(index + 1).padStart(2, '0')}</strong><span>
							/ {String(quizzes.length).padStart(2, '0')}</span
						>
					</div>
				</div>
				<div
					class="progress"
					role="progressbar"
					aria-label="問題の進行"
					aria-valuemin="0"
					aria-valuemax={quizzes.length}
					aria-valuenow={index}
				>
					<span style={`width: ${(index / quizzes.length) * 100}%`}></span>
				</div>
				<div
					class:celebrate={feedback === 'correct'}
					class:shake={feedback === 'wrong' || feedback === 'failed'}
					class="puzzle"
				>
					<div class="puzzle-label">このパーツからできる熟語は？</div>
					<div class="tiles" aria-label={`パーツ ${[...current.anagram].join('、')}`}>
						{#each [...current.anagram] as part, i (i)}<span style={`--i:${i}`}>{part}</span>{/each}
					</div>
				</div>
				<div class="answer-area">
					<div class="answer-heading">
						<label for="answer">答えを入力</label><span
							>残り {Math.max(0, level.attempts - attempts)} 回</span
						>
					</div>
					<form
						onsubmit={(event) => {
							event.preventDefault();
							submit();
						}}
					>
						<input
							id="answer"
							bind:value={answer}
							placeholder="二字熟語"
							autocomplete="off"
							disabled={feedback === 'correct' || feedback === 'failed'}
							oninput={() => {
								if (feedback === 'wrong') feedback = null;
							}}
						/>
						{#if feedback === 'correct' || feedback === 'failed'}<button
								class="primary"
								type="button"
								onclick={next}>{index + 1 === quizzes.length ? '結果を見る' : '次の問題'} →</button
							>{:else}<button class="primary" type="submit" disabled={!answer.trim()}
								>答える →</button
							>{/if}
					</form>
					<div class="feedback" aria-live="polite">
						{#if feedback === 'correct'}<span class="success">✦ 正解！ {current.lemma}</span
							>{:else if feedback === 'failed'}<span class="error"
								>答えは {current.lemma} でした</span
							>{:else if feedback === 'wrong'}<span class="error">もう一度考えてみよう</span
							>{:else if hint}<span>ヒント：最初の文字は「{[...current.lemma][0]}」</span
							>{:else}<span>文字の順番はどちらでも正解です</span>{/if}
					</div>
					<button class="hint" type="button" onclick={() => (hint = !hint)} aria-pressed={hint}
						>{hint ? 'ヒントを隠す' : '✧ ヒントを見る'}</button
					>
				</div>
			</section>
		{:else}
			<section class="result panel">
				<div class="eyebrow"><span class="dot"></span> ROUND COMPLETE</div>
				<h1>おつかれさま！</h1>
				<p class="lead">今回の結果</p>
				<div class="score"><strong>{score}</strong><span> / {quizzes.length} 問正解</span></div>
				<ol class="results">
					{#each outcomes as outcome, i (i)}<li>
							<span class:success={outcome.solved} class:error={!outcome.solved}
								>{outcome.solved ? '○' : '×'}</span
							><span>{outcome.quiz.anagram}</span><span class="result-arrow">→</span><strong
								>{outcome.quiz.lemma}</strong
							>
						</li>{/each}
				</ol>
				<button
					class="primary start"
					onclick={() => {
						phase = 'start';
					}}>もう一度遊ぶ →</button
				>
			</section>
		{/if}
	</main>
	<footer>
		<p>漢字の形をもっと調べるなら <a href="https://ids.mkpo.li/">IDS Workshop ↗</a></p>
		<details>
			<summary>このゲームについて</summary>
			<p>
				QuizKnockの<a href="https://www.youtube.com/watch?v=vuV5EUoQnzo">動画</a
				>から着想を得ました。
			</p>
			<p>
				データ：<a href="http://kanji-database.sourceforge.net/ids/ids-analysis.html"
					>漢字構成データベース・解字IDSデータ</a
				>（MIT）、<a href="https://clrd.ninjal.ac.jp/bccwj/bcc-chu.html"
					>現代日本語書き言葉均衡コーパス短単位語彙表 ver.1.1</a
				>（一部引用、©国立国語研究所）、<a
					href="https://ja.wikipedia.org/w/index.php?title=%E5%B8%B8%E7%94%A8%E6%BC%A2%E5%AD%97%E4%B8%80%E8%A6%A7&oldid=90209923"
					>常用漢字一覧</a
				>（一部引用、CC BY-SA 3.0、元データ：文化庁<a
					href="https://www.bunka.go.jp/kokugo_nihongo/sisaku/joho/joho/kijun/naikaku/kanji/index.html"
					>常用漢字表</a
				>）。
			</p>
			<p>制作：<a href="https://twitter.com/mkpoli">@mkpoli</a></p>
		</details>
	</footer>
</div>
