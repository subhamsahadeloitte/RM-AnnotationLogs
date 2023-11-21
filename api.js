const express = require("express");
const router = express.Router();

// Import routes from modules
const employeeRoutes = require("./Modules/Employee/routes");
const runCheckLogsRoutes = require("./Modules/RunCheckLogs/routes");
const annotationsRoutes = require("./Modules/Annotations/routes");

// Use the routes from modules
router.use("/employee", employeeRoutes);
router.use("/runCheckLogs", runCheckLogsRoutes);
router.use("/annotations", annotationsRoutes);

module.exports = router;
