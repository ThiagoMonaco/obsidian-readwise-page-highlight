import ReadwiseHighligthsPlugins from "../main";
import { App, PluginSettingTab, Setting } from "obsidian";



export class PluginSettings extends PluginSettingTab {
	plugin: ReadwiseHighligthsPlugins

	constructor(app: App, plugin: ReadwiseHighligthsPlugins) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Active")
			.setDesc("Enable or disable the plugin")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.active)
					.onChange(async (value) => {
						this.plugin.settings.active = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Auth token")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.authToken)
					.onChange(async (value) => {
						this.plugin.settings.authToken = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Import path")
			.setDesc("Path to import the highlights")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.importPath)
					.onChange(async (value) => {
						this.plugin.settings.importPath = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Sync highlights")
			.setDesc("Sync highlights from Readwise")
			.addButton((button) =>
				button
					.setButtonText("Sync")
					.onClick(async () => {
						await this.plugin.importHighlights()
					})
			)

		new Setting(containerEl)
			.setName("Reset last sync")
			.setDesc("The next sync will import all highlights")
			.addButton((button) =>
				button
					.setButtonText("Reset")
					.onClick(async () => {
						this.plugin.settings.lastSync = ''
						await this.plugin.saveSettings()
					})
			)
	}
}
