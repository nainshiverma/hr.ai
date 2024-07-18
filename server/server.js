const express = require("express");
const multer = require("multer");
const { join } = require("path");
const transcribeAudio = require("./api/ai/speech-to-text");
const textToSpeech = require("./api/ai/text-to-speech");
const bodyParser = require("body-parser");
const connectDB = require("./lib/dbconnect");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const scenarioRoutes = require("./routes/scenario");
const sessionRoutes = require("./routes/session");
const interviewRoutes = require("./routes/interview");

require("dotenv").config();
const app = express();
const port = process.env.DEV_PORT || 3000;

var cors = require("cors");

app.use(cors()); // Use this after the variable declaration

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Define authentication routes
app.use("/auth", authRoutes);

// Define user routes
app.use("/user", userRoutes);
app.use("/scenario", scenarioRoutes);
app.use("/session", sessionRoutes);
app.use("/interview", interviewRoutes);

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
