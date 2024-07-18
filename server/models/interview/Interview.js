const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
	questionText: { type: String, required: true },
	questionCategory: { type: String, required: true },
	questionDifficulty: { type: String, required: true },
	stage: { type: String, required: true },
	// rating: [],
});

const responseSchema = new mongoose.Schema(
	{
		text: { type: String, required: true },
		language: { type: String, required: true },
		wordFrequency: { type: Map, of: Number, required: true },
	},
	{ timestamps: true }
);

const feedbackSchema = new mongoose.Schema({
	idealResponse: { type: String, required: true },
	feedbackText: { type: String, required: true },
	rating: { type: Number, required: true },
});

module.exports = { questionSchema, responseSchema, feedbackSchema };
module.exports.questionSchema = questionSchema;
module.exports.responseSchema = responseSchema;
module.exports.feedbackSchema = feedbackSchema;
