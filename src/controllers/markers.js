import Marker from "../models/marker.js";

class MarkersController {
  constructor(Marker) {
    this.marker = Marker;
  }

  getMarkers = (req, res) => {
    this.marker.find().exec((err, markers) => {
      res.status(200).send(markers);
    });
  };

  getMarkerById = (req, res) => {
    const { id } = req.params;
    this.marker.findById(id, (err, marker) => {
      if (marker === null) {
        res.status(404).send({ message: "id not founded" });
      } else if (!err) {
        res.status(302).send(marker);
      } else {
        res.status(204).send({ err: err.message });
      }
    });
  };

  createMarker = (req, res) => {
    let newMarker = new this.marker(req.body);

    newMarker.save((err) => {
      if (!err) {
        res.status(201).send(newMarker);
      } else {
        res.status(400).send({ err: err.message });
      }
    });
  };

  updateMarker = (req, res) => {
    const { id } = req.params;
    if (!req.body.hasOwnProperty("position")) {
      res.status(400).send({ message: "need provide a position" });
      return;
    }
    const { lat, lng } = req.body.position;

    this.marker.findById(id, async (err, marker) => {
      if (!err) {
        if (!marker) return res.status(400).send({ message: "id not founded" });
        marker.position["lat"] = lat || marker.position["lat"];
        marker.position["lng"] = lng || marker.position["lng"];
        await marker.save();
        res.status(201).send(marker);
      } else {
        res.status(500).send({ err: err.message });
      }
    });
  };

  deleteMarker = (req, res) => {
    const { id } = req.params;

    this.marker.deleteOne({ _id: id }, (err, marker) => {
      if (marker.deletedCount === 0)
        return res.status(400).send({ message: "id not founded" });

      if (!err) {
        res.status(200).send();
      } else {
        res.status(500).send({ err: err.message });
      }
    });
  };

  deleteAllMarkers = (req, res) => {
    this.marker.deleteMany({}, (err) => {
      if (!err) {
        res.status(200).send();
      } else {
        res.status(500).send({ err: err.message });
      }
    });
  };
}

export default new MarkersController(Marker);
