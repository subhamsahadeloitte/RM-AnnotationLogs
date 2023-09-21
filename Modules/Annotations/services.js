const Annotation = require("../../Models/Annotation");

// Create a new annotation
async function createAnnotation(annotationData) {
  try {
    const annotation = new Annotation(annotationData);
    await annotation.save();
    return annotation;
  } catch (err) {
    throw err;
  }
}

// Get all annotations
async function getAllAnnotations() {
  try {
    const annotations = await Annotation.find();
    return annotations;
  } catch (err) {
    throw err;
  }
}

// Get a single annotation by ID
async function getAnnotationById(id) {
  try {
    const annotation = await Annotation.findById(id);
    return annotation;
  } catch (err) {
    throw err;
  }
}

// Update an annotation by ID
async function updateAnnotation(id, updateData) {
  try {
    const annotation = await Annotation.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
    });
    return annotation;
  } catch (err) {
    throw err;
  }
}

// Delete an annotation by ID
async function deleteAnnotation(id) {
  try {
    await Annotation.findByIdAndRemove(id);
  } catch (err) {
    throw err;
  }
}

// Filter annotations by a specific field and its value
async function filterAnnotations(req, res) {
  try {
    const { field, value } = req.body;
    const filter = {};
    filter[field] = value;

    // Use Mongoose find to filter records based on the specified field and value
    const filteredAnnotations = await Annotation.find(filter);

    if (filteredAnnotations.length === 0) {
      return res
        .status(404)
        .json({ message: "No matching annotations found." });
    }

    res.status(200).json(filteredAnnotations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
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
