const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
// Define the Mongoose schema

const jobScenarioSchema = new mongoose.Schema(
	{
		jobTitle: {
			type: String,
			required: [true, "Job Title is required"],
			trim: true,
		},
		jobDescription: {
			type: String,
			required: [true, "Job Description is required"],
			trim: true,
		},
		experience: {
			type: Number,
			required: [true, "Experience is required"],
			min: [0, "Experience in years must be a non-negative number"],
		},
		company: {
			type: String,
			required: [true, "Company is required"],
			trim: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

const JobScenario = mongoose.model("JobScenario", jobScenarioSchema);

module.exports = JobScenario;
module.exports.jobScenarioSchema = jobScenarioSchema;
