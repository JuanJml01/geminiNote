import { App, Modal, Setting, Notice } from "obsidian";

/**
 * Modal for user input prompt.
 */
export class InputModal extends Modal {
	// Renamed to PascalCase
	private prompt: string; // Use private modifier and descriptive name
	private onSubmit: (result: string) => void;

	constructor(app: App, onSubmit: (result: string) => void) {
		super(app);
		this.onSubmit = onSubmit; // Store the callback
		this.prompt = ""; // Initialize prompt

		this.setTitle("Type Prompt"); // Consistent capitalization

		new Setting(this.contentEl)
			.addTextArea((text) => {
				text.setPlaceholder("Enter your prompt here...") // Add placeholder
					.onChange((value) => {
						this.prompt = value;
					});
			})
			.addButton((btn) => {
				btn.setButtonText("Submit") // English button text
					.setCta()
					.onClick(() => {
						// Use arrow function for consistent 'this'
						if (this.prompt.trim() !== "") {
							// Check for non-empty after trimming whitespace
							console.log("Prompt submitted:", this.prompt); // Add logging
							this.close();
							this.onSubmit(this.prompt);
						} else {
							new Notice("Prompt cannot be empty.", 3000); // English notice
							console.warn("Attempted to submit empty prompt."); // Add logging for warning
						}
					});
			});
	}
}
