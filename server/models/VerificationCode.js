const mongoose = require("mongoose");

const verificationCodeSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	code: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		expires: "10m", // Automatically delete documents after 10 minutes
		default: Date.now,
	},
});

/**
 * Method to verify the provided verification code against the stored code.
 * @param {string} code - The verification code to verify.
 * @returns {boolean} - Returns true if verification succeeds, false otherwise.
 */

verificationCodeSchema.methods.verifyCode = function (code) {
	try {
		return this.code === code;
	} catch (error) {
		throw new Error("Error verifying verification code");
	}
};

/**
 * Method to delete the verification code document from the database.
 * @returns {Promise<void>} - Returns a promise that resolves after deletion.
 */
verificationCodeSchema.methods.deleteCode = async function () {
	try {
		await this.delete();
	} catch (error) {
		throw new Error("Error deleting verification code");
	}
};

const VerificationCode = mongoose.model(
	"VerificationCode",
	verificationCodeSchema
);

module.exports = VerificationCode;
