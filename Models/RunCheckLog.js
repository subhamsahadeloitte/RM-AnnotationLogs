const mongoose = require("mongoose");

const runCheckLogSchema = new mongoose.Schema({
  annotationId: {
    type: String,
    required: true,
    ref: "Annotation",
  },
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  annotatorEmail: {
    type: String,
    required: true,
    // Assuming 'Employee' is the model for Employee records
    ref: "Employee", // This makes it a foreign key referencing the Employee model
  },
  batchNumber: {
    type: String,
    // required: true,
  },
  language: {
    type: String,
    // required: true,
  },
  taskType: {
    type: String,
    enum: ["fresh", "re-work", "S1Review", "S2Review"],
    // required: true,
  },
  errorsArr: {
    type: Array, // Assuming completions are stored as an array of strings,
    required: true,
  },
  warningsArr: {
    type: Array, // Assuming completions are stored as an array of strings,
    required: true,
  },
});

const RunCheckLog = mongoose.model("RunCheckLog", runCheckLogSchema);

module.exports = RunCheckLog;
