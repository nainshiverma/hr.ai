const JobScenario = require("../models/JobScenario");
const User = require("../models/User");
const ObjectId = require("mongodb").ObjectId;
User;

// Function to create a new JobScenario
const createJobScenario = async (req, res, next) => {
	try {
		const { user, jobTitle, jobDescription, experience, company } = req.body;

		// Create a new JobScenario instance
		const jobScenario = new JobScenario({
			user,
			jobTitle,
			jobDescription,
			experience,
			company,
		});

		// Find the user and add the jobScenario to their jobScenarios array
		const updatedUser = await User.findByIdAndUpdate(
			user,
			{ $push: { jobScenarios: jobScenario } },
			{ new: true, useFindAndModify: false }
		);

		if (!updatedUser) {
			return res.status(404).json({ message: "User not found." });
		}

		// Respond with the created JobScenario
		res.status(201).json(jobScenario);
	} catch (error) {
		next(error);
		res.status(400).json({ message: error.message });
	}
};

// Function to list all JobScenarios created by a specific user
const listJobScenarios = async (req, res, next) => {
	const id = req.query["user"];
	try {
		const user = await User.findById(id).select("jobScenarios");

		// Check if the user exists and has jobScenarios
		if (!user) {
			return res.status(404).json({ message: "User Not Found" });
		}
		if (!user.jobScenarios.length) {
			return res
				.status(404)
				.json({ message: "No job scenarios found for this user." });
		}
		res.status(200).json(user.jobScenarios);
	} catch (error) {
		console.error(error);
		next(error);
		res
			.status(500)
			.json({ message: "An error occurred while retrieving job scenarios." });
	}
};

/**
 * @desc Fetches a specific JobScenario object by userId and jobScenarioId
 * @param {object} req - Express request object containing userId and jobScenarioId in params
 * @param {object} res - Express response object
 * @param {function} next - Express next function for error handling
 */
const getJobScenario = async (req, res, next) => {
	const { userId, jobScenarioId } = req.query;
	try {
		// Validate userId and jobScenarioId
		if (!ObjectId.isValid(userId) || !ObjectId.isValid(jobScenarioId)) {
			return res
				.status(400)
				.json({ message: "Invalid userId or jobScenarioId" });
		}

		// Find the user and check if jobScenarioId exists in their jobScenarios
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const jobScenario = user.jobScenarios.find(
			(js) => js._id.toString() === jobScenarioId
		);

		if (!jobScenario) {
			return res
				.status(404)
				.json({ message: "JobScenario not found for this user" });
		}

		// Respond with the jobScenario object
		res.status(200).json(jobScenario);
	} catch (error) {
		console.error("Error fetching jobScenario:", error);
		next(error);
		res.status(500).json({ message: "Failed to fetch jobScenario" });
	}
};

module.exports = {
	createJobScenario,
	listJobScenarios,
	getJobScenario,
};
