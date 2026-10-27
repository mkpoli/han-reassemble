import data from '#data/han_game_result.tsv';
import { candidates, type Difficulty, type Item } from '../../../lib/quiz';
import { json } from '@sveltejs/kit';
import _ from 'lodash';
import type { RequestHandler } from './$types';

const pools = Object.fromEntries(
	(['easy', 'normal', 'hard'] as const).map((difficulty) => [
		difficulty,
		candidates(data as Item[], difficulty)
	])
) as Record<Difficulty, ReturnType<typeof candidates>>;

export const GET: RequestHandler = ({ url }) => {
	const requested = url.searchParams.get('difficulty') ?? 'normal';
	if (requested !== 'easy' && requested !== 'normal' && requested !== 'hard') {
		return json({ error: 'Invalid difficulty' }, { status: 400 });
	}
	const rawAmount = url.searchParams.get('amount') ?? '10';
	const amount = Number(rawAmount);
	if (!Number.isInteger(amount) || amount < 1 || amount > 50) {
		return json({ error: 'Amount must be an integer from 1 to 50' }, { status: 400 });
	}
	const byWord = _.groupBy(pools[requested], 'lemma');
	const items = _.sampleSize(Object.values(byWord), amount).map((options) => {
		const quiz = _.sample(options)!;
		return { ...quiz, anagram: _.shuffle([...quiz.anagram]).join('') };
	});
	return json(items, { headers: { 'Cache-Control': 'no-store' } });
};
