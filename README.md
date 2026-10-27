# 漢字組直しクイズ

漢字のパーツを組み直して熟語を当てるゲームです。

## Development

Install dependencies with Bun, then start Vite:

```sh
bun install --frozen-lockfile
bun run dev
```

Run `bun run check`, `bun run lint`, and `bun run build` before submitting changes. The production build uses the SvelteKit Cloudflare adapter. `bun run deploy` builds and deploys the Worker configured in `wrangler.jsonc`; deploy only a clean, merged `master` commit.
