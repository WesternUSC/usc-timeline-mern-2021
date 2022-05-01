const express = require("express");
const { check } = require("express-validator");

const HttpError = require("../models/http-error");

const usersControllers = require("../controllers/users-controller");

const router = express.Router();

// GET all users
router.get("/", usersControllers.getUsers);

// Handle POST new user sign up
router.post(
  "/signup",
  [check("username").not().isEmpty(), check("password").isLength({ min: 6 })],
  usersControllers.signup
);

// Handle POST request to authenticate user
router.post("/signin", usersControllers.signin);

// Handle DELETE request for users
router.delete("/:uid", usersControllers.deleteUser);

module.exports = router;
