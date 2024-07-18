const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function processInteraction(questionText, userAnswerText) {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		// Starting the chat with the model, including previous chat history
		const chat = model.startChat({
			// history: interviewSession.chatHistory,
			generationConfig: {
				maxOutputTokens: 1000,
			},
		});

		const prompt = `Question:${questionText}, UserAnswerText: ${userAnswerText}
0. Make sure there are no extra spaces and keep the lowercase and uppercase very carefully.
1. Clean the Question of any escape sequence, illegal characters.
2. Categorise the Question into a Category from these options : [behavioral,situational,technical] only.
3. Categories the Question difficulty from these options : [easy, medium, hard]
4. Categories the stage of the question from following options : [greeting, warm-up,rapid-fire,conclusive]
5. From Answer Text, identify the language spoken, in "en-US" or "en-IN" type format.
6. categorise 5 most frequently used words from the answer text with their frequency
7. generate an ideal response to the question.
8. generate a feedback on the userAnswer text to the given question.
9. generat a rating out of 5 to the userAnswer, on how it stands against the ideal answer.

my data should conform to the following schema : 

"question": {
	questionText: { type: String, required: true },
	questionCategory: { type: String, required: true },
	questionDifficulty: { type: String, required: true },
	stage: { type: String, required: true },
},
"answer": {
		"text": { type: String, required: true },
		"language": { type: String, required: true },
		"wordFrequency": { type: Map, of: Number, required: true },
	},

"feedback": {
	idealResponse: { type: String, required: true },
	feedbackText: { type: String, required: true },
	rating: { type: Number, required: true },
}

Give me a response as a Pure JSON Object. Do not include back ticks and json in the start and end.
`;

		const result = await chat.sendMessage(prompt);
		const response = await result.response;
		const text = response.text();
		return text;
	} catch (error) {
		console.error("Error processing interaction:", error);
		throw new Error("Failed to process interaction");
	}
}
module.exports = processInteraction;
