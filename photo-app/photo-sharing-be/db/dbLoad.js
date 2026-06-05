const mongoose = require("mongoose");
require("dotenv").config();

const models = require("../modelData/models.js");
const Photo = require("../db/photoModel.js");
const SchemaInfo = require("../db/schemaInfo.js");
const User = require("../db/userModel.js");

const versionString = "1.0";

function makeLoginName(user) {
  // Tạo login_name dễ đoán cho dữ liệu mẫu: ian_malcolm, john_ousterhout, ...
  return `${user.first_name}_${user.last_name}`.toLowerCase();
}

async function dbLoad() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Đã kết nối MongoDB Atlas thành công.");
  } catch (error) {
    console.log("Không thể kết nối MongoDB Atlas.");
    console.error(error);
    return;
  }

  // Xóa dữ liệu cũ để chạy seed nhiều lần không bị trùng dữ liệu.
  await User.deleteMany({});
  await Photo.deleteMany({});
  await SchemaInfo.deleteMany({});

  const userModels = models.userListModel();
  const mapFakeId2RealId = {};

  for (const user of userModels) {
    const userObj = new User({
      login_name: makeLoginName(user),
      password: "password",
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
    });

    try {
      await userObj.save();
      mapFakeId2RealId[user._id] = userObj._id;
      user.objectID = userObj._id;
      console.log("Thêm user:", userObj.login_name, "với ID", userObj._id);
    } catch (error) {
      console.error("Lỗi khi tạo user", error);
    }
  }

  const photoModels = [];
  Object.keys(mapFakeId2RealId).forEach((id) => {
    photoModels.push(...models.photoOfUserModel(id));
  });

  for (const photo of photoModels) {
    const photoObj = await Photo.create({
      file_name: photo.file_name,
      date_time: photo.date_time,
      user_id: mapFakeId2RealId[photo.user_id],
    });
    photo.objectID = photoObj._id;

    if (photo.comments) {
      photo.comments.forEach((comment) => {
        photoObj.comments = photoObj.comments.concat([
          {
            comment: comment.comment,
            date_time: comment.date_time,
            user_id: comment.user.objectID,
          },
        ]);
      });
    }

    try {
      await photoObj.save();
      console.log("Thêm ảnh:", photo.file_name);
    } catch (error) {
      console.error("Lỗi khi tạo ảnh", error);
    }
  }

  try {
    const schemaInfo = await SchemaInfo.create({ version: versionString });
    console.log("Tạo SchemaInfo với version", schemaInfo.version);
  } catch (error) {
    console.error("Lỗi khi tạo SchemaInfo", error);
  }

  mongoose.disconnect();
}

dbLoad();
