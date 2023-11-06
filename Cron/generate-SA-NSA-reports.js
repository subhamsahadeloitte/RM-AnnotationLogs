// const fs = require("fs");
const XLSX = require("xlsx");
// const mongoose = require("mongoose");
// const config = require("../config.json");

const Annotation = require("../Models/Annotation");

// Connect to your MongoDB database
// const dbURL = config.dbUrl + config.dbName; // Replace with your actual MongoDB URL
// mongoose.connect(dbURL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const batch = "Batch 11";
// const currentDateTime = new Date();

const interval = 2;
const fetchData = async (currentDateTime) => {
  const hoursBefore = new Date(currentDateTime);
  hoursBefore.setHours(currentDateTime.getHours() - interval);
  const aggregationPipeline = [
    {
      $match: {
        date: {
          // $gte: new Date("2023-10-31T18:30:00Z"),
          // $lte: new Date("2023-11-02T18:30:00Z"),
          $gte: hoursBefore,
          $lte: currentDateTime,
        },
        // batchNumber: batch,
      },
    },
    {
      $group: {
        _id: "$annotationId",
        taskType: { $push: "$taskType" },
        annotatorEmail: { $push: "$annotatorEmail" },
        language: { $push: "$language" },
        rejected: { $push: "$rejected" },
        batchNumber: { $push: "$batchNumber" },
      },
    },
    {
      $sort: { annotationId: 1 },
    },
  ];

  const response = await Annotation.aggregate(aggregationPipeline);
  // console.log(response[500]);
  console.log(response.length);

  let report = [];
  response.map((item) => {
    let SA_count = 0,
      NSA_count = 0,
      SA_emails = [],
      NSA_emails = [],
      language = "",
      SA_rejections = [],
      NSA_rejections = [],
      batchNumber = "";
    item.taskType.map((t, i) => {
      if (t.includes("Review")) {
        SA_count++;
        SA_emails.push(item.annotatorEmail[i]);
        SA_rejections.push(String(item.rejected[i]));
      } else {
        NSA_count++;
        NSA_emails.push(item.annotatorEmail[i]);
        NSA_rejections.push(String(item.rejected[i]));
      }
      if (item.language[i] != "") language = item.language[i];
      if (item.batchNumber[i] != "" && item.batchNumber[i] != "Select a batch")
        batchNumber = item.batchNumber[i];
    });

    report.push({
      AnnotationID: item._id,
      SA_count,
      NSA_count,
      SA_emails: SA_emails.join(", "),
      NSA_emails: NSA_emails.join(", "),
      language,
      SA_rejections: SA_rejections.join(", "),
      NSA_rejections: NSA_rejections.join(", "),
      batch: batchNumber,
      // batchArr: item.batchNumber.join(", "),
    });
  });

  // console.log(report[500]);
  console.log({ hoursBefore, currentDateTime, count: report.length });

  // // Create a worksheet from the JSON data
  // const ws = XLSX.utils.json_to_sheet(report);

  // // Create a workbook and add the worksheet
  // const wb = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // let dateStr = new Date();
  // dateStr = dateStr.toString().replace(/:/gi, "-");

  // // Write the workbook to an Excel file
  // // const outputLoc = "Cron-data/SA-NSA/SA-NSA-" + randomString(16) + "-report.xlsx"
  // const outputLoc = `outputs/SA-NSA-${dateStr}-${batch}-report.xlsx`;
  // XLSX.writeFile(wb, outputLoc, {
  //   bookType: "xlsx",
  // });

  const wb = XLSX.utils.book_new();

  // Group your report by batch
  const groupedReport = groupBy(report, "batch");

  // Iterate over each batch and create a separate worksheet
  for (const batch in groupedReport) {
    const batchReport = groupedReport[batch];

    // Create a worksheet from the JSON data
    const ws = XLSX.utils.json_to_sheet(batchReport);

    // Add the worksheet to the workbook with the batch number as the sheet name
    XLSX.utils.book_append_sheet(wb, ws, batch);
  }

  // Generate the file name based on the date
  const dateStr = new Date().toString().replace(/:/gi, "-");
  const outputLoc = `Cron/SA-NSA/-${dateStr}-report.xlsx`;

  // Write the workbook to an Excel file
  XLSX.writeFile(wb, outputLoc, {
    bookType: "xlsx",
  });

  // Helper function to group the report by batch
  function groupBy(array, key) {
    return array.reduce((result, item) => {
      (result[item[key]] = result[item[key]] || []).push(item);
      return result;
    }, {});
  }
};

// fetchData();

module.exports = {
  fetchData,
};
