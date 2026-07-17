export let overlay = $state(false);

export type Config = {
	groupSize: number;
	maxRetry: number;
};

const DEFAULT_CONFIG: Config = {
	groupSize: 10,
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
