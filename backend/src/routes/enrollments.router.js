const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollment.controller");

router.get("/", enrollmentController.getEnrollments);
router.get("/:student_id/:course_id", enrollmentController.getEnrollmentById);
router.post("/", enrollmentController.createEnrollment);
router.put("/:student_id/:course_id", enrollmentController.updateEnrollment);
router.delete("/:student_id/:course_id", enrollmentController.deleteEnrollment);

module.exports = router;
