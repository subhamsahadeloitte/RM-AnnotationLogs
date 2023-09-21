const express = require("express");
const router = express.Router();

// Import routes from modules
const employeeRoutes = require("./Modules/Employee/routes");
const availabilityRoutes = require("./Modules/Availability/routes");
const issuesRoutes = require("./Modules/Issues/routes");
const annotationsRoutes = require("./Modules/Annotations/routes");

// Use the routes from modules
router.use("/employee", employeeRoutes);
// router.use("/availability", availabilityRoutes);
// router.use("/issues", issuesRoutes);
router.use("/annotations", annotationsRoutes);

module.exports = router;
