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

    const query = {};
    let re = new RegExp(`${value}`, "i");
    query[field] = re;

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
    const { fromDate, fromTime, toDate, toTime, groupBy } = request;

    // Convert fromDate and toDate to Date objects
    console.log(`${fromDate}T${fromTime}`, `${toDate}T${toTime}`);
    const fromDateObj = new Date(`${fromDate}T${fromTime}`);
    const toDateObj = new Date(`${toDate}T${toTime}`);

    // Create a query to find records within the specified range
    const query = {
      date: {
        $gte: fromDateObj, // Greater than or equal to fromDate
        $lte: toDateObj, // Less than or equal to toDate
      },
    };

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
async function filterAnnotationsByPodNumber(podNumber, language, page = 1) {
  try {
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
        $match: {
          "employee.podNumber": podNumber,
          language,
        },
      },
      {
        $sort: { createdAt: -1 }, // Sort by createdAt field in descending order (latest first)
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
    return { success: false, message: "Internal Server Error", error };
  }
}

module.exports = {
  createAnnotation,
  getAllAnnotations,
  getAnnotationById,
  updateAnnotation,
  deleteAnnotation,
  filterAnnotations,
  getAnnotationsByDateTimeRange,
  filterAnnotationsByPodNumber,
};
