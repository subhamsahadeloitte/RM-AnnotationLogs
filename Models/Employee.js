const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  annotatorEmail: {
    type: String,
    required: true,
    unique: true,
  },
  annotatorName: {
    type: String,
    required: true,
    unique: true,
  },
  annotatorRole: {
    type: String,
    required: true,
    enum: ["primary", "secondary", "tertiary"],
  },
  dateOfJoining: {
    type: Date,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  passwordString: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Custom method to compare a plain text password with the stored hash
employeeSchema.methods.comparePassword = async function (password) {
  try {
    //   return await bcrypt.compare(password, this.passwordHash);
    return password === this.passwordString;
  } catch (error) {
    throw new Error(error);
  }
};

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
