// routes.js
const express = require("express");
const router = express.Router();
const EmployeeService = require("./services"); // Adjust the path accordingly

// Define the login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  const result = await EmployeeService.login(email, password);

  if (result.success) {
    // Handle successful login, e.g., send a JWT token
    res.status(200).json({ message: result.message });
  } else {
    // Handle login failure
    res.status(401).json({ message: result.message });
  }
});

// Route to fetch all employee records
router.get("/", async (req, res) => {
  const result = await EmployeeService.getAllEmployees();
  //   if (result.success) {
  //     res.status(200).json({ message: result.message });
  //   } else {
  //     res.status(401).json({ message: result.message });
  //   }
  res.status(result.success ? 200 : 401).json(result);
});

// Route to filter employee records
router.post("/filter", async (req, res) => {
  const { field, value } = req.body;
  const result = await EmployeeService.filterEmployees(field, value);
  //   if (result.success) {
  //     res.status(200).json({ message: result.message });
  //   } else {
  //     res.status(401).json({ message: result.message });
  //   }
  res.status(result.success ? 200 : 401).json(result);
});

module.exports = router;
