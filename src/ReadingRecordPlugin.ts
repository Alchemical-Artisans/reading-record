import { Component, MarkdownRenderer, MarkdownView, PluginSettingTab } from 'obsidian';
import { PluginBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginBase';

import { ReadingRecordPluginSettings } from './ReadingRecordPluginSettings.ts';
import { ReadingRecordPluginSettingsTab } from './ReadingRecordPluginSettingsTab.ts';
import { prompt } from 'obsidian-dev-utils/obsidian/Modal/Prompt';
import { Book, extractVolumeIDFrom } from './AddBook.ts';
import type { FilePropertiesView } from 'obsidian-typings';

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
          const id = extractVolumeIDFrom(url);
          const book = await Book.fetch(id);
          const markdown = book.markdown();
          const note = await this.app.vault.create(
            `${this.settings.bookPath}/${markdown.file_name}`,
            markdown.toString(),
          );
					this.app.workspace.getActiveViewOfType(MarkdownView)?.leaf.openFile(note);
        }
			}
		})

    await this.adjustProperties()
  }

  async adjustProperties() {
    const workspace = this.app.workspace;
    workspace.iterateAllLeaves((leaf) => {
      if (leaf.view.getViewType() == "file-properties") {
        const view = leaf.view as FilePropertiesView
        this.replaceAllEmbedded(view)
        this.app.vault.on("modify", () => {
          this.replaceAllEmbedded(view)
        })
      }
    })
  }

  private replaceAllEmbedded(view: FilePropertiesView) {
    view.containerEl.findAll(".metadata-property-value .metadata-input-longtext").forEach(async (e) => {
      if (e.innerHTML.startsWith("!")) {
        await this.performReplacement(e, view.leaf.component);
      }
    });
  }

  private async performReplacement(e: HTMLElement, component: Component) {
    const parent = e.parentElement;
    if (!parent!.find(".embedded")) {
      const embedded = e.createDiv({ cls: "embedded" });
      await MarkdownRenderer.render(this.app, e.innerHTML, embedded, "", component);
      e.parentElement!.replaceChildren(embedded);
    }
  }
}
