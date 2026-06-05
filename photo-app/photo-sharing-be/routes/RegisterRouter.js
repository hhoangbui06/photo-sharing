const express = require("express");

const User = require("../db/userModel");

const router = express.Router();

function isBlank(value) {
  return typeof value !== "string" || value.trim() === "";
}

router.post("/user", async (request, response) => {
  const {
    login_name,
    password,
    first_name,
    last_name,
    location,
    description,
    occupation,
  } = request.body;

  if (isBlank(login_name)) {
    response.status(400).json({ error: "Login name không được để trống." });
    return;
  }
  if (isBlank(password)) {
    response.status(400).json({ error: "Password không được để trống." });
    return;
  }
  if (isBlank(first_name)) {
    response.status(400).json({ error: "First name không được để trống." });
    return;
  }
  if (isBlank(last_name)) {
    response.status(400).json({ error: "Last name không được để trống." });
    return;
  }

  const existingUser = await User.findOne({ login_name: login_name.trim() }).lean();
  if (existingUser) {
    response.status(400).json({ error: "Login name đã tồn tại." });
    return;
  }

  const user = await User.create({
    login_name: login_name.trim(),
    password,
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    location: location || "",
    description: description || "",
    occupation: occupation || "",
  });

  response.json({
    _id: user._id,
    login_name: user.login_name,
    first_name: user.first_name,
    last_name: user.last_name,
  });
});

module.exports = router;
