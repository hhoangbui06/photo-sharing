const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  // Nội dung bình luận.
  comment: String,
  // Ngày giờ tạo bình luận.
  date_time: { type: Date, default: Date.now },
  // ID của người viết bình luận.
  user_id: mongoose.Schema.Types.ObjectId,
});

const photoSchema = new mongoose.Schema({
  // Tên file ảnh.
  file_name: { type: String },
  // Ngày giờ ảnh được thêm vào database.
  date_time: { type: Date, default: Date.now },
  // ID của người sở hữu ảnh.
  user_id: mongoose.Schema.Types.ObjectId,
  // Danh sách bình luận của ảnh.
  comments: [commentSchema],
});

const Photo = mongoose.model.Photos || mongoose.model("Photos", photoSchema);

module.exports = Photo;
