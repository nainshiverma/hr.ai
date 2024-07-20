import axios from "axios";
import API_URI from "@/routes/route-api";
export const isUniqueUsername = async (username) => {
	try {
		console.log(API_URI.CHECK_USERNAME(username));
		const response = await axios.get(API_URI.CHECK_USERNAME(username));
		return response.data.status; // Ensure this returns a boolean
	} catch (error) {
		console.error("API Error:", error);
		throw error;
	}
};

export const registerUser = async (userData) => {
	const data = JSON.stringify({
		firstName: userData.firstName,
		lastName: userData.lastName,
		username: userData.username,
		email: userData.email,
		password: userData.password,
	});

	const config = {
		method: "post",
		maxBodyLength: Infinity,
		url: API_URI.REGISTER_USER,
		headers: {
			"Content-Type": "application/json",
		},
		data: data,
	};

	axios
		.request(config)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			console.error(error);
			throw error;
		});
};

export const verifyOTP = async (email, code) => {
	let data = JSON.stringify({
		email: email,
		code: code,
	});

	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: API_URI.VERIFY_OTP,
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
			console.error(error);
			throw error;
		});
};
