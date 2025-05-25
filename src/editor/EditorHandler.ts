import { Editor } from "obsidian";

/**
 * Gets the selected text from the editor, or the entire content if nothing is selected.
 * @param editor - The Obsidian Editor instance or undefined.
 * @returns The selected text or the entire content, or an empty string if the editor is undefined.
 */
export function getSelectedOrAllContent(editor: Editor | undefined): string {
	console.log("Entering getSelectedOrAllContent");

	if (!editor) {
		console.warn("Editor instance is undefined. Cannot get content.");
		return "";
	}

	const selectedText = editor.getSelection();
	if (selectedText !== "") {
		console.log("Selected text found:", selectedText);
		console.log("Exiting getSelectedOrAllContent with selected text.");
		return selectedText;
	} else {
		const allContent = editor.getValue();
		console.log("No text selected. Getting all editor content.");
		console.log("Editor content:", allContent);
		console.log("Exiting getSelectedOrAllContent with all content.");
		return allContent;
	}
}

/**
 * Sets the content of the editor.
 * @param newContent - The new content to set in the editor.
 * @param editor - The Obsidian Editor instance or undefined.
 */
export function setContent(newContent: string, editor: Editor | undefined): void {
	console.log("Entering setContent");

	if (!editor) {
		console.warn("Editor instance is undefined. Cannot set content.");
		return;
	}

	console.log("Setting editor content.");
	editor.setValue(newContent);
	console.log("Exiting setContent.");
}
