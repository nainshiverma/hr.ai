const express = require("express");
const multer = require("multer");
const { join } = require("path");
const transcribeAudio = require("./api/ai/speech-to-text");
const textToSpeech = require("./api/ai/text-to-speech");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = process.env.DEV_PORT;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Endpoint to convert speech to text
app.post("/api/speech-to-text", upload.single("audio"), async (req, res) => {
	const audioFile = req.file;

	if (!audioFile) {
		return res.status(400).json({ error: "Audio file is required" });
	}

	try {
		const filePath = join(__dirname, audioFile.path);
		const transcription = await transcribeAudio(filePath);
		res.status(200).json({ transcription });
	} catch (error) {
		console.error("Error transcribing audio:", error);
		res.status(500).json({ error: "Failed to transcribe audio" });
	}
});

// Endpoint to convert Text to Speech
app.post("/api/text-to-speech", async (req, res) => {
	const { text, languageCode, voiceName, audioEncoding, ssmlGender } = req.body;

	try {
		const audioBase64 = await textToSpeech({
			text,
			languageCode,
			voiceName,
			audioEncoding,
			ssmlGender,
		});
		res.status(200).json({ audioContent: audioBase64 });
	} catch (error) {
		console.error("Error converting text to speech:", error);
		res.status(500).json({ error: "Failed to convert text to speech" });
	}
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
