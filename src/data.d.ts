declare module '*.tsv' {
	const rows: { lemma: string; anagrams: string }[];
	export default rows;
}
