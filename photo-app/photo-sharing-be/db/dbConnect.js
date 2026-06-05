const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  const dbUrl = process.env.DB_URL;

  if (!dbUrl) {
    throw new Error("Thiếu DB_URL trong file .env.");
  }

  try {
    await mongoose.connect(dbUrl);
    console.log("Đã kết nối MongoDB Atlas thành công.");
  } catch (error) {
    console.log("Không thể kết nối MongoDB Atlas.");
    console.error(error);
    throw error;
  }
}

module.exports = dbConnect;
