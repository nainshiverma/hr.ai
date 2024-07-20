const { z } = require("zod");
const mongoose = require("mongoose");
// Define the Zod schema for validation
const newJobScenarioSchema = z.object({
	body: z.object({
		userId: z
			.string()
			.min(1, "UserId is required")
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

const listScenariosSchema = z.object({
	query: z.object({
		userId: z
			.string()
			.min(1, "User is required")
			.refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid User ID"),
	}),
});

const getScenarioSchema = z.object({
	params: z.object({
		scenarioId: z
			.string()
			.min(1, "Scenario is Empty")
			.refine(
				(val) => mongoose.Types.ObjectId.isValid(val),
				"Invalid scenarioId"
			),
	}),
});

module.exports = {
	newJobScenarioSchema,
	listScenariosSchema,
	getScenarioSchema,
};
