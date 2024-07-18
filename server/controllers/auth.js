const sign = require("jsonwebtoken");
const User = require("../models/User");

const VCode = require("../models/VerificationCode");

const sendVerificationEmail = require("../helpers/sendVerificationEmail");

const { OAuth2Client } = require("google-auth-library");

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
		const emailResponse = await sendVerificationEmail(
			email,
			username,
			verifyCode
		);
		console.log(emailResponse);

		if (!emailResponse.success) {
			return Response.json(
				{ message: "Error Sending Emails" },
				{ status: 500 }
			);
		}

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

		const token = sign.sign({ userId: user._id }, process.env.SECRET_KEY, {
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
			//!TODO Add a feature where the OTP is deleted after verification is done.
		} else {
			res.status(400).json({ message: "Invalid verification code" });
		}
	} catch (error) {
		next(error); // Pass any caught errors to the error handling middleware
	}
};

const googleLogin = async (req, res, next) => {
	const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
	const { token } = req.body;
	try {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});
		const { sub, email, name, picture } = ticket.getPayload();

		let user = await findOne({ googleId: sub });
		if (!user) {
			user = new User({
				googleId: sub,
				username: user.generateUsername(),
				email,
				password: user.generatePassword(),
				role: "user",
				avatar: picture,
				isVerified: true,
			});
			await user.save();
		}

		res.status(200).json({ message: "User registered successfully", user });
	} catch (error) {
		console.error("Error verifying Google token:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const decodeToken = async (req, res, next) => {
	const { token } = req.body;
	if (!token) {
		return res.status(400).json({ error: "Token is required" });
	}
	const SECRET_KEY = process.env.SECRET_KEY; // Use environment variables to store your secret key
	try {
		const decoded = sign.verify(token, SECRET_KEY);
		return res.status(201).json({ userId: decoded.userId });
	} catch (error) {
		return { userId: null, error: "Invalid token" };
	}
};

module.exports = { register, login, verifyEmail, googleLogin, decodeToken };
