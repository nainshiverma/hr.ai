const mongoose = require("mongoose");

const {
	questionSchema,
	responseSchema,
	feedbackSchema,
} = require("./Interview");

const interactionSchema = new mongoose.Schema({
	question: { type: questionSchema, required: true },
	answer: { type: responseSchema, required: true },
	feedback: { type: feedbackSchema, required: true },
});

// Define the Mongoose schema
const interviewSessionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: [true, "User ID is required"],
			ref: "User",
		},
		jobScenarioId: {
			type: mongoose.Schema.Types.ObjectId,
			required: [true, "Job Scenario ID is required"],
			ref: "JobScenario",
		},
		interviewerId: {
			type: mongoose.Schema.Types.ObjectId,
			required: [true, "Interviewer ID is required"],
			ref: "User",
		},
		chatHistory: {
			required: [false],
			type: Array,
		},
		interactions: { type: [interactionSchema], required: true },
		status: {
			type: String,
			enum: ["pending", "ongoing", "completed"],
			default: "pending",
		},
	},
	{
		timestamps: true,
	}
);

// Create the model
const InterviewSession = mongoose.model(
	"InterviewSession",
	interviewSessionSchema
);

module.exports = InterviewSession;
module.exports.interviewSessionSchema = interviewSessionSchema;
