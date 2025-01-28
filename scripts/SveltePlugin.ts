import esbuildSvelte from 'esbuild-svelte';
import { sveltePreprocess } from 'svelte-preprocess';

// @ts-ignore
const plugin = esbuildSvelte({
  compilerOptions: { css: 'injected' },
  preprocess: sveltePreprocess(),
});

export { plugin }
