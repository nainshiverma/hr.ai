import axios from "axios";

export const listScenarios = async (userId) => {
	try {
		const config = {
			method: "get",
			maxBodyLength: Infinity,
			url: `${import.meta.env.VITE_BACKEND_URI}/scenario?userId=${userId}`,
			headers: {},
		};
		const response = await axios.request(config);
		return response.data;
	} catch (error) {
		console.error("Error listing scenarios:", error);
		throw error;
	}
};

export const createScenario = async (obj) => {
	try {
		let data = JSON.stringify(obj);

		const config = {
			method: "post",
			maxBodyLength: Infinity,
			url: `${import.meta.env.VITE_BACKEND_URI}/scenario`,
			headers: {
				"Content-Type": "application/json",
			},
			data: data,
		};

		const response = await axios.request(config);
		return response.data;
	} catch (error) {
		console.error("Error creating scenario:", error);
		throw error;
	}
};

export const updateScenario = async (id, updatedData) => {
	try {
		let data = JSON.stringify(updatedData);

		const config = {
			method: "patch",
			maxBodyLength: Infinity,
			url: `${import.meta.env.VITE_BACKEND_URI}/scenario/${id}`,
			headers: {
				"Content-Type": "application/json",
			},
			data: data,
		};

		const response = await axios.request(config);
		return response.data;
	} catch (error) {
		console.error("Error updating scenario:", error);
		throw error;
	}
};

export const deleteScenario = async (id) => {
	try {
		const config = {
			method: "delete",
			maxBodyLength: Infinity,
			url: `${import.meta.env.VITE_BACKEND_URI}/scenario/${id}`,
			headers: {},
		};

		const response = await axios.request(config);
		return response.data;
	} catch (error) {
		console.error("Error deleting scenario:", error);
		throw error;
	}
};
