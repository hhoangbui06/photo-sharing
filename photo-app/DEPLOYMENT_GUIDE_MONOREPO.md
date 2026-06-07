# 🚀 Deploy Photo Sharing Monorepo lên Vercel

Hướng dẫn chi tiết cho cấu trúc: `photo-app/` → `photo-sharing-v1/` (FE) + `photo-sharing-be/` (BE)

---

## 📋 Bước 1: Chuẩn bị Repository trên GitHub

### 1.1 Tạo Repository mới trên GitHub

1. Vào [github.com/new](https://github.com/new)
2. Tên repo: `photo-sharing` (hoặc tên khác)
3. Description: `Photo Sharing App - MERN Stack`
4. Chọn `Public` hoặc `Private`
5. Click **Create repository**

### 1.2 Push code hiện tại lên GitHub

```powershell
# Mở PowerShell ở thư mục chứa photo-app
cd c:\Users\admin\OneDrive\Máy tính\LTW\photo-app\photo-app

# Khởi tạo Git (nếu chưa có)
git init

# Thêm tất cả files
git add .
git commit -m "Initial commit: Photo Sharing App with v1 (FE) and BE"

# Đặt tên nhánh chính
git branch -M main

# Thêm remote repository
git remote add origin https://github.com/YOUR_USERNAME/photo-sharing.git

# Push lên GitHub
git push -u origin main
```

**Thay `YOUR_USERNAME` bằng username GitHub của bạn**

✅ Sau bước này, repository sẽ có cấu trúc:
```
photo-sharing/
├── photo-sharing-v1/    (Frontend)
├── photo-sharing-be/    (Backend)
└── DEPLOYMENT_GUIDE.md
```

---

## 🔌 Bước 2: Deploy Backend trước (photo-sharing-be)

### 2.1 Tạo Vercel Project cho Backend

1. Vào [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Chọn repository `photo-sharing`
4. ⚠️ **Quan trọng**: Thiết lập **Root Directory**
   - Bỏ tích "Root directory (default)"
   - Chọn thư mục: `photo-sharing-be/`
5. Không cần thay đổi gì khác, click **"Deploy"**

### 2.2 Chợ đợi deployment hoàn thành

- Vercel sẽ build project, có thể mất 2-3 phút
- Khi thấy ✅ **Ready**, tiếp tục bước 2.3

### 2.3 Thêm Environment Variables

1. Vào **Settings** → **Environment Variables**
2. Thêm các biến sau:

| Key | Value | Lấy từ đâu |
|-----|-------|-----------|
| `DB_URL` | `mongodb+srv://username:password@cluster.mongodb.net/photo-sharing?retryWrites=true&w=majority` | MongoDB Atlas |
| `SESSION_SECRET` | `photo-sharing-super-secret-123456` | Bất kỳ chuỗi random nào |
| `FRONTEND_URL_PROD` | Để trống (cập nhật sau) | Sẽ update sau khi FE deploy |

3. Click **"Save"**

### 2.4 Redeploy Backend

1. Vào **Deployments**
2. Click deployment mới nhất
3. Click **"Redeploy"** để áp dụng environment variables
4. Chờ tới khi ✅ **Ready**
5. **Lưu URL Backend** (ví dụ: `https://photo-sharing-be.vercel.app`)

---

## 🎨 Bước 3: Deploy Frontend (photo-sharing-v1)

### 3.1 Tạo Vercel Project cho Frontend

1. Vào [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Chọn repository `photo-sharing` **lần thứ 2**
4. ⚠️ **Quan trọng**: Thiết lập **Root Directory**
   - Bỏ tích "Root directory (default)"
   - Chọn thư mục: `photo-sharing-v1/`
5. Bước **"Environment Variables"**:
   - Thêm: `REACT_APP_API_URL` = URL Backend từ bước 2.4
   - Ví dụ: `https://photo-sharing-be.vercel.app`
6. Click **"Deploy"**

### 3.2 Chờ deployment hoàn thành

- Khi thấy ✅ **Ready**, frontend đã deploy thành công
- **Lưu URL Frontend** (ví dụ: `https://photo-sharing-v1.vercel.app`)

---

## 🔗 Bước 4: Cập nhật CORS ở Backend

Backend hiện tại chỉ cho phép frontend chạy ở `localhost:3000`. Cần cập nhật để chấp nhận frontend production.

### 4.1 Cập nhật Environment Variable

Vào Backend project trên Vercel:
1. **Settings** → **Environment Variables**
2. Cập nhật `FRONTEND_URL_PROD` = URL Frontend của bạn
   - Ví dụ: `https://photo-sharing-v1.vercel.app`
3. Click **"Save"**

### 4.2 Redeploy Backend

1. Vào **Deployments**
2. Click deployment mới nhất
3. Click **"Redeploy"**
4. Chờ tới ✅ **Ready**

---

## ✅ Bước 5: Kiểm tra kết nối

### 5.1 Truy cập Frontend

1. Mở URL Frontend ở trình duyệt
2. Mở **Developer Tools** (F12 hoặc Right-click → Inspect)
3. Vào tab **Network**
4. Làm một hành động như login/register/upload photo
5. Kiểm tra các request:
   - ✅ Status `200` / `201` = OK
   - ❌ Status `301` / `403` / `CORS error` = Có vấn đề

### 5.2 Kiểm tra Backend API trực tiếp

Mở URL Backend ở trình duyệt:
```
https://photo-sharing-be.vercel.app/
```

Nên thấy response:
```json
{
  "message": "API Photo Sharing đang chạy."
}
```

---

## 🔧 Xử lý lỗi thường gặp

### ❌ CORS Error: "Access to XMLHttpRequest blocked by CORS policy"

**Nguyên nhân**: Frontend không được phép kết nối đến backend

**Giải pháp**:
1. Kiểm tra `FRONTEND_URL_PROD` ở Backend Settings
2. Đảm bảo URL đúng (không có `/` cuối)
3. Redeploy Backend

```javascript
// File: photo-sharing-be/index.js (đã cập nhật)
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PROD,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
```

---

### ❌ MongoDB Connection Error: "ECONNREFUSED" hoặc "connection timeout"

**Nguyên nhân**: Vercel không thể kết nối đến MongoDB

**Giải pháp**:

1. **Kiểm tra Connection String**:
   - Mở [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
   - Vào cluster → **Connect** → **Drivers**
   - Copy connection string đầy đủ
   - Thay `<password>` bằng password
   - Ví dụ: `mongodb+srv://username:mypassword@cluster0.abcd.mongodb.net/photo-sharing?retryWrites=true&w=majority`

2. **Kiểm tra Network Access**:
   - MongoDB Atlas → **Network Access**
   - Xem IP Whitelist
   - **Thêm IP**: `0.0.0.0/0` (cho phép tất cả IP)
   - Click **Confirm**

3. **Cập nhật Backend**:
   - Vercel Backend Settings → Environment Variables
   - Cập nhật `DB_URL` với connection string chính xác
   - **Redeploy** backend

---

### ❌ Frontend không tìm thấy Backend: Status `502 Bad Gateway`

**Nguyên nhân**: Backend không hoạt động hoặc API không đúng

**Giải pháp**:

1. Kiểm tra Backend logs:
   - Vercel Backend dashboard → **Deployments**
   - Click deployment → **Logs**
   - Tìm error messages

2. Đảm bảo Backend đang chạy:
   ```bash
   # Test API locally
   curl https://photo-sharing-be.vercel.app/
   ```

3. Kiểm tra `REACT_APP_API_URL` ở Frontend:
   - Vercel Frontend Settings → Environment Variables
   - Giá trị phải chính xác: `https://photo-sharing-be.vercel.app`
   - Không có `/api` hoặc `/v1` ở cuối (nếu không cần)

---

### ❌ "Build failed" hoặc "Function failed to build"

1. Vào **Deployments** → Click deployment lỗi
2. Vào **Logs** → Xem lỗi chi tiết
3. Thường là do:
   - Dependencies thiếu → cập nhật `package.json`
   - Node version không tương thích → Vercel cố gắng dùng version cũ
   - Environment variables thiếu → thêm vào Settings

**Giải pháp**:
- Cập nhật code
- Thêm environment variables
- Push lên GitHub
- Vercel sẽ redeploy tự động

---

## 📊 Kiến trúc Deploy cuối cùng

```
GitHub Repository (photo-sharing)
├── photo-sharing-v1/
│   ├── vercel.json ✅
│   ├── .env.example ✅
│   ├── package.json ✅
│   └── src/
│       └── lib/fetchModelData.js ✅
│
└── photo-sharing-be/
    ├── vercel.json ✅
    ├── .env.example ✅
    ├── package.json ✅
    └── index.js ✅

┌─────────────────────────────────────────┐
│          VERCEL DEPLOYMENT              │
├─────────────────────────────────────────┤
│                                         │
│  Vercel Project 1: photo-sharing-be    │
│  Root: photo-sharing-be/               │
│  URL: https://photo-sharing-be.vercel.app
│  Environment:                          │
│  ├── DB_URL=mongodb+srv://...          │
│  ├── SESSION_SECRET=xxx                │
│  └── FRONTEND_URL_PROD=https://...v1   │
│                                         │
│  Vercel Project 2: photo-sharing-v1    │
│  Root: photo-sharing-v1/               │
│  URL: https://photo-sharing-v1.vercel.app
│  Environment:                          │
│  └── REACT_APP_API_URL=https://...be   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🆘 Cần giúp?

Nếu gặp vấn đề:

1. **Kiểm tra Logs**: Vào Vercel Project → Deployments → click deployment → Logs
2. **Kiểm tra Environment Variables**: Settings → Environment Variables
3. **Kiểm tra Console**: Browser DevTools (F12) → Console tab
4. **Kiểm tra Network**: Browser DevTools → Network tab → click request → xem response

---

## ⚡ Tips quan trọng

✅ **Cần làm**:
- Push code lên GitHub trước khi deploy
- Deploy Backend trước Frontend
- Thêm Environment Variables
- Redeploy sau khi thay đổi variables

❌ **Không nên làm**:
- Để URL hardcode trong code (dùng environment variables)
- Commit `.env` file (dùng `.env.example`)
- Quên cập nhật CORS khi có frontend URL mới

---

**Good luck! 🎉 Sau khi hoàn thành, bạn sẽ có:**
- Frontend: `https://photo-sharing-v1.vercel.app`
- Backend: `https://photo-sharing-be.vercel.app`
- Auto-deploy khi push code lên GitHub
