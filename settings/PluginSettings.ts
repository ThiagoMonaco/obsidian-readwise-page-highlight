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
			.setName("Update after")
			.setDesc("Sync only highlights updated after this date")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.updatedAfter)
					.setPlaceholder("YYYY-MM-DD")
					.onChange(async (value) => {
						this.plugin.settings.updatedAfter = value;
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

		this.containerEl.createEl("h2", { text: "Select which books to import notes" })

		new Setting(containerEl)
			.setName("Update book list")
			.setDesc("Update the list of books from Readwise")
			.addButton((button) =>
				button
					.setButtonText("Update")
					.onClick(async () => {
						this.plugin.settings.books = await this.plugin.api.getBooks()
						await this.plugin.saveSettings()
						this.display()
					})
			);


		new Setting(containerEl)
			.setName("Toggle all books")
			.addButton((button) =>
				button
					.setButtonText("Toggle all")
					.onClick(async () => {
						const value = !this.plugin.settings.importAll
						this.plugin.settings.importAll = value
						this.plugin.settings.books.forEach((book, index) => {
							this.plugin.settings.books[index].enabled = value
						})
						await this.plugin.saveSettings();
						this.display()
					})
			)

		this.plugin.settings.books.forEach((book, index) => {
			new Setting(containerEl)
				.setName(book.title)
				.addToggle((toggle) =>
					toggle
						.setValue(book.enabled)
						.onChange(async (value) => {
							this.plugin.settings.books[index].enabled = value;
							await this.plugin.saveSettings();
						})
				)
		})
	}
}
