const express = require("express");

const User = require("../db/userModel");

const router = express.Router();

function toLoginDto(user) {
  return {
    _id: user._id,
    login_name: user.login_name,
    first_name: user.first_name,
    last_name: user.last_name,
  };
}

router.post("/admin/login", async (request, response) => {
  const { login_name, password } = request.body;

  if (!login_name || !password) {
    response.status(400).json({ error: "Vui lòng nhập login name và password." });
    return;
  }

  const user = await User.findOne({ login_name }).lean();
  if (!user || user.password !== password) {
    response.status(400).json({ error: "Login name hoặc password không đúng." });
    return;
  }

  request.session.user_id = user._id.toString();
  response.json(toLoginDto(user));
});

router.post("/admin/logout", (request, response) => {
  if (!request.session.user_id) {
    response.status(400).json({ error: "Hiện không có user nào đang đăng nhập." });
    return;
  }

  request.session.destroy((error) => {
    if (error) {
      response.status(500).json({ error: "Không đăng xuất được." });
      return;
    }
    response.json({ message: "Đăng xuất thành công." });
  });
});

router.get("/admin/currentUser", async (request, response) => {
  if (!request.session.user_id) {
    response.status(401).json({ error: "Chưa đăng nhập." });
    return;
  }

  const user = await User.findById(request.session.user_id).lean();
  if (!user) {
    response.status(401).json({ error: "Session không hợp lệ." });
    return;
  }

  response.json(toLoginDto(user));
});

module.exports = router;
