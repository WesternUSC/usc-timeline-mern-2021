const express = require("express");
const { check } = require("express-validator");

const HttpError = require("../models/http-error");

const eventsControllers = require("../controllers/events-controller");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// GET all events
router.get("/", eventsControllers.getEvents);

// Handle GET request to find event by event id
router.get("/:eid", eventsControllers.getEventById);

// Search events
router.post("/search", eventsControllers.searchEvents);

router.use(checkAuth);

// Handle POST request to add new event
router.post(
  "/new",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("date").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("category").not().isEmpty(),
  ],

  eventsControllers.createEvent
);

// Handle PATCH request to update events
router.patch(
  "/:eid",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("date").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("category").not().isEmpty(),
  ],
  eventsControllers.updateEvent
);

// Handle PATCH request to update events
router.patch("/image/:eid", eventsControllers.deleteEventImage);

// Handle DELETE request for events
router.delete("/:eid", eventsControllers.deleteEvent);

module.exports = router;
