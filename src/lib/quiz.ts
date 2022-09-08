export type Quiz = {
  lemma: string;
  anagram: string;
}

export function equals(answer: string, lemma: string): boolean {
  return [...answer].sort().join('') === [...lemma].sort().join('');
}