# Kịch bản trình bày website Photo Sharing trong 5 phút

## Mục tiêu trình bày

Trình bày ngắn gọn luồng hoạt động chính của website từ Frontend, Backend đến MongoDB, đồng thời demo các chức năng lớn:

- Đăng nhập và kiểm tra session.
- React Router và các trang chính.
- Xem người dùng, ảnh và bình luận.
- Thêm bình luận, upload ảnh và cập nhật count.
- Tính năng xem từng ảnh nâng cao.

---

## Chuẩn bị trước khi trình bày

Mở sẵn các file theo thứ tự:

1. `photo-sharing-v1/src/index.js`
2. `photo-sharing-v1/src/App.js`
3. `photo-sharing-v1/src/lib/fetchModelData.js`
4. `photo-sharing-be/index.js`
5. `photo-sharing-be/routes/AdminRouter.js`
6. `photo-sharing-be/routes/UserRouter.js`
7. `photo-sharing-be/routes/PhotoRouter.js`
8. `photo-sharing-be/db/userModel.js`
9. `photo-sharing-be/db/photoModel.js`

Mở sẵn website:

```text
http://localhost:3000
```

Tài khoản demo:

```text
login_name: ian_malcolm
password: password
```

---

## 1. Giới thiệu tổng quan - khoảng 30 giây

### Nói

> Đây là website chia sẻ ảnh được chia thành ba phần. Frontend sử dụng React và React Router để hiển thị giao diện. Backend sử dụng ExpressJS để cung cấp API, kiểm tra đăng nhập và xử lý nghiệp vụ. Database sử dụng MongoDB Atlas, được truy cập thông qua Mongoose.
>
> Luồng chung là người dùng thao tác trên giao diện, Frontend gọi API bằng `fetch`, Backend truy vấn MongoDB rồi trả JSON để React cập nhật giao diện.

### Có thể chỉ vào sơ đồ trong

```text
photo-sharing-v1/flow.md
```

---

## 2. Điểm bắt đầu của Frontend - khoảng 20 giây

### Mở file

```text
photo-sharing-v1/src/index.js
```

### Chỉ vào

```jsx
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Nói

> Khi website được mở, React bắt đầu từ file `index.js` và render component `App` vào phần tử `root` trong HTML. Từ `App`, toàn bộ Router và các component khác mới được hiển thị.

---

## 3. React Router và kiểm tra đăng nhập - khoảng 1 phút

### Mở file

```text
photo-sharing-v1/src/App.js
```

### Chỉ vào các state

```jsx
currentUser
checkingLogin
advancedEnabled
userListRefreshKey
```

### Nói

> `App.js` là nơi quản lý các state dùng chung. `currentUser` lưu người đang đăng nhập, `checkingLogin` cho biết ứng dụng đang kiểm tra session, `advancedEnabled` quản lý tính năng nâng cao và `userListRefreshKey` dùng để cập nhật lại số ảnh, số bình luận.

### Chỉ vào `useEffect` gọi `/admin/currentUser`

### Nói

> Khi mở trang hoặc nhấn F5, Frontend gọi API `/admin/currentUser`. Nếu session vẫn còn, Backend trả lại user và ứng dụng giữ trạng thái đăng nhập. Nếu session không hợp lệ, ứng dụng chuyển về trang login.

### Chỉ vào `ProtectedRoute` và `PublicOnlyRoute`

### Nói

> `ProtectedRoute` chặn các trang cần đăng nhập. Ngược lại, `PublicOnlyRoute` không cho user đã đăng nhập quay lại trang login hoặc register.

### Chỉ vào danh sách `<Route>`

### Nói

> React Router dựa vào URL để chọn component. Ví dụ `/users/:userId` hiển thị chi tiết user, `/photos/:userId` hiển thị ảnh và `/comments/:userId` hiển thị các bình luận user đã viết. Phần bắt đầu bằng dấu hai chấm là tham số động lấy từ URL.

---

## 4. Frontend gọi Backend như thế nào - khoảng 30 giây

### Mở file

```text
photo-sharing-v1/src/lib/fetchModelData.js
```

### Chỉ vào

```jsx
fetchModel
postJson
postForm
credentials: "include"
```

### Nói

> Các component không gọi API rời rạc mà dùng chung các hàm trong file này. `fetchModel` dùng cho GET, `postJson` dùng cho POST dữ liệu JSON và `postForm` dùng để upload ảnh.
>
> Tất cả request đều có `credentials: include` để trình duyệt gửi cookie session đến Backend.

---

## 5. Backend Express và session - khoảng 50 giây

### Mở file

```text
photo-sharing-be/index.js
```

### Chỉ vào thứ tự middleware

```jsx
cors(...)
express.json()
session(...)
app.use("/images", ...)
app.use(requireLogin)
```

### Nói

> Backend chạy bằng ExpressJS. Thứ tự middleware rất quan trọng. CORS cho phép Frontend ở cổng 3000 gọi Backend ở cổng 8081. `express.json` đọc JSON body. Session giúp Backend biết user nào đang đăng nhập.
>
> Folder `images` được phục vụ như file tĩnh, còn `requireLogin` chặn các API user, ảnh và bình luận nếu request chưa có `session.user_id`.

### Chỉ vào thứ tự router

### Nói

> API đăng nhập và đăng ký được đặt trước `requireLogin` nên có thể gọi khi chưa đăng nhập. Các API dữ liệu được đặt sau nên bắt buộc phải có session.

---

## 6. Demo đăng nhập - khoảng 35 giây

### Thao tác trên website

1. Mở trang `/login`.
2. Đăng nhập bằng tài khoản mẫu.

### Mở file

```text
photo-sharing-be/routes/AdminRouter.js
```

### Chỉ vào `POST /admin/login`

### Nói

> Khi submit form, Frontend gửi login name và password đến `/admin/login`. Backend tìm user trong MongoDB, kiểm tra password, sau đó lưu ID user vào session. Backend chỉ trả thông tin cần thiết và không trả password về Frontend.

---

## 7. Database và danh sách người dùng - khoảng 45 giây

### Mở file

```text
photo-sharing-be/db/userModel.js
```

### Nói

> Model User mô tả các field được lưu trong MongoDB như login name, password, họ tên, địa điểm, mô tả và nghề nghiệp.

### Mở file

```text
photo-sharing-be/db/photoModel.js
```

### Nói

> Model Photo lưu tên file ảnh, thời gian, ID chủ ảnh và mảng bình luận. Bình luận được lưu trực tiếp bên trong document ảnh, mỗi bình luận có nội dung, thời gian và ID người viết.

### Mở file

```text
photo-sharing-be/routes/UserRouter.js
```

### Chỉ vào `GET /user/list`

### Nói

> Danh sách user còn hiển thị số ảnh và số bình luận. Hai count này không lưu cố định trong User mà được Backend đếm từ dữ liệu Photo và Comment mỗi lần gọi API, nên luôn dựa trên dữ liệu thật.

---

## 8. Demo ảnh, bình luận và cập nhật count - khoảng 55 giây

### Thao tác trên website

1. Bấm vào count ảnh màu xanh của một user.
2. Thêm một bình luận vào ảnh.
3. Quan sát count bình luận màu đỏ cập nhật không cần F5.

### Mở file

```text
photo-sharing-be/routes/PhotoRouter.js
```

### Chỉ vào

```text
GET /photosOfUser/:id
POST /commentsOfPhoto/:photo_id
```

### Nói

> Khi xem ảnh, Frontend gọi `/photosOfUser/:id`. Backend lấy ảnh, tìm thông tin người viết bình luận rồi trả JSON hoàn chỉnh cho giao diện.
>
> Khi thêm bình luận, Frontend chỉ gửi nội dung. Backend lấy ID người viết từ session, thêm bình luận vào mảng comments của ảnh rồi lưu MongoDB.

### Quay lại `App.js`, chỉ vào `refreshUserCounts`

### Nói

> Sau khi thêm bình luận hoặc upload ảnh, Frontend tăng `userListRefreshKey`. `UserList` thấy key thay đổi sẽ gọi lại `/user/list`, vì vậy count cập nhật ngay mà không cần F5.

---

## 9. Demo upload ảnh và tính năng nâng cao - khoảng 35 giây

### Thao tác trên website

1. Bấm `Add Photo` và chọn một ảnh.
2. Quan sát count ảnh cập nhật.
3. Tick `Bật tính năng nâng cao`.
4. Bấm nút `Trước` hoặc `Sau`.
5. Bỏ tick để quay lại danh sách ảnh.

### Nói

> Upload ảnh sử dụng `FormData` ở Frontend và Multer ở Backend. File thật được lưu trong folder `photo-sharing-be/images`, còn MongoDB chỉ lưu tên file và thông tin ảnh.
>
> Tính năng nâng cao sử dụng URL có thêm `photoId`, ví dụ `/photos/:userId/:photoId`, để hiển thị một ảnh cụ thể và cho phép bookmark đường dẫn đó. Khi tắt tính năng, URL quay về `/photos/:userId` và giao diện hiển thị toàn bộ ảnh.

---

## 10. Kết luận - khoảng 20 giây

### Nói

> Tóm lại, React Router chọn giao diện dựa trên URL, các component gọi API bằng `fetch`, Express kiểm tra session và xử lý nghiệp vụ, còn Mongoose đọc ghi dữ liệu trong MongoDB Atlas.
>
> Các chức năng chính gồm đăng ký, đăng nhập, xem user, xem ảnh, xem bình luận, thêm bình luận, upload ảnh, cập nhật count không cần F5 và chế độ xem từng ảnh nâng cao.

---

## Thứ tự file ngắn gọn để ghi nhớ

```text
src/index.js
→ src/App.js
→ src/lib/fetchModelData.js
→ photo-sharing-be/index.js
→ routes/AdminRouter.js
→ db/userModel.js và db/photoModel.js
→ routes/UserRouter.js
→ routes/PhotoRouter.js
```

## Thứ tự demo ngắn gọn để ghi nhớ

```text
Đăng nhập
→ Xem danh sách user
→ Xem ảnh
→ Thêm bình luận
→ Quan sát count cập nhật
→ Upload ảnh
→ Bật và tắt tính năng nâng cao
```
