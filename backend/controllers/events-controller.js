const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const HttpError = require("../models/http-error");
const Event = require("../models/event");
const fileDelete = require("../middleware/file-delete");

// GET all events
const getEvents = async (req, res, next) => {
  let events;
  try {
    events = await Event.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching events failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    events: events
      .map((event) => event.toObject({ getters: true }))
      .sort((a, b) => (a.date > b.date ? 1 : -1)),
  });
};

// GET event request response
const getEventById = async (req, res, next) => {
  const eventId = req.params.eid;
  let event;
  try {
    event = await Event.findById(eventId);
  } catch (err) {
    const error = new HttpError("Could not find that event", 500);
    return next(error);
  }

  if (!event) {
    const error = new HttpError("Could not find event for selected id.", 404);
    return next(error);
  }

  res.json({ event: event.toObject({ getters: true }) });
};

//Search events in collection
const searchEvents = async (req, res, next) => {
  let events;
  try {
    events = await Event.find({
      $text: {
        $search: req.body.search_query,
        fuzzy: {
          maxEdits: 1,
          maxExpansions: 100,
        },
      },
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching events failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    events: events
      .map((event) => event.toObject({ getters: true }))
      .sort((a, b) => (a.date > b.date ? 1 : -1)),
  });
};

// Create event response
const createEvent = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Invalid Inputs, please check data.", 422);
  }

  const { title, date, description, url, category } = req.body;

  const createdEvent = new Event({
    title,
    date,
    description,
    url,
    image: req.file ? req.file.location : null,
    category,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdEvent.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating event failed, try again", 500);
    return next(error);
  }

  res.status(201).json({ event: createdEvent });
};

// UPDATE event response
const updateEvent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid Inputs, please check data.", 422);
  }
  const { title, date, description, url, category } = req.body;

  const eventId = req.params.eid;

  let event;
  try {
    event = await Event.findById(eventId);
  } catch (err) {
    const error = new HttpError("Could not update that event", 500);
    return next(error);
  }

  //If new file chosen, delete old and replace with new
  if (req.file) {
    if (req.file.location !== event.image && event.image !== null) {
      fileDelete(event.image);
    }
  }

  event.title = title;
  event.date = date;
  event.description = description;
  event.url = url;
  event.image =
    event.image && !req.file
      ? event.image
      : req.file
      ? req.file.location
      : null;
  event.category = category;

  try {
    await event.save();
  } catch (err) {
    const error = new HttpError("Could not update that event", 500);
    return next(error);
  }

  res.status(200).json({ event: event.toObject({ getters: true }) });
};

//Remove Image
const deleteEventImage = async (req, res, next) => {
  const eventId = req.params.eid;

  let event;
  try {
    event = await Event.findById(eventId);
  } catch (err) {
    const error = new HttpError("Could not update that event", 500);
    return next(error);
  }

  //Delete Image from bucket
  if (event.image) {
    fileDelete(event.image);
  }
  event.image = null;

  try {
    await event.save();
  } catch (err) {
    const error = new HttpError("Could not update that event", 500);
    return next(error);
  }

  res.status(200).json({ event: event.toObject({ getters: true }) });
};

// DELETE event
const deleteEvent = async (req, res, next) => {
  const eventId = req.params.eid;

  let event;
  try {
    event = await Event.findById(eventId);
  } catch (err) {
    const error = new HttpError("Could not delete event", 500);
    return next(error);
  }

  const imagePath = event.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await event.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Could not delete event", 500);
    return next(error);
  }

  if (imagePath) fileDelete(imagePath);

  //fs.unlink(imagePath, (err) => {});

  res.status(200).json({ message: "Event Deleted." });
};

exports.getEvents = getEvents;
exports.getEventById = getEventById;
exports.searchEvents = searchEvents;
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
exports.deleteEventImage = deleteEventImage;
