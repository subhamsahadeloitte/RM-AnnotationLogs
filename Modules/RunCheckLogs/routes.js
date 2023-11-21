const express = require("express");
const router = express.Router();
const runCheckLogService = require("./services");

// Create new log
router.post("/", async (req, res) => {
  const result = await runCheckLogService.createLog(req.body);
  res.status(result.success ? 200 : 401).json(result);
});

module.exports = router;
