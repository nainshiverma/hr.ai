const { SpeechClient } = require("@google-cloud/speech");
const fs = require("fs").promises;
const path = require("path");

// Initialize Google Cloud Speech client
const speechClient = new SpeechClient();

async function transcribeAudio(audioFilePath) {
	try {
		// Read the binary audio data from the uploaded file
		const file = await fs.readFile(audioFilePath);
		const audioBytes = file.toString("base64");

		// Create an 'audio' object with the audio content in base64 format
		const audio = {
			content: audioBytes,
		};

		// Define the configuration for audio encoding, sample rate, and language code
		const config = {
			encoding: "MP3", // Audio encoding (change if needed)
			sampleRateHertz: 44100, // Audio sample rate in Hertz (change if needed)
			languageCode: "en-US", // Language code for the audio (change if needed)
		};

		// Perform speech recognition
		const [response] = await speechClient.recognize({
			audio,
			config,
		});

		// Extract the transcribed text from the response
		const transcription = response.results
			.map((result) => result.alternatives[0].transcript)
			.join("\n");

		return transcription;
	} catch (error) {
		console.error("Error transcribing audio:", error);
		throw new Error("Failed to transcribe audio");
	} finally {
		// Clean up the uploaded file
		await fs.unlink(audioFilePath);
	}
}

module.exports = transcribeAudio;
