const express = require("express");
const { register, login, verifyEmail } = require("../controllers/auth");
const {
	registerSchema,
	loginSchema,
	verifyEmailSchema,
} = require("../schemas/authSchema");

const { validate } = require("../middlewares/validateSchema");
const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/verify", validate(verifyEmailSchema), verifyEmail);

module.exports = router;
