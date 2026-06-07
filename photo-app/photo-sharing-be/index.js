const cors = require("cors");
const express = require("express");
const path = require("path");
const session = require("express-session");

const AdminRouter = require("./routes/AdminRouter");
const dbConnect = require("./db/dbConnect");
const PhotoRouter = require("./routes/PhotoRouter");
const RegisterRouter = require("./routes/RegisterRouter");
const SchemaInfo = require("./db/schemaInfo");
const UserRouter = require("./routes/UserRouter");

const app = express();
const PORT = process.env.PORT || 8081;

dbConnect();

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PROD,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "photo-sharing-secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use("/images", express.static(path.join(__dirname, "images")));

function requireLogin(request, response, next) {
  if (!request.session.user_id) {
    response.status(401).json({ error: "Bạn cần đăng nhập trước." });
    return;
  }
  next();
}

app.use(AdminRouter);
app.use(RegisterRouter);

app.get("/", (request, response) => {
  response.send({ message: "API Photo Sharing đang chạy." });
});

app.use(requireLogin);
app.use(UserRouter);
app.use(PhotoRouter);

app.get("/test/info", async (request, response) => {
  try {
    const schemaInfo = await SchemaInfo.findOne({}, "_id version load_date_time").lean();
    response.json(schemaInfo);
  } catch (error) {
    response.status(500).json({ error: "Không lấy được thông tin schema." });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
