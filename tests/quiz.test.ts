import { describe, expect, test } from 'bun:test';
import { candidates, equals } from '../src/lib/quiz';

const items = [
	{ lemma: '中心', anagrams: "['忠']" },
	{ lemma: '学校', anagrams: "['交子栄']" },
	{ lemma: '論者', anagrams: "['一内著言人']" }
];

describe('puzzles', () => {
	test('accepts either word order but respects repeated characters', () => {
		expect(equals(' 校学 ', '学校')).toBe(true);
		expect(equals('学校校', '学校')).toBe(false);
	});
	test('groups puzzles by the number of visible pieces', () => {
		expect(candidates(items, 'easy').map((item) => item.lemma)).toEqual(['中心']);
		expect(candidates(items, 'normal').map((item) => item.lemma)).toEqual(['学校']);
		expect(candidates(items, 'hard').map((item) => item.lemma)).toEqual(['論者']);
	});
});
