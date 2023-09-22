const Annotation = require("../../Models/Annotation");

// Create a new annotation
async function createAnnotation(annotationData) {
  try {
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

// Get all annotations
async function getAllAnnotations() {
  try {
    const response = await Annotation.find();
    if (response) {
      return { success: true, message: response };
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
