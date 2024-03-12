import { Notice, Plugin } from 'obsidian';
import { PluginSettings } from "./settings/PluginSettings";
import {ReadwiseApi} from "./readwise/api";

interface Settings {
	authToken: string
	importAll: boolean
	importPath: string
	lastSync: string
	active: boolean
}

const DEFAULT_SETTINGS: Settings = {
	authToken: '',
	importAll: false,
	importPath: '/ReadwiseHighlights',
	lastSync: '',
	active: true
}

export default class ReadwiseHighligthsPlugins extends Plugin {
	settings: Settings
	api: ReadwiseApi

	async onload() {
		await this.loadSettings();
		this.api = new ReadwiseApi(this.settings.authToken)
		this.addSettingTab(new PluginSettings(this.app, this))

		if(!this.settings.active) {
			return
		}

		if (this.settings.authToken === '') {
			new Notice("Readwise highlight import failed: no auth token provided")
			return
		}
		
		const results = await this.importHighlights()
		if (results) {
			new Notice( `Readwise imported ${results.count} highlights from ${results.results.length} books.`)
		}
	}

	async importHighlights() {
		const dirExists = await this.app.vault.adapter.exists(`${this.settings.importPath}`)
		if(!dirExists) {
			new Notice(`Readwise highlight import failed: path ${this.settings.importPath} does not exist`)
			return null
		}

		const result = await this.api.getHighlights(this.settings.lastSync)

		this.settings.lastSync = new Date().toISOString()
		await this.saveSettings()

		result.results.forEach((book) => {
			book.highlights.forEach((highlight) => {
				this.app.vault.create(
					`${this.settings.importPath}/${highlight.id}.md`,
					`### Content: \n${highlight.text}\n Book: ${book?.title}\n`
				)
			})
		})
		return result
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
