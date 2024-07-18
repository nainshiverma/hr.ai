const { z } = require("zod");
const mongoose = require("mongoose");
// Define the Zod schema for validation
const newJobScenarioSchema = z.object({
	body: z.object({
		user: z
			.string()
			.min(1, "User is required")
			.refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid User ID"),
		jobTitle: z.string().min(1, "Job Title is required"),
		jobDescription: z.string().min(1, "Job Description is required"),
		experience: z
			.number()
			.nonnegative("Experience in years must be a non-negative number"),
		company: z.string().min(1, "Company is required"),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
	}),
});

const listJobScenariosSchema = z.object({
	query: z.object({
		user: z
			.string()
			.min(1, "User is required")
			.refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid User ID"),
	}),
});

module.exports = {
	newJobScenarioSchema,
	listJobScenariosSchema,
};
