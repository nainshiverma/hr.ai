const { z } = require("zod");

// Zod schema for Question
const questionSchema = z.object({
	questionText: z.string().min(1, { message: "Question text is required" }),
	questionCategory: z
		.string()
		.min(1, { message: "Question category is required" }),
	questionDifficulty: z
		.string()
		.min(1, { message: "Question difficulty is required" }),
	stage: z.string(),
});

// Zod schema for Answer
const responseSchema = z.object({
	speech: z.string().url({ message: "Speech must be a valid URL" }),
	text: z.string().min(1, { message: "Text is required" }),
	language: z.string().min(1, { message: "Language is required" }),
	wordFrequency: z.record(
		z
			.number()
			.min(0, { message: "Word frequency must be a non-negative number" })
	),
});

// Zod schema for Feedback
const feedbackSchema = z.object({
	question: questionSchema,
	answer: responseSchema,
	idealResponse: z.string().min(1, { message: "Ideal response is required" }),
	feedbackText: z.string().min(1, { message: "Feedback text is required" }),
	rating: z
		.number()
		.min(1, { message: "Rating must be at least 1" })
		.max(5, { message: "Rating must be at most 5" }),
});

module.exports = {
	questionSchema,
	responseSchema,
	feedbackSchema,
};
