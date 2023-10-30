const Annotation = require("../../Models/Annotation");

function randomString(length, chars) {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

// Create a new annotation
async function createAnnotation(annotationData) {
  try {
    console.log({ annotationData });
    if (!annotationData["annotationId"]) {
      const annId =
        "ANN-" +
        randomString(
          16,
          "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        );
      // console.log(annId);
      annotationData["annotationId"] = annId;
    }
    const annotation = new Annotation(annotationData);
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

async function logAnnotation(req) {
  try {
    const { batchNumber, prompt, compA, compB, compC, annotatorEmail, role } =
      req.body;
    // console.log({ prompt, compA, compB, compC, annotatorEmail, role });

    // Check if a document with the specified 'prompt' and 'completionTexts' exists
    const existingCompletion = await Annotation.find({
      prompt,
      completions: {
        $elemMatch: {
          completionText: { $in: [compA, compB, compC] },
        },
      },
    });
    // console.log({ existingCompletion });
    if (existingCompletion.length != 0) {
      return { success: true, message: existingCompletion, logged: false };
    } else {
      const annId =
        "ANN-" +
        randomString(
          16,
          "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        );

      const annotationData = require("../../Resources/annotation-structure.json");

      annotationData.annotationId = annId;
      annotationData.annotatorEmail = annotatorEmail;
      annotationData.batchNumber = batchNumber;
      annotationData.prompt = prompt;
      annotationData.completions[0].completionText = compA;
      annotationData.completions[1].completionText = compB;
      annotationData.completions[2].completionText = compC;
      console.log({ annotationData });

      const annotation = new Annotation(annotationData);
      const response = await annotation.save();
      if (response) {
        return { success: true, message: response, logged: true };
      } else {
        return { success: false, message: "Something went wrong" };
      }
    }
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", error };
  }
}

// Get all annotations with pagination
async function getAllAnnotations(page = 1) {
  try {
    const limit = 20; // Number of records per page
    const skip = (page - 1) * limit; // Calculate the number of records to skip

    const totalRecords = await Annotation.countDocuments(); // Get the total number of records

    const response = await Annotation.find()
      .sort({ $natural: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalRecords / limit);

    if (response) {
      return {
        success: true,
        message: response,
        pagination: {
          page,
          totalPages,
          totalRecords,
          nextPage: page < totalPages ? Number(page) + 1 : null,
        },
      };
    } else {
      return { success: false, message: "Something went wrong" };
    }
  } catch (error) {
    return { success: false, message: "Internal Server Error", error };
  }
}

// Get a single annotation by ID
async function getAnnotationById(id) {
  try {
    const response = await Annotation.findById(id);
    if (response) {
      return { success: true, message: response };
    } else {
      return { success: false, message: "Something went wrong" };
    }
  } catch (error) {
    return { success: false, message: "Internal Server Error", error };
  }
}

// Update an annotation by ID
async function updateAnnotation(id, updateData) {
  try {
    const response = await Annotation.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
    });
    if (response) {
      return { success: true, message: response };
    } else {
      return { success: false, message: "Something went wrong" };
    }
  } catch (error) {
    return { success: false, message: "Internal Server Error", error };
  }
}

// Delete an annotation by ID
async function deleteAnnotation(id) {
  try {
    const response = await Annotation.findByIdAndRemove(id);
    if (response) {
      return { success: true, message: response };
    } else {
      return { success: false, message: "Something went wrong" };
    }
  } catch (error) {
    return { success: false, message: "Internal Server Error", error };
  }
}

// Filter annotations by a specific field and its value
async function filterAnnotations(field, value, page = 1) {
  try {
    const limit = 20; // Number of records per page
    const skip = (page - 1) * limit; // Calculate the number of records to skip
    // console.log({ value });

    const query = {};
    if (field === "prompt") {
      query[field] = value;
    } else {
      let re = new RegExp(`${value}`, "i");
      query[field] = re;
    }

    const totalRecords = await Annotation.countDocuments(query); // Get the total number of matching records

    const response = await Annotation.find(query)
      .sort({ $natural: -1 })
      .skip(skip)
      .limit(limit);

    if (response.length === 0) {
      return { success: true, message: "No matching annotations found." };
    }

    const totalPages = Math.ceil(totalRecords / limit);

    return {
      success: true,
      message: response,
      pagination: {
        page,
        totalPages,
        totalRecords,
        nextPage: page < totalPages ? Number(page) + 1 : null,
      },
    };
  } catch (error) {
    return { success: false, message: "Internal Server Error", error };
  }
}

// Get annotations within a date and time range
async function getAnnotationsByDateTimeRange(request) {
  try {
    const { fromDate, fromTime, toDate, toTime, groupBy, search } =
      request.body;

    // Convert fromDate and toDate to Date objects
    // console.log(`${fromDate}T${fromTime}`, `${toDate}T${toTime}`);
    const fromDateObj = new Date(`${fromDate}T${fromTime}`);
    const toDateObj = new Date(`${toDate}T${toTime}`);

    // Create a query to find records within the specified range
    const query = {
      date: {
        $gte: fromDateObj, // Greater than or equal to fromDate
        $lte: toDateObj, // Less than or equal to toDate
      },
    };
    if (search != null) {
      const { field, value } = search;
      if (field === "prompt") {
        query[field] = value;
      } else {
        let re = new RegExp(`${value}`, "i");
        query[field] = re;
      }
    }

    let totalRecords = null;
    let response;
    if (groupBy != "") {
      const aggregationPipeline = [
        {
          $match: query,
        },
        {
          $group: {
            _id: `$${groupBy}`, // Group by
            count: { $sum: 1 }, // Count the records in each group
          },
        },
        {
          $sort: {
            count: -1, // Sort in decreasing order of counts
          },
        },
      ];

      response = await Annotation.aggregate(aggregationPipeline);
    } else {
      totalRecords = await Annotation.countDocuments(query);
      response = await Annotation.find(query);
    }

    if (response) {
      return { success: true, message: response, pagination: { totalRecords } };
    } else {
      return { success: false, message: "No matching annotations found." };
    }
  } catch (error) {
    return { success: false, message: "Internal Server Error", error };
    console.log(error);
  }
}

// Filter annotations by podNumber with pagination and count info
async function filterAnnotationsByPodNumber(req) {
  try {
    const podNumber = req.body.podNumber;
    const language = req.body.language;
    const search = req.body.search;
    const page = req.query.page || 1;

    let match = {
      "employee.podNumber": podNumber,
      language,
    };
    if (search != null) {
      const { field, value } = search;
      if (field === "prompt") {
        match[field] = value;
      } else {
        let re = new RegExp(`${value}`, "i");
        match[field] = re;
      }
    }

    // Create an aggregation pipeline to join Annotations with Employees
    const limit = 20; // Number of records per page
    const aggregationPipeline = [
      {
        $lookup: {
          from: "employees", // Name of the Employees collection
          localField: "annotatorEmail",
          foreignField: "annotatorEmail",
          as: "employee",
        },
      },
      {
        $match: match,
      },
      {
        $sort: { date: -1 }, // Sort by createdAt field in descending order (latest first)
      },
    ];

    const totalCount = await Annotation.aggregate([
      ...aggregationPipeline,
      {
        $count: "count",
      },
    ]);

    const totalRecords = totalCount.length > 0 ? totalCount[0].count : 0;
    const totalPages = Math.ceil(totalRecords / limit);
    const skip = (page - 1) * limit;

    aggregationPipeline.push(
      {
        $skip: skip, // Calculate the number of documents to skip
      },
      {
        $limit: limit, // Limit the number of documents per page
      }
    );

    const response = await Annotation.aggregate(aggregationPipeline);

    const paginationInfo = {
      page,
      totalPages,
      totalRecords,
      nextPage: page < totalPages ? Number(page) + 1 : null,
    };

    if (response) {
      return { success: true, message: response, pagination: paginationInfo };
    } else {
      return { success: false, message: "No matching annotations found." };
    }
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", error };
  }
}

// Filter annotations by podNumber and group by language field
async function groupAnnotationsByPodNumber(req) {
  try {
    // Create an aggregation pipeline to join Annotations with Employees and group by language
    let groupBy = "$employee.podNumber";

    const { fromDate, fromTime, toDate, toTime } = req.body;
    // Convert fromDate and toDate to Date objects
    // console.log(`${fromDate}T${fromTime}`, `${toDate}T${toTime}`);
    const fromDateObj = new Date(`${fromDate}T${fromTime}`);
    const toDateObj = new Date(`${toDate}T${toTime}`);

    // Create a query to find records within the specified range
    const match = {
      date: {
        $gte: fromDateObj, // Greater than or equal to fromDate
        $lte: toDateObj, // Less than or equal to toDate
      },
    };

    if (req.body.podNumber != "") {
      match["employee.podNumber"] = req.body.podNumber;
      groupBy = "$language";
    }
    if (req.body.language != "") {
      match["language"] = req.body.language;
      // match["taskType"] = "fresh";
      groupBy = "$annotatorEmail";
    }

    const aggregationPipeline = [
      {
        $lookup: {
          from: "employees", // Name of the Employees collection
          localField: "annotatorEmail",
          foreignField: "annotatorEmail",
          as: "employee",
        },
      },
      {
        $match: match,
      },
      {
        $group: {
          _id: groupBy, // Group by the 'language' field
          count: { $sum: 1 }, // Calculate the count of each language
          rejectedCount: {
            $sum: { $cond: [{ $eq: ["$rejected", true] }, 1, 0] },
          },
          approvedCount: {
            $sum: { $cond: [{ $eq: ["$rejected", false] }, 1, 0] },
          },
        },
      },
    ];

    const response = await Annotation.aggregate(aggregationPipeline);

    if (response) {
      return { success: true, message: response };
    } else {
      return { success: false, message: "No matching annotations found." };
    }
  } catch (error) {
    return { success: false, message: "Internal Server Error", error };
  }
}

async function groupAnnotationsByBatch(req) {
  try {
    let groupBy = "$batchNumber";

    // const { fromDate, fromTime, toDate, toTime } = req.body;
    // console.log(`${fromDate}T${fromTime}`, `${toDate}T${toTime}`);
    // const fromDateObj = new Date(`${fromDate}T${fromTime}`);
    // const toDateObj = new Date(`${toDate}T${toTime}`);

    // Create a query to find records within the specified range
    const match = {};
    // const match = {
    //   date: {
    //     $gte: fromDateObj, // Greater than or equal to fromDate
    //     $lte: toDateObj, // Less than or equal to toDate
    //   },
    // };

    if (req.body.batchNumber != "") {
      match["batchNumber"] = req.body.batchNumber;
      groupBy = "$language";
    }
    if (req.body.language != "") {
      match["language"] = req.body.language;
      groupBy = "$annotationId";
    }

    const aggregationPipeline = [
      {
        $match: match,
      },
      {
        $group: {
          _id: groupBy, // Group by the 'language' field
          count: { $sum: 1 }, // Calculate the count of each language
          rejectedCount: {
            $sum: { $cond: [{ $eq: ["$rejected", true] }, 1, 0] },
          },
          approvedCount: {
            $sum: { $cond: [{ $eq: ["$rejected", false] }, 1, 0] },
          },
        },
      },
    ];

    const response = await Annotation.aggregate(aggregationPipeline);

    if (response) {
      return { success: true, message: response, totalCount: response.length };
    } else {
      return { success: false, message: "No matching annotations found." };
    }
  } catch (error) {
    return { success: false, message: "Internal Server Error", error };
  }
}

module.exports = {
  createAnnotation,
  logAnnotation,
  getAllAnnotations,
  getAnnotationById,
  updateAnnotation,
  deleteAnnotation,
  filterAnnotations,
  getAnnotationsByDateTimeRange,
  filterAnnotationsByPodNumber,
  groupAnnotationsByPodNumber,
  groupAnnotationsByBatch,
};
