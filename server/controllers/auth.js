const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const VCode = require("../models/VerificationCode");

// Register a new user
const register = async (req, res, next) => {
	const { username, email, password } = req.body;

	try {
		const existingUser = await User.findOne({ $or: [{ username }, { email }] });
		if (existingUser) {
			return res
				.status(409)
				.json({ message: "Username or email already in use" });
		}

		const user = new User({ username, email, password: password });
		await user.save();

		const verificationCode = new VCode({
			email: user.email,
			code: user.generateCode(),
		});

		await verificationCode.save();

		res.json({ message: "Registration successful, Verify your email address" });
	} catch (error) {
		next(error);
	}
};

// Login with an existing user
const login = async (req, res, next) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const passwordMatch = await user.comparePassword(password);
		if (!passwordMatch) {
			return res.status(401).json({ message: "Password do not match" });
		}

		const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
			expiresIn: "1 hour",
		});
		res.json({ token });
	} catch (error) {
		next(error);
	}
};

/**
 * Verify email address with a provided verification code.
 * @param {Object} req - The request object containing `email` and `code` fields.
 * @param {Object} res - The response object to send back the result.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>}
 */
const verifyEmail = async (req, res, next) => {
	const { email, code } = req.body;
	try {
		// Find the user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if the user is already verified
		if (user.isVerified) {
			return res.status(400).json({ message: "Email already verified" });
		}

		// Find the verification code associated with the user
		const verificationCode = await VCode.findOne({
			email: user.email,
		});

		if (!verificationCode) {
			return res.status(400).json({ message: "No verification code found" });
		}

		// Verify the provided code
		if (verificationCode.verifyCodes(code)) {
			// Update user's verification status
			user.isVerified = true;
			await user.save();
			res.json({ message: "Email verification successful" });
		} else {
			res.status(400).json({ message: "Invalid verification code" });
		}
	} catch (error) {
		next(error); // Pass any caught errors to the error handling middleware
	}
};

module.exports = { register, login, verifyEmail };
