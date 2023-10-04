const mongoose = require("mongoose");

const annotationSchema = new mongoose.Schema({
  annotationId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  annotatorEmail: {
    type: String,
    required: true,
    // Assuming 'Employee' is the model for Employee records
    ref: "Employee", // This makes it a foreign key referencing the Employee model
  },
  batchNumber: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  rejected: {
    type: Boolean,
    default: false, // Default value is false
  },
  language: {
    type: String,
    required: true,
  },
  completions: {
    type: Array, // Assuming completions are stored as an array of strings
  },
  taskType: {
    type: String,
    enum: ["fresh", "re-work", "S1Review", "S2Review"],
    required: true,
  },
  ranking: {
    type: String,
  },
  reasoning: {
    type: String,
  },
  reasonForRejection: {
    type: String,
  },
  rejectionConfirmedByReviewer: {
    type: Boolean,
    default: false, // Default value is false
  },
});

const Annotation = mongoose.model("Annotation", annotationSchema);

module.exports = Annotation;
