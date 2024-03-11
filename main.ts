import { Notice, Plugin } from 'obsidian';
import { PluginSettings } from "./settings/PluginSettings";
import {ReadwiseApi} from "./readwise/api";

interface Settings {
	authToken: string
	importAll: boolean
	importPath: string
	lastSync: string
}

const DEFAULT_SETTINGS: Settings = {
	authToken: '',
	importAll: false,
	importPath: '/ReadwiseHighlights',
	lastSync: ''
}

export default class ReadwiseHighligthsPlugins extends Plugin {
	settings: Settings
	api: ReadwiseApi

	async onload() {
		await this.loadSettings();
		this.api = new ReadwiseApi(this.settings.authToken)
		this.addSettingTab(new PluginSettings(this.app, this))

		if (this.settings.authToken === '') {
			new Notice("Readwise highlight import failed: no auth token provided")
			return
		}
		
		await this.importHighlights()
	}

	async importHighlights() {
		const dirExists = await this.app.vault.adapter.exists(`${this.settings.importPath}`)
		if(!dirExists) {
			new Notice(`Readwise highlight import failed: path ${this.settings.importPath} does not exist`)
			return
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
