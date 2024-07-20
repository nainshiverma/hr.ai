const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JobScenario = require("./JobScenario");
const { jobScenarioSchema } = require("./JobScenario");
const { interviewSessionSchema } = require("./interview/InterviewSession");
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		isVerified: {
			type: Boolean,
			default: false,
		},

		jobScenarios: {
			type: [jobScenarioSchema],
		},

		interviewSessions: {
			type: [interviewSessionSchema],
		},
	},
	{ timestamps: true }
);

/**
 * Pre-save hook to hash the password before saving it to the database.
 * This hook only runs if the password field is modified.
 */
userSchema.pre("save", async function (next) {
	const user = this;
	if (!user.isModified("password")) return next();

	try {
		const salt = 10; // Number of salt rounds
		user.password = await bcrypt.hash(user.password, salt);
		next();
	} catch (error) {
		return next(error);
	}
});

/**
 * Method to compare a given password with the hashed password stored in the database.
 * @param {string} password - The plain text password to compare.
 * @returns {Promise<boolean>} - Returns true if the passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (password) {
	try {
		return await bcrypt.compare(password, this.password);
	} catch (error) {
		throw new Error("Error comparing passwords");
	}
};

/**
 * Method to generate a 6-digit verification code and store it in the document.
 * @returns {string} - The generated verification code.
 */
userSchema.methods.generateCode = function () {
	try {
		const code = Math.floor(100000 + Math.random() * 900000).toString();
		this.code = code;
		return code;
	} catch (error) {
		throw new Error("Error generating verification code");
	}
};

const User = mongoose.model("User", userSchema);

module.exports = User;
