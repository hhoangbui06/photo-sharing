const express = require("express");
const mongoose = require("mongoose");

const Photo = require("../db/photoModel");
const User = require("../db/userModel");

const router = express.Router();



function toUserListItem(user, photoCount, commentCount) {
  return {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    photo_count: photoCount,
    comment_count: commentCount,
  };
}

router.get("/user/list", async (request, response) => {
  try {
    const users = await User.find({}, "_id first_name last_name").lean();
    const userListItems = [];

    for (const user of users) {
      const photoCount = await Photo.countDocuments({ user_id: user._id });
      const commentCount = await Photo.countDocuments({ "comments.user_id": user._id });
      userListItems.push(toUserListItem(user, photoCount, commentCount));
    }

    response.json(userListItems);
  } catch (error) {
    response.status(500).json({ error: "Không lấy được danh sách người dùng." });
  }
});

router.get("/user/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const user = await User.findById(
      id,
      "_id first_name last_name location description occupation",
    ).lean();

    if (!user) {
      response.status(400).json({ error: "Không tìm thấy người dùng." });
      return;
    }

    response.json(user);
  } catch (error) {
    response.status(500).json({ error: "Không lấy được thông tin người dùng." });
  }
});

module.exports = router;
