const express = require("express");
const router = express.Router();
const annotationService = require("./services");

// Filter annotations by a specific field and its value
router.post("/filter", annotationService.filterAnnotations);

// Create a new annotation
router.post("/", async (req, res) => {
  try {
    const annotation = await annotationService.createAnnotation(req.body);
    res.status(201).json(annotation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all annotations
router.get("/", async (req, res) => {
  try {
    const annotations = await annotationService.getAllAnnotations();
    res.json(annotations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single annotation by ID
router.get("/:id", async (req, res) => {
  try {
    const annotation = await annotationService.getAnnotationById(req.params.id);
    if (!annotation) {
      return res.status(404).json({ message: "Annotation not found" });
    }
    res.json(annotation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an annotation by ID
router.patch("/:id", async (req, res) => {
  try {
    const annotation = await annotationService.updateAnnotation(
      req.params.id,
      req.body
    );
    res.json(annotation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an annotation by ID
router.delete("/:id", async (req, res) => {
  try {
    await annotationService.deleteAnnotation(req.params.id);
    res.json({ message: "Annotation deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
