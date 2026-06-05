# Photo Sharing Backend

Backend ExpressJS dùng MongoDB Atlas, Mongoose, session login và upload ảnh.

## Cài package

```bash
npm install
```

## Nạp dữ liệu mẫu

```bash
npm run seed
```

User mẫu sau khi seed:

- `login_name`: `ian_malcolm`
- `password`: `password`

## Chạy server

```bash
npm start
```

Server mặc định chạy tại `http://localhost:8081`.

## API chính

- `POST /admin/login`
- `POST /admin/logout`
- `GET /admin/currentUser`
- `POST /user`
- `GET /user/list`
- `GET /user/:id`
- `GET /photosOfUser/:id`
- `GET /commentsOfUser/:id`
- `POST /commentsOfPhoto/:photo_id`
- `POST /photos/new`
