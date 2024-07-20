const sign = require("jsonwebtoken");
const User = require("../models/User");

const VCode = require("../models/VerificationCode");

const Email = require("../helpers/sendVerificationEmail");

const { OAuth2Client } = require("google-auth-library");

// Register a new user
const register = async (req, res, next) => {
	const { firstName, lastName, username, email, password } = req.body;

	try {
		const existingUser = await User.findOne({ $or: [{ username }, { email }] });
		if (existingUser) {
			return res
				.status(409)
				.json({ message: "Username or email already in use" });
		}

		const user = new User({
			firstName,
			lastName,
			username,
			email,
			password: password,
		});
		await user.save();

		const verifyCode = user.generateCode();
		const verificationCode = new VCode({
			email: user.email,
			code: verifyCode,
		});

		await verificationCode.save();
		const emailResponse = await Email(email, firstName, verifyCode);

		console.log(emailResponse);

		if (!emailResponse.success) {
			return Response.json(
				{ message: "Error Sending Emails" },
				{ status: 500 }
			);
		}

		res.json({ username: username });
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

		if (!user.isVerified) {
			return res.status(403).json({ message: "User not verified" });
		}

		const passwordMatch = await user.comparePassword(password);
		if (!passwordMatch) {
			return res.status(401).json({ message: "Password do not match" });
		}

		const token = sign.sign(
			{ userId: user._id, first: user.firstName },
			process.env.SECRET_KEY,
			{
				expiresIn: "1 hour",
			}
		);
		res.json({ token });
	} catch (error) {
		next(error);
	}
};

const checkUsername = async (req, res, next) => {
	const { username } = req.params;
	try {
		const existingUser = await User.findOne({ username });
		if (!existingUser) {
			return res.status(200).json({ status: true });
		}
		return res.status(200).json({ status: false });
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
			return res.status(404).json({ message: `${email} does not exists` });
		}

		// Check if the user is already verified
		if (user.isVerified) {
			return res.status(400).json({ message: "Email already Verified" });
		}

		// Find the verification code associated with the user
		const verificationCode = await VCode.findOne({
			email: user.email,
		});

		if (!verificationCode) {
			return res.status(400).json({ message: "Code Expired" });
		}

		// Verify the provided code
		if (verificationCode.verifyCode(code)) {
			// Update user's verification status
			user.isVerified = true;
			await user.save();
			res.status(200).json({ message: "Email Verification Successful" });
			//!TODO Add a feature where the OTP is deleted after verification is done.
		} else {
			res.status(400).json({ message: "Verification Code is Invalid" });
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

module.exports = {
	register,
	login,
	verifyEmail,
	googleLogin,
	decodeToken,
	checkUsername,
};
