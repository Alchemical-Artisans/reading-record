import { MarkdownView, PluginSettingTab } from 'obsidian';
import { PluginBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginBase';

import { ReadingRecordPluginSettings } from './ReadingRecordPluginSettings.ts';
import { ReadingRecordPluginSettingsTab } from './ReadingRecordPluginSettingsTab.ts';
import { prompt } from 'obsidian-dev-utils/obsidian/Modal/Prompt';
import { BOOK_VIEW_TYPE, BookView } from './BookView.ts';
import { active } from './state.svelte.ts';

export class ReadingRecordPlugin extends PluginBase<ReadingRecordPluginSettings> {
  protected override createPluginSettings(data: unknown): ReadingRecordPluginSettings {
    return new ReadingRecordPluginSettings(data);
  }

  protected override createPluginSettingsTab(): null | PluginSettingTab {
    return new ReadingRecordPluginSettingsTab(this);
  }

  protected override async onloadComplete(): Promise<void> {
    this.addCommand({
			id: 'add-book',
			name: 'Add Book',
			callback: async () => {
				const url = await prompt({
          app: this.app,
          title: "Google Books URL",
        });

        if (url) {
					const match = url.match("edition/[^/]+/([^?]+)?");
					if (match) {
						const id = match[1]
						const request = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
						const json = await request.json() as {
              volumeInfo: {
                title: string;
                authors: string[];
                imageLinks: {
                  small: string;
                };
              }
            };
						const volume = json["volumeInfo"];
						const note = await this.app.vault.create(`${this.settings.bookPath}/${volume["title"]}.md`, `---
Cover: ${volume["imageLinks"]["small"].replace("http://", "https://")}
Author:
  - "[[${volume["authors"][0]}]]"
---`);
						this.app.workspace.getActiveViewOfType(MarkdownView)?.leaf.openFile(note);
					}
        }
			}
		})

    await this.buildLeaf()
  }

  async buildLeaf() {
    const workspace = this.app.workspace;
		this.registerView(BOOK_VIEW_TYPE, (leaf) => new BookView(workspace, leaf))
		workspace.onLayoutReady(async () => {
		  const leaf = workspace.getRightLeaf(false);

		  if (leaf) {
			  await leaf.setViewState({
				  type: BOOK_VIEW_TYPE,
				  active: true,
			  });

				workspace.on("active-leaf-change", async () => {
					active.file = workspace.getActiveFile();
					if (active.file) {
            const metadataCache = this.app.metadataCache;
						active.frontmatter = metadataCache.getFileCache(active.file)?.frontmatter;
						metadataCache.on("changed", (file) => {
							if (file === active.file)
								active.frontmatter = metadataCache.getFileCache(file)?.frontmatter
						})

						if (active.frontmatter) {
							Object.keys(active.frontmatter).forEach(() => {
								console.log("resolved link", metadataCache.resolvedLinks[active.frontmatter!["property"]])
							});
						}
					}
				});
			} else {
				console.log("No leaf created");
			}
		});
  }
}
