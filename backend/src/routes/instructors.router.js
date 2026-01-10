const express = require("express");
const router = express.Router();
const instructorController = require("../controllers/instructor.controller");

router.get("/", instructorController.getInstructors);
router.get("/:id", instructorController.getInstructorById);
router.post("/", instructorController.createInstructor);
router.put("/:id", instructorController.updateInstructor);
router.delete("/:id", instructorController.deleteInstructor);

module.exports = router;
