import data from '$data/han_game_result.tsv';
import type { RequestHandler } from './$types';
import _ from 'lodash';

type Item = {
  lemma: string;
  anagrams: string;
}

export const GET: RequestHandler = async ({ url }) => {
  const amount = Number(url.searchParams.get('amount')) || 10;
  const items = _.sampleSize(data as Item[], amount)
    .map(({ lemma, anagrams }: Item) => {
      const anagramList = anagrams
        .replace(/[[\]']+/g, '')
        .split(',').map((anagram) => anagram.trim());
      return {
        lemma, anagram: _.shuffle(_.sample(anagramList)).join(''),
      }
    });
  return new Response(JSON.stringify(items))
}