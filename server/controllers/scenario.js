var mongoose = require("mongoose");
const JobScenario = require("../models/JobScenario");
const User = require("../models/User");
const ObjectId = require("mongodb").ObjectId;
User;

// Function to create a new JobScenario
const createScenario = async (req, res, next) => {
	try {
		const { userId, jobTitle, jobDescription, experience, company } = req.body;

		// Create a new JobScenario instance
		const jobScenario = new JobScenario({
			userId: userId,
			jobTitle: jobTitle,
			jobDescription: jobDescription,
			experience: experience,
			company: company,
		});

		await jobScenario.save();

		// Respond with the created JobScenario
		res.status(201).json(jobScenario);
	} catch (error) {
		next(error);
		res.status(400).json({ message: error.message });
	}
};

// Function to list all JobScenarios created by a specific user
const listScenarios = async (req, res, next) => {
	const { userId } = req.query;
	try {
		// Use aggregation pipeline to find all JobScenarios by userId
		const uid = new mongoose.Types.ObjectId(userId);
		const jobScenarios = await JobScenario.aggregate([
			{
				$match: {
					userId: uid,
				},
			},
		]);
		// Check if jobScenarios were found
		if (!jobScenarios.length) {
			return res
				.status(404)
				.json({ message: "No job scenarios found for this user." });
		}

		res.status(200).json(jobScenarios);
	} catch (error) {
		console.error(error);
		next(error);
		res
			.status(500)
			.json({ message: "An error occurred while retrieving job scenarios." });
	}
};


const listSessions = async (req, res, next) => {
    const { userId } = req.query;

    try {
       
        const uid = new mongoose.Types.ObjectId(userId);
		// Aggregate pipeline to count sessions by userId
        const sessionCount = await JobScenario.aggregate([
            {
                $match: {
                    userId: uid,
                },
            },
            {
                $group: {
                    _id: null,
                    totalSessions: { $sum: 1 }
                }
            }
        ]);

        // Check if sessionCount is not empty
        if (sessionCount.length === 0) {
            return res.status(404).json({ message: "No sessions found for this user." });
        }

        // Return the total number of sessions
        res.status(200).json({ totalSessions: sessionCount[0].totalSessions });

    } catch (error) {
        console.error(error);
        next(error);
        res.status(500).json({ message: "An error occurred while retrieving sessions." });
    }
};

/**
 * @desc Fetches a specific JobScenario object by userId and jobScenarioId
 * @param {object} req - Express request object containing userId and jobScenarioId in params
 * @param {object} res - Express response object
 * @param {function} next - Express next function for error handling
 */
const getScenario = async (req, res, next) => {
	const { scenarioId } = req.params;
	try {
		// Validate jobScenarioId
		if (!mongoose.Types.ObjectId.isValid(scenarioId)) {
			return res.status(400).json({ message: "Invalid scenarioId" });
		}

		// Find the JobScenario by its id
		const scenario = await JobScenario.findById(scenarioId);

		if (!scenario) {
			return res.status(404).json({ message: "Scenario not found" });
		}

		// Respond with the jobScenario object
		res.status(200).json(scenario);
	} catch (error) {
		console.error("Error fetching jobScenario:", error);
		next(error);
		res.status(500).json({ message: "Failed to fetch jobScenario" });
	}
};

const updateScenario = async (req, res, next) => {
	try {
		const { scenarioId } = req.params; // Get the scenarioId from the request parameters
		const { jobTitle, jobDescription, experience, company } = req.body; // Get the updatable fields from the request body

		// Find the scenario by ID and update the provided fields
		const updatedScenario = await JobScenario.findByIdAndUpdate(
			scenarioId,
			{ jobTitle, jobDescription, experience, company },
			{ new: true, runValidators: true } // Return the updated document and run validators
		);

		if (!updatedScenario) {
			return res.status(404).json({ message: "Scenario not found" });
		}

		res.status(200).json(updatedScenario); // Send the updated scenario in the response
	} catch (error) {
		next(error); // Pass errors to the error handling middleware
	}
};

const deleteScenario = async (req, res, next) => {
	try {
		const { scenarioId } = req.params; // Get the scenarioId from the request parameters

		// Find the scenario by ID and delete it
		const deletedScenario = await JobScenario.findByIdAndDelete(scenarioId);

		if (!deletedScenario) {
			return res.status(404).json({ message: "Scenario not found" });
		}

		res.status(200).json({ message: "Scenario deleted successfully" }); // Send a success message in the response
	} catch (error) {
		next(error); // Pass errors to the error handling middleware
	}
};

module.exports = {
	createScenario,
	listScenarios,
	getScenario,
	updateScenario,
	deleteScenario,
	listSessions
};
