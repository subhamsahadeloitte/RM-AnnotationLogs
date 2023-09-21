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
    console.log("error");
  }
});

router.get("/", (req, res) => {
  res.status(200).json({ message: "This is the login module" });
});

module.exports = router;
