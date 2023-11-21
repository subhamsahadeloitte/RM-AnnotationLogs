const RunCheckLog = require("../../Models/RunCheckLog");

// Create a new log
async function createLog(req) {
  try {
    const {
      annotationId,
      annotatorEmail,
      batchNumber,
      language,
      taskType,
      errors,
    } = req;

    const annotation = new RunCheckLog({
      annotationId,
      annotatorEmail,
      batchNumber,
      language,
      taskType,
      errors,
    });
    const response = await annotation.save();
    if (response) {
      return { success: true, message: response };
    } else {
      return { success: false, message: "Something went wrong" };
    }
  } catch (error) {
    return { success: false, message: "Internal Server Error", error };
  }
}

module.exports = {
  createLog,
};
