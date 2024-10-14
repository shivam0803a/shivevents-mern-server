const express = require("express");
const router = express.Router();
const validatetoken = require("../middleware/validate-token");
const EventModel = require("../models/event-model");

router.post("/create-event", validatetoken, async (req, resp) => {
  try {
    const event = await EventModel.create(req.body);
    return resp
      .status(201)
      .json({ message: "Event Created Successfully", event });
  } catch (error) {
    return resp.status(401).json({ message: error.message });
  }
});

router.put("/edit-event/:id", validatetoken, async (req, resp) => {
  try {
    const event = await EventModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return resp
      .status(201)
      .json({ message: "Event Update Successfully", event });
  } catch (error) {
    return resp.status(401).json({ message: error.message });
  }
});

router.delete("/delete-event/:id", validatetoken, async (req, resp) => {
  try {
    const event = await EventModel.findByIdAndDelete(req.params.id);
    return resp
      .status(201)
      .json({ message: "Event Deleted Successfully", event });
  } catch (error) {
    return resp.status(401).json({ message: error.message });
  }
});

router.get("/get-events", validatetoken, async (req, resp) => {
  try {
    //Access search Query
    const searchText = req.query.searchText;
    const date = req.query.date;

    const events = await EventModel.find({
      name: { $regex: new RegExp(searchText, "i") },
      ...(date && { date }),
    }).sort({ createdAt: -1 });

    return resp.status(201).json({ data: events });
  } catch (error) {
    return resp.status(401).json({ message: error.message });
  }
});

router.get("/get-event/:id", validatetoken, async (req, resp) => {
  try {
    const event = await EventModel.findById(req.params.id);
    return resp.status(201).json({ data: event });
  } catch (error) {
    return resp.status(401).json({ message: error.message });
  }
});

module.exports = router;
