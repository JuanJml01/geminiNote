import {
	App,
	DropdownComponent,
	MarkdownView,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { setContent, getSelectedOrAllContent } from "src/editor/EditorHandler";
import { GeminiApi } from "src/gemini/GeminiApi";
import { InputModal } from "src/ui/InputModal";

// Remember to rename these classes and interfaces!
/**
 * Enum for available Gemini models.
 */
enum GeminiModel { // Renamed enum
	Flash = "gemini-2.5-flash-preview-04-17", // Renamed members to PascalCase
	Pro = "gemini-2.5-pro-preview-05-06",
}

interface MyPluginSettings {
	apiKeyGeminis: string;
	modelGeminis: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	apiKeyGeminis: "",
	modelGeminis: GeminiModel.Flash, // Use new enum name and member
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		let loadingNotice: Notice; // Renamed cargando to loadingNotice
		const geminiApi = new GeminiApi( // Renamed gemini to geminiApi for clarity
			this.settings.apiKeyGeminis,
			this.settings.modelGeminis
		);

		console.log("Plugin loaded successfully."); // Improved logging message
		console.log(
			`Gemini API Key (first 5 chars): ${this.settings.apiKeyGeminis.substring(
				0,
				5
			)}...`
		); // Log partial API key
		if (this.settings.apiKeyGeminis === "") {
			// Use strict equality
			new Notice(
				"Gemini API key not configured. Please add it in the plugin settings."
			); // More informative notice
			console.warn("Gemini API key is not configured."); // Add logging for warning
		}

		this.addRibbonIcon("bot", "Chat with Gemini", (evt: MouseEvent) => {
			// Improved tooltip text
			console.log("Ribbon icon clicked."); // Add logging

			if (this.settings.apiKeyGeminis === "") {
				// Use strict equality
				new Notice(
					"Please configure your Gemini API key in the plugin settings."
				); // Informative notice
				console.warn(
					"Attempted to use plugin without configured API key."
				); // Add logging for warning
				return; // Exit the handler if API key is not set
			}

			// Update geminiApi instance with potentially changed settings
			geminiApi.apikey = this.settings.apiKeyGeminis;
			geminiApi.model = this.settings.modelGeminis;
			console.log("Gemini API instance updated with current settings."); // Add logging

			console.log("Opening input modal for prompt."); // Add logging
			new InputModal(this.app, async (promptResult: string) => {
				// Explicitly type result and use async
				console.log("Input modal submitted with prompt:", promptResult); // Add logging

				const activeEditor =
					this.app.workspace.getActiveViewOfType(
						MarkdownView
					)?.editor;
				if (!activeEditor) {
					new Notice("No active editor found."); // Informative notice
					console.warn(
						"No active editor found when attempting to get content."
					); // Add logging for warning
					return; // Exit if no active editor
				}

				const content = getSelectedOrAllContent(activeEditor);
				console.log("Content obtained from editor."); // Add logging

				loadingNotice = new Notice("Sending prompt to Gemini...", 0); // Initialize loading notice

				try {
					console.log("Calling Gemini API with prompt and content."); // Add logging
					const generatedText = await geminiApi.generateContent(
						promptResult,
						content
					); // Use await and new function name
					console.log("Received response from Gemini API."); // Add logging

					loadingNotice.hide(); // Hide loading notice on success
					new Notice("Gemini response received."); // Success notice
					console.log("Gemini generated text:", generatedText); // Log generated text

					if (generatedText) {
						setContent(generatedText, activeEditor); // Use new function name
						console.log("Editor content updated."); // Add logging
					} else {
						new Notice("Gemini returned empty content."); // Informative notice
						console.warn("Gemini API returned empty content."); // Add logging for warning
					}
				} catch (error) {
					loadingNotice.hide(); // Hide loading notice on error
					new Notice(
						`Error calling Gemini API: ${
							error instanceof Error
								? error.message
								: String(error)
						}`
					); // Display error notice
					console.error("Error during Gemini API call:", error); // Log the full error
				}
			}).open();
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Apikey de Geminis")
			.setDesc("")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.apiKeyGeminis)
					.onChange(async (value) => {
						this.plugin.settings.apiKeyGeminis = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Modelo de geminis")
			.setDesc("")
			.addDropdown((dropdown: DropdownComponent) => {
				dropdown
					.addOption(GeminiModel.Flash, "Flash") // Use new enum name and member
					.addOption(GeminiModel.Pro, "Pro") // Use new enum name and member
					.onChange(async (select) => {
						this.plugin.settings.modelGeminis = select;
						console.log("Se ha cambio modelo: " + select);
						await this.plugin.saveSettings();
					});
			});
	}
}
