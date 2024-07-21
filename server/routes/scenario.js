const express = require("express");
const { validate } = require("../middlewares/validateSchema");
const {
	createScenario,
	listScenarios,
	getScenario,
	updateScenario,
	deleteScenario,
	listSessions,
} = require("../controllers/scenario");
const router = express.Router();

const {
	newJobScenarioSchema,
	listScenariosSchema,
	getScenarioSchema,
} = require("../schemas/scenarioSchema");
const { getScenarioByUserById } = require("../schemas/interviewSessionSchema");

router.post("/", validate(newJobScenarioSchema), createScenario);
router.get("/:scenarioId", validate(getScenarioSchema), getScenario);
router.get("/", validate(listScenariosSchema), listScenarios);
router.get("/:listSession", listSessions);
router.patch("/:scenarioId", updateScenario);
router.delete("/:scenarioId", deleteScenario);

module.exports = router;
