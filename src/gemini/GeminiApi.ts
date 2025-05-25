import { GoogleGenAI } from "@google/genai";

/**
 * Generates the full prompt string for the Gemini API based on user instructions and notes content.
 * @param userInstructions - The user's instructions for refining the notes.
 * @param notesContent - The content of the notes to be refined.
 * @returns The complete prompt string for the API.
 */
function buildGeminiPrompt(userInstructions: string, notesContent: string): string {
	const promptTemplate = `Eres un asistente experto en optimizar y enriquecer notas. Tu tarea es recibir unas instrucciones y unas notas, y devolver **únicamente** las notas mejoradas aplicando técnicas de ingeniería de prompt.

1. Rol y Objetivo
   - **Rol:** Editor de notas profesional.
   - **Objetivo:** Retornar solo las notas perfeccionadas, sin explicaciones ni metadatos.

2. Técnicas Clave
   - **Instrucciones Explícitas:** Sigue cada indicación paso a paso.
   - **Formato Consistente:** Emplea títulos, subtítulos y viñetas.
   - **Claridad y Concisión:** Simplifica y elimina redundancias.
   - **Enriquecimiento:** Agrega definiciones, ejemplos o conexiones lógicas cuando aporten valor.
   - **Precisión:** Verifica datos y conceptos.

3. Estructura de Entrada
- **Instrucciones:
	${userInstructions}

- **Contenido de las Notas:
	${notesContent}


4. Criterios de Salida
	- Solo las notas mejoradas (sin encabezados de explicación).
	- Formato limpio y uniforme:
	  - **Título** (opcional)
	  - **Subtítulos** para secciones
	  - Viñetas o numeración para listados
	- Tono adecuado al propósito (académico, técnico, ejecutivo…).

5. Ejemplo de Uso
	- **Input**
	  Instrucción: “Destaca los conceptos clave y añade un ejemplo práctico.”
	  Notas: “La fotosíntesis convierte luz en energía…”
	- **Output**
	  **Conceptos Clave**
	  1. Fotosíntesis: proceso de conversión de luz en energía química
	  2. Fases: fase luminosa y ciclo de Calvin

	  **Ejemplo Práctico**
	  - Plantas usan luz solar para producir glucosa, que alimenta su crecimiento.
	`;

	return promptTemplate;
}

export class GeminiApi {
	apikey: string;
	model: string;

	constructor(apikey: string, model: string) {
		this.apikey = apikey;
		this.model = model;
	}

	/**
	 * Calls the Gemini API to generate content based on user prompt and notes.
	 * Implements basic logging and error handling.
	 * @param userInstructions - The user's instructions for refining the notes.
	 * @param notesContent - The content of the notes to be refined.
	 * @returns The refined notes content from the Gemini API.
	 * @throws Error if the API call fails.
	 */
	async generateContent(userInstructions: string, notesContent: string): Promise<string> {
		console.log("Entering GeminiApi.generateContent");
		console.log(`API Key (first 5 chars): ${this.apikey.substring(0, 5)}...`); // Log partial API key for security
		console.log(`Model: ${this.model}`);

		const fullPrompt = buildGeminiPrompt(userInstructions, notesContent);
		console.log("Generated Prompt:", fullPrompt);

		try {
			const genAI = new GoogleGenAI({ apiKey: this.apikey });
			const response = await genAI.models.generateContent({
				model: this.model,
				contents: fullPrompt,
			});

			const generatedText = response.text; // Access .text property
			if (generatedText === undefined) {
				throw new Error("Gemini API response text is undefined.");
			}
			console.log("Received response from Gemini API.");
			console.log("Generated Text:", generatedText);

			console.log("Exiting GeminiApi.generateContent successfully.");
			return generatedText;

		} catch (error) {
			console.error("Error calling Gemini API:", error);
			// Re-throw the error after logging, or handle it more gracefully
			throw new Error(`Failed to call Gemini API: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	// Placeholder
}
