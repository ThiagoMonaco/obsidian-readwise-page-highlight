import { Notice, Plugin } from 'obsidian';
import { PluginSettings } from "./settings/PluginSettings";
import {LocalBooks} from "./domain/LocalBooks";
import {ReadwiseApi} from "./readwise/api";

interface Settings {
	authToken: string
	updatedAfter: string
	books: LocalBooks[]
	importAll: boolean
	importPath: string
}

const DEFAULT_SETTINGS: Settings = {
	authToken: '',
	updatedAfter: '',
	books: [],
	importAll: false,
	importPath: '/ReadwiseHighlights'
}

export default class ReadwiseHighligthsPlugins extends Plugin {
	settings: Settings
	api: ReadwiseApi

	async onload() {
		await this.loadSettings();
		this.api = new ReadwiseApi(this.settings.authToken)

		if(this.settings.authToken !== '' && this.settings.books.length === 0) {
			this.settings.books = await this.api.getBooks()
			await this.saveSettings()
		}
		this.addSettingTab(new PluginSettings(this.app, this))

		const dirExists = await this.app.vault.adapter.exists(`${this.settings.importPath}`)
		if(!dirExists) {
			new Notice(`Readwise highlight import failed: path ${this.settings.importPath} does not exist`)
		} else {
			await this.importHighlights()
		}

	}

	async importHighlights() {
		const ids = this.settings.books.filter((book) => book.enabled).map((book) => book.id)
		const result = await this.api.getHighlights(this.settings.updatedAfter, ids)
		result.results.forEach((highlight) => {
			const book = this.settings.books.find((book) => book.id === highlight.book_id)

			this.app.vault.create(
				`${this.settings.importPath}/${highlight.id}.md`,
				`### Content: \n${highlight.text}\n Book: ${book?.title}`
			)
		})
	}

	onunload() {
		return
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
