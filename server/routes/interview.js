const express = require("express");
const { validate } = require("../middlewares/validateSchema");
const {
	createNewSession,
	listInterviewSession,
	fetchInterview,
    	listInterviewsByUser,
    	countInterviewsByUserID,
} = require("../controllers/interview");
const router = express.Router();

const {
	newInterviewSessionSchema,
	listInterviewSessionSchema,
} = require("../schemas/interviewSessionSchema");
//TODO: Add Zod Validation to all of these Requests

router.post("/", createNewSession);
router.get("/", validate(listInterviewSessionSchema), listInterviewSession);
router.get("/:interviewID", fetchInterview);
router.get("/user/:interviews", listInterviewsByUser);
router.get("/user/:countinterview", countInterviewsByUserID)
router.get("/report");
module.exports = router;
