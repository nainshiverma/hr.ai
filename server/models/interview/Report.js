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
const sessionReportSchema = new mongoose.Schema({
	interviewSessionId: { type: mongoose.Schema.Types.ObjectId, required: true },
	interactions: { type: [interactionSchema], required: true },
	interviewFeedback: {
		sessionScore: { type: Number, required: true },
		sessionSummary: { type: String, required: true },
		sessionFeedback: { type: String, required: true },
	},
});

const SessionReport = mongoose.model("SessionReport", sessionReportSchema);

module.exports = SessionReport;
module.exports.sessionReportSchema = sessionReportSchema;
