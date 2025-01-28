import {
  BuildMode,
  buildObsidianPlugin
} from "obsidian-dev-utils/scripts/esbuild/ObsidianPluginBuilder";
import esbuildSvelte from 'esbuild-svelte';
import { sveltePreprocess } from 'svelte-preprocess';

await buildObsidianPlugin({
  mode: BuildMode.Development,
  customEsbuildPlugins: [
    // @ts-ignore
    esbuildSvelte({
      compilerOptions: { css: 'injected' },
      moduleCompilerOptions: { dev: true },
      preprocess: sveltePreprocess(),
    }),
  ],
})
