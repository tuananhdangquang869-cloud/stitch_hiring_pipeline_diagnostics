# 🎯 Áp Lực Kế (Stitch Hiring Pipeline Diagnostics)

> **Hệ thống Giám sát Áp lực Tuyển dụng & Chẩn đoán Phễu Nhân sự Toàn diện**  
> *Recruitment Pipeline Telemetry, Bottleneck Diagnostics & Candidate Funnel Analytics*

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![CI / Streak](https://github.com/tuananhdangquang869-cloud/stitch_hiring_pipeline_diagnostics/actions/workflows/daily-commit.yml/badge.svg)](https://github.com/tuananhdangquang869-cloud/stitch_hiring_pipeline_diagnostics/actions)

---

## 📌 Giới thiệu Tổng quan

**Áp Lực Kế (Stitch Hiring Pipeline Diagnostics)** là nền tảng phân tích và chẩn đoán dữ liệu tuyển dụng chuyên sâu, được thiết kế dành cho **C-Suite, VP of HR, Hiring Managers và Lead Recruiters**. 

Không chỉ là một dashboard hiển thị số lượng ứng viên thông thường, hệ thống hoạt động như một chiếc **"áp kế" đo áp lực đường ống tuyển dụng**:
- Tự động phát hiện **"Nút thắt cổ chai" (Bottlenecks)** nơi ứng viên bị ứ đọng nhiều ngày nhất.
- Bóc tách chính xác **tỷ lệ rơi rụng (Drop-off Rate)** qua từng chặng (Applied ➔ Screened ➔ Tech Interview ➔ Offer ➔ Hired).
- Chuẩn đoán và gắn mã nguyên nhân thất thoát (Mismatch kỹ thuật, kỳ vọng lương, văn hóa, ghosted, đối thủ chèo kéo).
- Chấm điểm **Chỉ số Sức khỏe Tuyển dụng (Funnel Health Score)** theo thời gian thực.

---

## 🚀 Tính năng Cốt lõi của Website

### 1. 📊 Phân tích & Chẩn đoán Phễu Tuyển dụng (`/` hoặc `/dashboard`)
- **Phễu động trực quan 5 giai đoạn**: Hiển thị rõ lượng ứng viên đầu vào (Volume In), ứng viên vượt qua (Passed) và tỷ lệ rớt (Drop Rate).
- **Phân tích Rơi rụng dạng Thác nước (Drop-Off Waterfall Chart)**: Đồ thị thể hiện trực quan lượng ứng viên sụt giảm qua từng giai đoạn tuyển dụng.
- **Biểu đồ Nhiệt Cohort (Cohort Analysis Heatmap)**: Theo dõi chất lượng và tốc độ chuyển đổi ứng viên theo từng đợt nộp đơn (tuần/tháng).
- **Bộ điều hướng thời gian (Funnel Time Scrubber)**: Tua lại lịch sử dữ liệu phễu theo ngày, tuần, tháng hoặc quý.
- **Stage Detail Modal**: Nhấp vào từng giai đoạn bất kỳ để mở cửa sổ kiểm tra chi tiết: xem danh sách ứng viên đang ứ đọng, số ngày lưu trú (`daysInStage`), lý do trượt và người phụ trách.

### 2. 👔 Tổng quan Điều hành C-Suite (`/executive`)
- Tóm tắt các chỉ số vĩ mô cho Ban Giám đốc:
  - **Tỷ lệ chuyển đổi tổng thể (Overall Conversion Rate)**.
  - **Thời gian tuyển dụng trung bình (Time-to-Hire)** so với kỳ trước.
  - **Phân bổ áp lực theo phòng ban (Departmental Pressure)**: Kỹ thuật (Engineering), Sản phẩm (Product), Thiết kế (Design), v.v.
  - Cảnh báo các vị trí tuyển dụng đang ở mức **Nguy cấp (Critical)** hoặc **Cần chú ý (Needs Attention)**.

### 3. 👥 Khám phá Dữ liệu Ứng viên (`/candidates`)
- Bảng tra cứu toàn bộ ứng viên kèm mã định danh (Candidate ID: `BW-1022`, `AS-4419`,...).
- Bộ lọc đa chiều: Theo trạng thái (`Đang xử lý`, `Đã rớt`, `Đã tuyển`), vị trí tuyển dụng, và Recruiter phụ trách.
- **Chỉ số sức khỏe ứng viên (Health Index 0-100)**: Đánh giá khả năng thành công và mức độ rủi ro bị mất ứng viên.

### 4. 💼 Quản trị Vị trí Tuyển dụng (`/jobs`)
- Quản lý danh mục requisition (mã REQ, Hiring Manager, số ngày mục tiêu điền vị trí `targetDaysToFill`).
- Tạo mới Requisition nhanh chóng qua **NewRequisitionModal**.
- Đổi trạng thái tuyển dụng (`ACTIVE`, `PAUSED`, `CLOSED`).

### 5. 🛠️ Công cụ Nhập/Xuất & Hệ thống
- **Nhập dữ liệu qua file CSV**: Tích hợp modal upload với parser `PapaParse`, tự động đồng bộ ứng viên và thống kê phễu vào database.
- **Xuất báo cáo đa định dạng**: Hỗ trợ xuất các biểu đồ trực tiếp ra file **PNG, SVG** hoặc tải dữ liệu **CSV**.
- **Song ngữ hoàn chỉnh (i18n)**: Chuyển đổi linh hoạt giữa **Tiếng Việt 🇻🇳** và **English (US) 🇺🇸** trên toàn bộ giao diện và thuật ngữ chuyên ngành.
- **Chế độ giao diện Kinetic**: Theme tối hiện đại (Dark UI), tương phản cao, tối ưu hiển thị số liệu telemetry.

---

## 🏗️ Kiến trúc & Ngăn xếp Công nghệ (Tech Stack)

| Thành phần | Công nghệ sử dụng |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router), React 19 |
| **Ngôn ngữ** | TypeScript 5 (Strict Mode) |
| **Styling** | Tailwind CSS v4, Radix UI Primitives, Lucide Icons |
| **Biểu đồ & Analytics** | Recharts v3 (ResponsiveContainer, Waterfall, Heatmaps) |
| **Cơ sở dữ liệu** | SQLite kết hợp Prisma ORM v8 |
| **Xử lý dữ liệu** | PapaParse (CSV Import), Canvas API (Image Export) |
| **Tự động hóa CI/CD** | GitHub Actions (Cron Telemetry & Green Streak) |

---

## 📁 Cấu trúc Thư mục Dự án

```bash
stitch_hiring_pipeline_diagnostics/
├── .github/
│   └── workflows/
│       └── daily-commit.yml         # GitHub Actions tự động hoá telemetry & giữ streak xanh
├── prisma/
│   ├── dev.db                       # Database SQLite lưu trữ dữ liệu tuyển dụng
│   ├── schema.prisma                # Định nghĩa models: JobRequisition, Stage, Candidate, StageEntry
│   └── seed.ts                      # Script tạo dữ liệu mẫu thực tế
├── src/
│   ├── app/
│   │   ├── api/                     # REST API Endpoints (candidates, funnel, jobs, executive-summary)
│   │   ├── dashboard/page.tsx       # Trang Dashboard Chẩn đoán Phễu
│   │   ├── executive/page.tsx       # Trang Báo cáo Điều hành C-Suite
│   │   ├── candidates/page.tsx      # Trang Quản lý & Khám phá Ứng viên
│   │   ├── jobs/page.tsx            # Trang Quản lý Vị trí Tuyển dụng
│   │   ├── settings/page.tsx        # Trang Cấu hình & Tùy chọn Hệ thống
│   │   ├── globals.css              # Style toàn cục & Kinetic Dark Theme
│   │   └── layout.tsx               # Root Layout, AppContext & Navigation
│   ├── components/
│   │   ├── candidates/              # Components bảng ứng viên & bộ lọc
│   │   ├── executive/               # Components biểu đồ điều hành cấp cao
│   │   ├── funnel/                  # Phễu tuyển dụng, Waterfall chart, Heatmap, Tooltip
│   │   ├── jobs/                    # Quản lý Requisition & Phân công
│   │   ├── layout/                  # Sidebar, Header, Profile, Notification Dropdown
│   │   ├── modals/                  # Stage Detail, CSV Import, New Requisition
│   │   └── ui/                      # Icons, StatusBadge, Skeleton, EmptyState
│   ├── context/
│   │   └── AppContext.tsx           # Quản lý State toàn cục (Active Job, Ngôn ngữ, Bộ lọc)
│   └── lib/
│       ├── chart-exporter.ts        # Tiện ích xuất biểu đồ ra PNG/SVG/CSV
│       ├── translations.ts          # Từ điển song ngữ Anh - Việt (800+ dòng)
│       ├── types.ts                 # Định nghĩa kiểu dữ liệu TypeScript
│       └── prisma.ts                # Prisma Client Singleton
└── README.md
```

---

## 💻 Hướng dẫn Cài đặt & Khởi chạy

### Yêu cầu tiên quyết:
- **Node.js** >= 18.x
- **npm** hoặc **yarn / pnpm**

### Các bước cài đặt:

1. **Clone repository về máy**:
   ```bash
   git clone https://github.com/tuananhdangquang869-cloud/stitch_hiring_pipeline_diagnostics.git
   cd stitch_hiring_pipeline_diagnostics
   ```

2. **Cài đặt thư viện dependencies**:
   ```bash
   npm install
   ```

3. **Khởi tạo Cơ sở dữ liệu Prisma (SQLite)**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Khởi chạy môi trường phát triển (Dev server)**:
   ```bash
   npm run dev
   ```

5. **Mở trình duyệt**:
   Truy cập **[http://localhost:3000](http://localhost:3000)** để trải nghiệm giao diện Áp Lực Kế.

---

## ⚡ Tự động hóa Telemetry & GitHub Green Streak

Dự án tích hợp sẵn quy trình CI/CD tại [`.github/workflows/daily-commit.yml`](.github/workflows/daily-commit.yml):
- Tự động chạy theo lịch trình (01:00 UTC & 13:30 UTC hàng ngày).
- Tự động ghi nhận log kiểm tra sức khỏe hệ thống vào `.github/activity.log`.
- Commit bằng thông tin định danh chính chủ để duy trì **chuỗi đóng góp xanh (Green Streak)** liên tục trên hồ sơ GitHub.

---

*Phát triển và duy trì bởi [@tuananhdangquang869-cloud](https://github.com/tuananhdangquang869-cloud)*
