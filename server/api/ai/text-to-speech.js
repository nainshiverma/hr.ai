const TextToSpeech = require("@google-cloud/text-to-speech");

// Create a new instance of Text-to-Speech client
const client = new TextToSpeech.TextToSpeechClient();

async function textToSpeech({
	text,
	languageCode = "en-US",
	voiceName = "en-US-Wavenet-D",
	audioEncoding = "MP3",
	ssmlGender = "NEUTRAL",
}) {
	if (!text) {
		throw new Error("Text cannot be empty");
	}

	// Construct the request payload for the API
	const request = {
		input: { text },
		voice: {
			languageCode,
			name: voiceName,
			ssmlGender,
		},
		audioConfig: {
			audioEncoding,
		},
	};

	try {
		// Make the API call to synthesize the provided text
		const [response] = await client.synthesizeSpeech(request);

		// Convert the audio content to a base64-encoded string
		const audioContent = response.audioContent;
		const audioBase64 = Buffer.from(audioContent, "binary").toString("base64");

		return audioBase64;
	} catch (error) {
		console.error("Error converting text to speech:", error);
		throw new Error("Failed to convert text to speech");
	}
}

module.exports = textToSpeech;
