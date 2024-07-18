const InterviewSession = require("../models/interview/InterviewSession");
const User = require("../models/User");
/**
 * Controller function to create a new InterviewSession.
 *
 * @param {Object} req - Express request object containing userId, jobScenarioId, chatHistory, status, and interviewerId in the body.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with the created InterviewSession or error message.
 */
const createNewSession = async (req, res) => {
	try {
		const { userId, jobScenarioId, chatHistory, status, interviewerId } =
			req.body;

		// Create a new InterviewSession instance
		const interviewSession = new InterviewSession({
			userId,
			jobScenarioId,
			chatHistory,
			status,
			interviewerId,
		});

		// Find the user and add the interviewSession to their interviewSessions array
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ $push: { interviewSessions: interviewSession } },
			{ new: true, useFindAndModify: false }
		);

		if (!updatedUser) {
			return res.status(404).json({ message: "User not found." });
		}

		await interviewSession.save();

		// Respond with the created InterviewSession
		res.status(201).json(interviewSession);
	} catch (error) {
		// Handle validation errors or other exceptions
		console.error("Error creating InterviewSession:", error);
		let errorMessage = "Failed to create InterviewSession.";
		if (error.errors) {
			errorMessage = Object.values(error.errors)
				.map((err) => err.message)
				.join(", ");
		} else if (error.message) {
			errorMessage = error.message;
		}
		res.status(400).json({ error: errorMessage });
	}
};

// Function to list all InterviewSessions created by a specific user
const listInterviewSession = async (req, res, next) => {
	const id = req.query["user"];
	try {
		const user = await User.findById(id).select("interviewSessions");
		// Check if the user exists and has jobScenarios
		if (!user) {
			return res.status(404).json({ message: "User Not Found" });
		}
		if (!user.interviewSessions.length) {
			return res
				.status(404)
				.json({ message: "No Interview Session found for this user." });
		}
		res.status(200).json(user.interviewSessions);
	} catch (error) {
		console.error(error);
		next(error);
		res.status(500).json({
			message: "An error occurred while retrieving interview sessions.",
		});
	}
};

// const deleteSession = async (req, res) => {
// 	const { sessionId } = req.body;
// };

module.exports = {
	createNewSession,
	listInterviewSession,
};
