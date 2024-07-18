const express = require("express");
const { validate } = require("../middlewares/validateSchema");
const {
	createJobScenario,
	listJobScenarios,
	getJobScenario,
} = require("../controllers/scenario");
const router = express.Router();

const {
	newJobScenarioSchema,
	listJobScenariosSchema,
} = require("../schemas/jobSchema");
const {
	getJobScenarioByUserById,
} = require("../schemas/interviewSessionSchema");

router.post("/", validate(newJobScenarioSchema), createJobScenario);
router.get("/", validate(listJobScenariosSchema), listJobScenarios);
router.get("/api", validate(getJobScenarioByUserById), getJobScenario);
module.exports = router;
