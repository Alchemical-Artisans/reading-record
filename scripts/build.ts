import {
  BuildMode,
  buildObsidianPlugin
} from "obsidian-dev-utils/scripts/esbuild/ObsidianPluginBuilder";
import esbuildSvelte from 'esbuild-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import { exit } from "process";

buildObsidianPlugin({ mode: BuildMode.Production, customEsbuildPlugins: [
  // @ts-ignore
  esbuildSvelte({
    compilerOptions: { css: 'injected' },
    preprocess: sveltePreprocess(),
  }),
]}).then(() => exit());
