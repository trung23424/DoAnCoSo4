# 🚀 AI SmartMeet — Trợ lý Phòng họp Thông minh & Biên bản AI

> **Đồ án Cơ sở 4** — Khoa Khoa học Máy tính  
> **Trường Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn (VKU)**  
> **Sinh viên thực hiện:** Lê Quốc Cường (24AI009) & Đỗ Quang Trung (24IT289)  
> **Giảng viên hướng dẫn:** ThS. Mai Lam  

---

## 📖 Giới thiệu Dự án

**AI SmartMeet** là hệ sinh thái hỗ trợ phòng họp trực tuyến ứng dụng trí tuệ nhân tạo (AI Meeting Secretary). Hệ thống kết hợp giữa mạng ngang hàng bảo mật **WebRTC P2P Mesh** và các mô hình học sâu tiên tiến nhất hiện nay:
- 🎙️ **OpenAI Whisper (STT)**: Nhận dạng giọng nói tiếng Việt thời gian thực chính xác cao (~98.4%).
- 🧠 **Google Gemini 1.5 Pro (NLP/LLM)**: Tự động phân tích, tóm tắt nội dung cuộc họp, trích xuất quyết định then chốt và phân công đầu việc (*Action Items*).
- ⚡ **WebRTC P2P Full-Mesh**: Truyền tải âm thanh/hình ảnh trực tiếp giữa các trình duyệt sinh viên mà không qua Media Server trung gian, mã hóa E2EE bảo mật.
- 🔥 **Firebase Backend Ecosystem**:
  - **Firebase Authentication**: Đăng ký, đăng nhập tài khoản an toàn.
  - **Cloud Firestore**: Lưu trữ dữ liệu cuộc họp, đồng bộ thời gian thực và làm kênh WebRTC Signaling.
  - **Firebase Storage**: Lưu trữ tệp âm thanh ghi âm (.wav 16kHz).
- 🛡️ **Admin Portal & RBAC**: Bảng điều khiển quản trị phân quyền đa cấp (*Admin*, *Host*, *Member*), giám sát phòng họp P2P trực tiếp và quản lý định mức tài nguyên AI Quotas.

---

## 🛠️ Công nghệ Sử dụng

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons.
- **Kiến trúc**: MVC (Model - View - Controller) tách bạch tầng dữ liệu, nghiệp vụ và giao diện.
- **Backend / BaaS**: Google Firebase (Authentication, Cloud Firestore, Cloud Storage).
- **Giao thức mạng**: WebRTC DataChannel & MediaStream, STUN/TURN ICE Candidates.
- **AI Core**: OpenAI Whisper large-v3 & Google Gemini 1.5 Pro.

---

## 📦 Hướng dẫn Cài đặt & Khởi chạy

### 1. Yêu cầu môi trường
- Đã cài đặt [Node.js](https://nodejs.org/) (phiên bản v18 trở lên).
- Trình duyệt hiện đại hỗ trợ WebRTC (Google Chrome, Microsoft Edge, Cốc Cốc, Brave,...).

### 2. Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
```

### 3. Khởi chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Trang web sẽ chạy tại địa chỉ: `http://localhost:5173/`

### 4. Đóng gói bản Production (Build)
```bash
npm run build
```

---

## 📁 Cấu trúc Thư mục Dự án (MVC Architecture)

```
DoAnCoSo4/
├── src/
│   ├── models/                # Mock data & định dạng dữ liệu (Meetings, Details, Admin, Settings)
│   ├── controllers/           # Custom Hooks điều khiển nghiệp vụ (useDashboard, useAdmin, useAuth,...)
│   ├── views/                 # Giao diện người dùng
│   │   ├── admin/             # Các tab của Admin Portal (Users, Overview, Meetings, Quota)
│   │   ├── components/        # Components dùng chung (Sidebar, MeetingCard, CreateModal)
│   │   ├── DashboardView.jsx
│   │   ├── MeetingHistoryView.jsx
│   │   ├── MeetingDetailsView.jsx
│   │   ├── MeetingRoomView.jsx
│   │   ├── SettingsView.jsx
│   │   └── AuthView.jsx
│   ├── services/              # Kết nối hạ tầng ngoài (firebase.js, authService.js, meetingsService.js)
│   ├── App.jsx                # Điều hướng Router chính
│   └── main.jsx
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---
*© 2026 AI SmartMeet Team — Khoa Khoa học Máy tính, Đại học CNTT & TT Việt - Hàn (VKU).*
