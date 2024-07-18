const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
	questionSchema,
	responseSchema,
	feedbackSchema,
} = require("../../../models/interview/Interview");
require("dotenv").config();

//TODO: Wrap this function using gemini helper to remove redudency of passing gemini keys in the code.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateFeedback(req, res) {
	try {
		const { question, answer } = req.body;

		// Validate the question and answer using Zod schemas
		// questionSchema.parse(question); // Validate the question part of the request
		// responseSchema.parse(answer); // Validate the answer part of the request

		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const chat = model.startChat({
			history: [
				{
					role: "user",
					parts: [{ text: `Question: ${question.questionText}` }],
				},
				{
					role: "user",
					parts: [{ text: `Answer: ${answer.text}` }],
				},
			],
			generationConfig: {
				maxOutputTokens: 200,
			},
		});

		const prompt = `Provide detailed feedback on the following question and answer pair:
    Question: ${question.questionText} Answer: ${answer.text}`;

		const result = await chat.sendMessage(prompt);
		const response = await result.response;
		const feedbackText = response.text();

		// Mock rating and ideal response for demonstration purposes
		const rating = 4;
		const idealResponse =
			"An ideal response would include more details on XYZ aspects.";

		const feedback = {
			question,
			answer,
			idealResponse,
			feedbackText,
			rating,
		};

		// feedbackSchema.parse(feedback);

		res.status(200).json(feedback);
	} catch (error) {
		console.error("Error generating feedback:", error);
		res.status(500).json({ error: "Failed to generate feedback" });
	}
}

module.exports = generateFeedback;
