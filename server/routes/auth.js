const express = require("express");
const { register, login } = require("../controllers/auth");
const { registerSchema, loginSchema } = require("../schemas/authSchema");
const { validate } = require("../middlewares/validateSchema");
const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

module.exports = router;
