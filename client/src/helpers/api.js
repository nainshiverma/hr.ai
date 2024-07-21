import axios from "axios";

export const getUserId = async (token) => {
	try {
		let data = JSON.stringify({
			token: token,
		});
		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: `${import.meta.env.VITE_BACKEND_URI}/auth/decode-token`,
			headers: {
				"Content-Type": "application/json",
			},
			data: data,
		};

		axios
			.request(config)
			.then((response) => {
				localStorage.setItem("_id", response.data.userId);
			})
			.catch((error) => {
				console.error("Error decoding token:", error);
				return null;
			});
	} catch (error) {
		console.error("Error decoding token:", error);
		return null;
	}
};

export const fetchNextQuestion = async (userId, jobScenarioId) => {
	try {
		// Fetch jobScenario object from your server
		const response = await axios.get(
			`${
				import.meta.env.VITE_BACKEND_URI
			}/scenario/api?userId=${userId}&jobScenarioId=${jobScenarioId}`
		);
		if (response.status !== 200) {
			throw new Error("Failed to fetch job scenario");
		}
		const jobScenario = response.data;

		// Now fetch the question using jobScenario object
		let data = JSON.stringify(jobScenario);

		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: `${import.meta.env.VITE_BACKEND_URI}/session/nextQuestion`,
			headers: {
				"Content-Type": "application/json",
			},
			data: data,
		};

		const nextQuestionResponse = await axios.request(config);

		if (nextQuestionResponse.status !== 200) {
			throw new Error("Failed to fetch next question");
		}

		return nextQuestionResponse.data;
	} catch (error) {
		console.error("Error fetching next question:", error);
		return null;
	}
};
/*
 * Function to fetch interview session data based on userId and interviewSessionId.
 * @param {string} userId - The ID of the user.
 * @param {string} interviewSessionId - The ID of the interview session.
 * @returns {Promise<Object|null>} - The interview session data or null if an error occurs.
 */
export const fetchInterviewSessionData = async (userId, interviewSessionId) => {
	try {
		const config = {
			method: "get",
			maxBodyLength: Infinity,
			url: `${
				import.meta.env.VITE_BACKEND_URI
			}/session?userId=${userId}&interviewSessionId=${interviewSessionId}`,
			headers: {},
		};

		const response = await axios.request(config);

		if (response.status !== 200) {
			throw new Error(
				`Failed to fetch interview session data. Status: ${response.status}`
			);
		}

		return response.data;
	} catch (error) {
		console.error("Error fetching interview session data:", error);
		return null;
	}
};

// Function to extract interviewSessionId from URL
export const extractInterviewSessionId = (url) => {
	try {
		const urlSearchParams = new URLSearchParams(url.split("?")[1]);
		const interviewSessionId = urlSearchParams.get("interviewSessionId");
		return interviewSessionId;
	} catch (error) {
		console.error("Error extracting interviewSessionId:", error);
		return null;
	}
};

export const callIssueInteractionProcessing = async (
	userId,
	interviewSessionId,
	questionText,
	userAnswerText
) => {
	try {
		let data = JSON.stringify({
			userId: userId,
			interviewSessionId: interviewSessionId,
			questionText: questionText,
			userAnswerText: userAnswerText,
		});

		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: `${import.meta.env.VITE_BACKEND_URI}/session/captureInteraction`,
			headers: {
				"Content-Type": "application/json",
			},
			data: data,
		};

		axios
			.request(config)
			.then((response) => {
				return response;
			})
			.catch((error) => {
				console.log(error);
			});
	} catch (err) {
		console.log(err);
	}
};
