import Book from "./Book.svelte";
import { type IconName, ItemView, Workspace, WorkspaceLeaf } from "obsidian";
import { mount } from "svelte";

export const BOOK_VIEW_TYPE = "book-view";
export class BookView extends ItemView {
	workspace: Workspace;
	book: ReturnType<typeof Book> | undefined;

	constructor(workspace: Workspace, leaf: WorkspaceLeaf) {
		super(leaf);
		this.workspace = workspace;
	}

  getViewType(): string {
    return BOOK_VIEW_TYPE;
  }

  getDisplayText(): string {
    return "Book Information";
  }

	override getIcon(): IconName {
		return "book";
	}

	override async onOpen() {
		this.book = mount(Book, {
			target: this.contentEl,
		});
	}
}
