const express = require("express");
const router = express.Router();
const annotationService = require("./services");

// Filter annotations by a specific field and its value
router.post("/filter", async (req, res) => {
  const { field, value } = req.body;
  const result = await annotationService.filterAnnotations(
    field,
    value,
    req.query.page
  );
  res.status(result.success ? 200 : 401).json(result);
});

router.post("/filterByDate", async (req, res) => {
  const result = await annotationService.getAnnotationsByDateTimeRange(req);
  res.status(result.success ? 200 : 401).json(result);
});

router.post("/filterByPod", async (req, res) => {
  const result = await annotationService.filterAnnotationsByPodNumber(req);
  res.status(result.success ? 200 : 401).json(result);
});

router.post("/groupByPod", async (req, res) => {
  const result = await annotationService.groupAnnotationsByPodNumber(req);
  res.status(result.success ? 200 : 401).json(result);
});

router.post("/groupByBatch", async (req, res) => {
  const result = await annotationService.groupAnnotationsByBatch(req);
  res.status(result.success ? 200 : 401).json(result);
});

router.post("/validateWithSecondary", async (req, res) => {
  const result = await annotationService.validateWithSecondary(req);
  res.status(result.success ? 200 : 401).json(result);
});

// Log a new annotation with fewer data
router.post("/logAnnotation", async (req, res) => {
  const result = await annotationService.logAnnotation(req);
  res.status(result.success ? 200 : 401).json(result);
});

// Create a new annotation
router.post("/", async (req, res) => {
  const result = await annotationService.createAnnotation(req.body);
  res.status(result.success ? 200 : 401).json(result);
});

// Get all annotations
router.get("/", async (req, res) => {
  const result = await annotationService.getAllAnnotations(req.query.page);
  res.status(result.success ? 200 : 401).json(result);
});

// Get a single annotation by ID
router.get("/:id", async (req, res) => {
  const result = await annotationService.getAnnotationById(req.params.id);
  res.status(result.success ? 200 : 401).json(result);
});

// Update an annotation by ID
router.patch("/:id", async (req, res) => {
  const result = await annotationService.updateAnnotation(
    req.params.id,
    req.body
  );
  res.status(result.success ? 200 : 401).json(result);
});

// Delete an annotation by ID
router.delete("/:id", async (req, res) => {
  const result = await annotationService.deleteAnnotation(req.params.id);
  res.status(result.success ? 200 : 401).json(result);
});

module.exports = router;
