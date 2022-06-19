import express from "express";
import MarkersController from "../controllers/markers.js";

const router = express.Router();

router
  .get("/", MarkersController.getMarkers)
  .get("/:id", MarkersController.getMarkerById)
  .post("/", MarkersController.createMarker)
  .put("/:id", MarkersController.updateMarker)
  .delete("/deleteAll", MarkersController.deleteAllMarkers)
  .delete("/:id", MarkersController.deleteMarker);

export default router;
