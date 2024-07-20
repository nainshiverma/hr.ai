const { z } = require("zod");
const mongoose = require("mongoose");

// Define a custom validation function for ObjectId
const isValidObjectId = (val) => mongoose.Types.ObjectId.isValid(val);

// Define the Zod schema for validation
const newInterviewSessionSchema = z.object({
	body: {
		userId: z
			.string()
			.min(1, "User ID is required")
			.refine(isValidObjectId, "Invalid User ID"),

		jobScenarioId: z
			.string()
			.min(1, "Job Scenario ID is required")
			.refine(isValidObjectId, "Invalid Job Scenario ID"),

		chatHistory: z.array(),

		status: z.enum(["pending", "ongoing", "completed"], "Invalid status"),

		interviewerId: z
			.string()
			.min(1, "Interviewer ID is required")
			.refine(isValidObjectId, "Invalid Interviewer ID"),
	},
});

const listInterviewSessionSchema = z.object({
	query: z.object({
		user: z
			.string()
			.min(1, "User is required")
			.refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid User ID"),
	}),
});

const getScenarioByUserById = z.object({
	query: z.object({
		userId: z
			.string()
			.min(1, "User is required")
			.refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid User ID"),
		jobScenarioId: z
			.string()
			.min(1, "Job Scenario ID is required")
			.refine(isValidObjectId, "Invalid Job Scenario ID"),
	}),
});

const interactionSchema = z.object({
	body: z.object({
		userId: z
			.string()
			.min(1, "User is required")
			.refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid User ID"),
		interviewSessionId: z
			.string()
			.min(1, "Job Scenario ID is required")
			.refine(isValidObjectId, "Invalid Interview Session ID"),
		questionText: z.string().min(1, "Question Text is required"),
		userAnswerText: z.string().min(1, "User Answer Text is required"),
	}),
});

const sessionDataSchema = z.object({
	query: z.object({
		userId: z.string().min(1, "User ID is required"),
		interviewSessionId: z.string().min(1, "Interview Session ID is required"),
	}),
});

module.exports = {
	newInterviewSessionSchema,
	listInterviewSessionSchema,
	getScenarioByUserById,
	interactionSchema,
	sessionDataSchema,
};
