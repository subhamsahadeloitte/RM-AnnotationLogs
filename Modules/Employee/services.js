// services.js
const Employee = require("../../Models/Employee"); // Import the Employee model

// Function to handle employee login
async function login(email, password) {
  try {
    // Find the employee by email
    const employee = await Employee.findOne({ annotatorEmail: email });

    if (!employee) {
      // throw new Error("Employee not found");
      return { success: false, message: "Employee not found" };
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await employee.comparePassword(password);

    if (!isPasswordValid) {
      //   throw new Error("Invalid password");
      return { success: false, message: "Invalid password" };
    }

    // You can generate a JWT token here for authentication if needed

    return { success: true, message: "Login successful" };
  } catch (error) {
    console.log({ error });
    return { success: false, message: "Internal Server Error", error };
  }
}

// Function to get all employee records
async function getAllEmployees() {
  try {
    const employees = await Employee.find();
    if (employees) {
      return { success: true, message: employees };
    } else {
      return { success: false, message: "Something went wrong" };
    }
  } catch (error) {
    return { success: false, message: "Internal Server Error", error };
  }
}

// Function to filter employee records by a field and its value
async function filterEmployees(field, value) {
  try {
    const query = {};
    query[field] = value;
    const filteredEmployees = await Employee.find(query);
    if (filteredEmployees) {
      return { success: true, message: filteredEmployees };
    } else {
      return { success: false, message: "Something went wrong" };
    }
  } catch (error) {
    return { success: false, message: "Internal Server Error", error };
  }
}

module.exports = {
  login,
  getAllEmployees,
  filterEmployees,
};
