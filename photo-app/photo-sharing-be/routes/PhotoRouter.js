const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const Photo = require("../db/photoModel");
const User = require("../db/userModel");

const router = express.Router();
const imageDir = path.join(__dirname, "..", "images");

if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, imageDir);
  },
  filename: (request, file, callback) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    callback(null, uniqueName);
  },
});

const upload = multer({ storage });


function toSmallUser(user) {
  return {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
  };
}

function buildUserMap(users) {
  const userMap = {};
  users.forEach((user) => {
    userMap[user._id.toString()] = toSmallUser(user);
  });
  return userMap;
}

router.get("/photosOfUser/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const user = await User.findById(id, "_id").lean();
    if (!user) {
      response.status(400).json({ error: "Không tìm thấy người dùng." });
      return;
    }

    const photos = await Photo.find({ user_id: id }).lean();
    const commentUserIds = new Set();

    photos.forEach((photo) => {
      (photo.comments || []).forEach((comment) => {
        commentUserIds.add(comment.user_id.toString());
      });
    });

    const commentUsers = await User.find(
      { _id: { $in: Array.from(commentUserIds) } },
      "_id first_name last_name",
    ).lean();
    const userMap = buildUserMap(commentUsers);

    const result = photos.map((photo) => ({
      _id: photo._id,
      user_id: photo.user_id,
      file_name: photo.file_name,
      date_time: photo.date_time,
      comments: (photo.comments || []).map((comment) => ({
        _id: comment._id,
        comment: comment.comment,
        date_time: comment.date_time,
        user: userMap[comment.user_id.toString()],
      })),
    }));

    response.json(result);
  } catch (error) {
    response.status(500).json({ error: "Không lấy được ảnh của người dùng." });
  }
});

router.get("/commentsOfUser/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const user = await User.findById(id, "_id first_name last_name").lean();
    if (!user) {
      response.status(400).json({ error: "Không tìm thấy người dùng." });
      return;
    }
    const photos = await Photo.find({ "comments.user_id": id }).lean();
    const result = [];
    photos.forEach((photo) => {
      (photo.comments || [])
        .filter((comment) => comment.user_id.toString() === id)
        .forEach((comment) => {
          result.push({
            _id: comment._id,
            comment: comment.comment,
            date_time: comment.date_time,
            photo: {
              _id: photo._id,
              user_id: photo.user_id,
              file_name: photo.file_name,
              date_time: photo.date_time,
            },
            user: toSmallUser(user),
          });
        });
    });

    response.json(result);
  } catch (error) {
    response.status(500).json({ error: "Không lấy được bình luận của người dùng." });
  }
});

router.post("/commentsOfPhoto/:photo_id", async (request, response) => {
  const { photo_id } = request.params;
  const commentText = request.body.comment;


  if (typeof commentText !== "string" || commentText.trim() === "") {
    response.status(400).json({ error: "Bình luận không được để trống." });
    return;
  }

  const photo = await Photo.findById(photo_id);
  if (!photo) {
    response.status(400).json({ error: "Không tìm thấy ảnh." });
    return;
  }

  photo.comments.push({
    comment: commentText.trim(),
    date_time: new Date(),
    user_id: request.session.user_id,
  });
  await photo.save();

  response.json({ message: "Thêm bình luận thành công." });
});

router.post("/photos/new", upload.single("photo"), async (request, response) => {
  if (!request.file) {
    response.status(400).json({ error: "Vui lòng chọn file ảnh." });
    return;
  }

  const photo = await Photo.create({
    file_name: request.file.filename,
    date_time: new Date(),
    user_id: request.session.user_id,
    comments: [],
  });

  response.json({
    _id: photo._id,
    file_name: photo.file_name,
    date_time: photo.date_time,
    user_id: photo.user_id,
  });
});

module.exports = router;
