export type Difficulty = 'easy' | 'normal' | 'hard';
export type Quiz = { lemma: string; anagram: string };
export type Item = { lemma: string; anagrams: string };

export function equals(answer: string, lemma: string): boolean {
	return (
		[...answer.trim().normalize('NFC')].sort().join('') ===
		[...lemma.normalize('NFC')].sort().join('')
	);
}

export function candidates(items: Item[], difficulty: Difficulty): Quiz[] {
	return items
		.filter(({ lemma }) => [...lemma].length === 2)
		.flatMap(({ lemma, anagrams }) => {
			const options = [...anagrams.matchAll(/'([^']+)'/g)].map((match) => match[1]);
			return options
				.filter((anagram) => {
					const length = [...anagram].length;
					return difficulty === 'easy'
						? length <= 2
						: difficulty === 'normal'
							? length >= 3 && length <= 4
							: length >= 5;
				})
				.map((anagram) => ({ lemma, anagram }));
		});
}
