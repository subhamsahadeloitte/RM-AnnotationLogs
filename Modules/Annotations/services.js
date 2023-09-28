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
    const annId =
      "ANN-" +
      randomString(
        16,
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
      );
    console.log(annId);
    annotationData["annotationId"] = annId;
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
    const limit = 2; // Number of records per page
    const skip = (page - 1) * limit; // Calculate the number of records to skip

    const totalRecords = await Annotation.countDocuments(); // Get the total number of records

    const response = await Annotation.find().skip(skip).limit(limit);

    if (response) {
      return {
        success: true,
        message: {
          annotations: response,
          currentPage: page,
          totalPages: Math.ceil(totalRecords / limit),
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
async function filterAnnotations(field, value) {
  try {
    const query = {};
    query[field] = value;
    const response = await Annotation.find(query);

    if (response.length === 0) {
      return { success: true, message: "No matching annotations found." };
    }

    return { success: true, message: response };
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
};
