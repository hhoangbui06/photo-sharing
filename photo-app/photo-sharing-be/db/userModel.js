const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Tên đăng nhập dùng cho form login.
  login_name: { type: String },
  // Theo yêu cầu lab, password lưu dạng string đơn giản.
  password: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  location: { type: String },
  description: { type: String },
  occupation: { type: String },
});

module.exports = mongoose.model.Users || mongoose.model("Users", userSchema);
