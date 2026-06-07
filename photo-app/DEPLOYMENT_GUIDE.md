# Hướng dẫn Deploy Photo Sharing lên Vercel

## 📋 Yêu cầu trước khi deploy

1. **Vercel Account**: Đăng ký tài khoản tại [vercel.com](https://vercel.com)
2. **Git Repository**: Push code lên GitHub/GitLab/Bitbucket
3. **MongoDB Atlas**: Database MongoDB được cấu hình sẵn
4. **Node.js**: Phiên bản 16+ cài đặt trên máy local

## 🚀 Các bước deploy

### Bước 1: Chuẩn bị code trên GitHub

```bash
# Nếu chưa có repo
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/photo-sharing.git
git push -u origin main
```

### Bước 2: Deploy Backend (photo-sharing-be)

#### 2.1 Trên Vercel Dashboard

1. Truy cập [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Chọn repository **photo-sharing-be**
4. **Root Directory**: Để trống hoặc chọn folder chứa `package.json`
5. Click **"Deploy"**

#### 2.2 Thiết lập Environment Variables

Sau khi deploy tạo bản đầu tiên, vào **Settings** → **Environment Variables** và thêm:

| Key | Value | Ghi chú |
|-----|-------|--------|
| `DB_URL` | `mongodb+srv://...` | MongoDB connection string |
| `SESSION_SECRET` | `your-secret-key-here` | Bất kỳ chuỗi random nào |
| `FRONTEND_URL_PROD` | `https://your-frontend-url.vercel.app` | URL của frontend sau khi deploy |

#### 2.3 Kích hoạt Deploy lại

Sau khi thêm environment variables, vào **Deployments** → Click deployment cuối → **Redeploy** để áp dụng biến môi trường.

**Ghi chú**: Nếu MongoDB connection string không hợp lệ, deployment sẽ thất bại. Kiểm tra:
- IP Whitelist trong MongoDB Atlas (cho phép `0.0.0.0/0`)
- Connection string có đúng username/password không

### Bước 3: Deploy Frontend (photo-sharing-v1)

#### 3.1 Cập nhật Environment Variable

Sau khi backend deploy thành công, lấy URL của backend (ví dụ: `https://photo-be.vercel.app`).

Cập nhật `.env.example`:
```
REACT_APP_API_URL=https://photo-be.vercel.app
```

#### 3.2 Deploy Frontend

1. Truy cập [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Chọn repository **photo-sharing-v1**
4. **Root Directory**: Để trống
5. **Environment Variables**: 
   - `REACT_APP_API_URL` = `https://photo-be.vercel.app` (thay bằng URL thực của backend)
6. Click **"Deploy"**

#### 3.3 Xác minh Deploy

Frontend sẽ tự động:
- Build React project (chạy `npm run build`)
- Deploy thư mục `build/` lên Vercel CDN

### Bước 4: Kiểm tra Connection

1. Truy cập frontend URL
2. Mở **Developer Console** (F12)
3. Kiểm tra Network tab:
   - Các request đến backend URL phải thành công (status 200)
   - Nếu có CORS error, kiểm tra lại `FRONTEND_URL_PROD` ở backend

## 🔧 Xử lý sự cố thường gặp

### CORS Error
**Vấn đề**: `Access to XMLHttpRequest from origin 'X' has been blocked by CORS policy`

**Giải pháp**:
1. Vào Backend Settings → Environment Variables
2. Thêm hoặc cập nhật `FRONTEND_URL_PROD` với URL chính xác của frontend
3. Redeploy backend

### MongoDB Connection Failed
**Vấn đề**: `MongoError: connect ECONNREFUSED`

**Giải pháp**:
1. Kiểm tra `DB_URL` có đúng không
2. Trên MongoDB Atlas, vào **Network Access** → **Add IP Address** → nhập `0.0.0.0/0` (cho phép mọi IP)
3. Redeploy backend

### Frontend không tìm thấy Backend
**Vấn đề**: Frontend load nhưng không thể fetch dữ liệu

**Giải pháp**:
1. Kiểm tra `REACT_APP_API_URL` environment variable
2. Đảm bảo không có `/` cuối cùng (nếu không cần)
3. Rebuild frontend

## 📝 Cấu trúc Files quan trọng

### Backend
```
photo-sharing-be/
├── vercel.json          # ✅ Đã tạo
├── .env.example         # ✅ Đã tạo
├── .env                 # ⚠️ Tạo riêng, không commit
├── index.js             # ✅ Đã cập nhật CORS
└── db/
    └── dbConnect.js     # Đọc DB_URL từ env
```

### Frontend
```
photo-sharing-v1/
├── vercel.json          # ✅ Đã tạo
├── .env.example         # ✅ Đã tạo
├── .env.local           # ✅ Đã tạo (local dev)
├── package.json         # ✅ Có build script
└── src/
    └── lib/
        └── fetchModelData.js  # ✅ Đã cập nhật
```

## 💡 Tips

- **Auto-deploy**: Mỗi khi push code lên GitHub, Vercel tự động deploy lại
- **Rollback**: Nếu deploy mới gây lỗi, vào Deployments → click deployment cũ → "Promote to Production"
- **Custom Domain**: Settings → Domains → thêm domain của riêng bạn
- **SSL/HTTPS**: Mặc định bao gồm SSL certificate miễn phí

## 🔗 Tài liệu thêm

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Node.js Runtime](https://vercel.com/docs/functions/runtimes/node-js)
- [Vercel Static Generation](https://vercel.com/docs/concepts/deployments/static-exports)
- [MongoDB Atlas Vercel Integration](https://www.mongodb.com/docs/atlas/app-services/reference/services/http/)

---

**Ghi chú**: Sau lần deploy đầu tiên, hãy kiểm tra logs ở Vercel Dashboard để phát hiện lỗi sớm.
