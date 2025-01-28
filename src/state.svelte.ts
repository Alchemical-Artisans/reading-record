import type { FrontMatterCache, TFile } from "obsidian";

export const active: {
	file: TFile | null;
	frontmatter: FrontMatterCache | undefined;
} = $state({
	file: null,
	frontmatter: undefined,
});
