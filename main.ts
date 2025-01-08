import { BookView, BOOK_VIEW_TYPE } from 'bookView';
import { App, Modal, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { active } from 'state.svelte';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// TODO: Add book command
		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});

		// TODO: Configure folder for books
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerView(BOOK_VIEW_TYPE, (leaf) => new BookView(this.app.workspace, leaf))

        const workspace = this.app.workspace;
		const leaf = workspace.getRightLeaf(false);

		if (leaf) {
			await leaf.setViewState({
				type: BOOK_VIEW_TYPE,
				active: true,
			});

			workspace.onLayoutReady(async () => {
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
							Object.keys(active.frontmatter).forEach((property) => {
								console.log("resolved link", metadataCache.resolvedLinks[active.frontmatter!.property])
							});
						}
					}
				});
			})
		} else {
			console.log("No leaf created");
		}
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(BOOK_VIEW_TYPE)
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
