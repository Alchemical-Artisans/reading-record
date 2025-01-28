import { Modal, App, Setting, MarkdownView } from 'obsidian';
import { Book, extractVolumeIDFrom } from './AddBook.ts';

export class AddBookModal extends Modal {
    constructor(app: App) {
        super(app);
    }

    override onOpen() {
        const { contentEl } = this;

		let url = "";
		new Setting(contentEl)
			.setName("Google Books URL")
			.addText((text) => {
				text.onChange((value) => url = value)
			});
		new Setting(contentEl)
			.addButton((btn) => {
				btn.setButtonText("Add")
					.onClick(async () => {
            const id = extractVolumeIDFrom(url)
            const book = await Book.fetch(id)
            const markdown = book.markdown()
						const note = await this.app.vault.create(
              `/Books/${markdown.file_name}`,
              markdown.toString(),
            );
						this.app.workspace.getActiveViewOfType(MarkdownView)?.leaf.openFile(note);
						this.close();
					});
			});
    }

    override onClose() {
        this.contentEl.empty();
    }

}
