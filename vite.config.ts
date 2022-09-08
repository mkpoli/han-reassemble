import { sveltekit } from '@sveltejs/kit/vite';
import dsv from '@rollup/plugin-dsv'
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit(), dsv()],
};

export default config;
