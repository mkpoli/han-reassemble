import type { Difficulty } from './quiz';

export const overlay = $state(false);

export type Config = {
	groupSize: number;
	difficulty: Difficulty;
	maxRetry: number;
};

const DEFAULT_CONFIG: Config = {
	groupSize: 10,
	difficulty: 'normal',
	maxRetry: 2
};

function createConfig() {
	let config = $state(DEFAULT_CONFIG);
	return {
		get config() {
			return config;
		},
		set config(value: Config) {
			config = value;
		}
	};
}

export const config = createConfig();
