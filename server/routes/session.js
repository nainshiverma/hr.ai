const express = require("express");
const { validate } = require("../middlewares/validateSchema");
const {
	issueNextQuestion,
	issueFeedback,
	issueComprehension,
	issueInteractionProcessing,
	issueSessionData,
} = require("../controllers/session");
const router = express.Router();

//TODO: Integrate Authentication for these routes and next them to api routes

const {
	newInterviewSessionSchema,
	interactionSchema,
	sessionDataSchema,
} = require("../schemas/interviewSessionSchema");
//TODO: Add Zod Validation to all of these Requests

router.post("/nextQuestion", issueNextQuestion);
router.post("/responseFeedback", issueFeedback);
// router.post("/comprehend", issueComprehension);
router.post(
	"/captureInteraction",
	validate(interactionSchema),
	issueInteractionProcessing
);
router.get("", validate(sessionDataSchema), issueSessionData);
module.exports = router;
