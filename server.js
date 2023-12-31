const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./config.json");
const cors = require("cors");
var cron = require("node-cron");

const SA_NSA_reportService = require("./Cron/generate-SA-NSA-reports");

const app = express();
const port = config.serverPort;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB (replace 'config.dbUrl' with your actual DB URL)
mongoose.connect(config.dbUrl + config.dbName, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to the database");
  // Add module-specific initialization here
});

app.get("/", (req, res) => {
  res.json({ message: "Server is up and running!!" });
});

// Add API routes from 'api.js'
const apiRouter = require("./api.js");
app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// CRON call
// cron.schedule("* */2 * * *", () => {
// cron.schedule("*/15 * * * *", () => {
//   console.log("Fetching report...");
//   const currentDateTime = new Date();
//   SA_NSA_reportService.fetchData(currentDateTime);
// });
