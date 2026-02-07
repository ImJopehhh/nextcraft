<div align="center">

# 🚀 NextCraft: Premium Next.js Admin Dashboard & Web Framework

[![Next.js 15](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Version](https://img.shields.io/badge/Version-1.0.0-FF4500?style=for-the-badge)](https://github.com/ImJopehhh/nextcraft)

**NextCraft** adalah *premium boilerplate* dan *web framework* yang dirancang untuk membangun aplikasi web modern berskala *enterprise* dengan kecepatan dan keindahan visual maksimal. Dikembangkan menggunakan **Next.js 16 App Router**, framework ini menggabungkan performa backend yang tangguh dengan estetika frontend kelas dunia.

[Features](#core-features-) • [Installation](#-installation-steps) • [API Reference](#-api-reference) • [Database Setup](#-setup-database)

</div>

---

## 💎 Core Features 💎

### 🛡️ Admin Dashboard (`/admin`)
- **Ultimate Security**: Proteksi **Timing Attacks**, **Bcrypt** hashing, dan **SQL Injection Resistance**.
- **Brute-Force Shield**: Sistem **IP-based Rate Limiting** dengan **Exponential Backoff Lockout**.
- **Role-Based Access Control (RBAC)**: Manajemen akses hirarkis untuk **Webmaster**, **Developer**, dan **Admin**.
- **Collapsible Sidebar**: Sidebar dinamis dengan fitur *accordion category* yang menghemat ruang kerja.
- **Global Settings UI**: Kendali penuh atas identitas situs (Site Name, Logo, SEO Description, Keywords, & Favicon) langsung dari dashboard.

### 🎨 Premium UI/UX Experience
- **Glassmorphism Design**: Interface modern dengan efek *blur* dan *transparency* yang elegan.
- **Smooth Animations**: Transisi halaman dan interaksi elemen didukung sepenuhnya oleh **Framer Motion**.
- **Global Toast Notifications**: Sistem notifikasi popup premium (Success, Warning, Error, Alert) untuk pengalaman interaktif.
- **Full Responsivity**: Dioptimalkan secara presisi untuk Desktop, Tablet, hingga perangkat Mobile terkecil.

### ⚡ Technical Foundation
- **Next.js 15 App Router**: Memanfaatkan teknologi React 19 terbaru dengan *Server Components* dan *Streaming*.
- **Middleware Protection**: Validasi session otomatis di level *edge* untuk keamanan rute admin.
- **Local File Upload**: Library upload file terintegrasi dengan validasi ukuran (max 2MB) dan tipe file.

---

## 🛠️ Technical Stack

NextCraft dibangun di atas fondasi teknologi termutakhir untuk menjamin stabilitas jangka panjang:

-   **Frontend**: React 19, Next.js 15, Tailwind CSS 4 Beta
-   **Animations**: Framer Motion
-   **Icons**: Lucide React
-   **Database ORM**: Prisma
-   **Storage**: Local File System
-   **Language**: TypeScript

---

## 🚀 Installation Steps

Ikuti langkah-langkah berikut untuk menjalankan NextCraft di mesin lokal Anda:

### 1. Clone Repository
```bash
git clone https://github.com/ImJopehhh/nextcraft.git
cd nextcraft
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
Buat file `.env` di direktori root dan sesuaikan konfigurasinya mengikuti struktur berikut:
```env
# [DATABASE CONFIGURATION]
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_PORT=3306
DB_NAME=nextcraft_db

# [AUTHENTICATION]
JWT_SECRET="your_secret_key"

# [APP SETTINGS]
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Setup Database
Sinkronisasikan skema database Prisma ke MySQL Anda:
```bash
npx prisma db push
```

### 5. Running Development
Jalankan server pengembangan:
```bash
npm run dev
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Melakukan autentikasi admin dan mendapatkan session. |
| `GET` | `/api/auth/me` | Mengambil data profile admin yang sedang login. |
| `GET/POST` | `/api/admin/users` | Mengelola daftar seluruh akun admin (List & Create). |
| `PUT/DELETE` | `/api/admin/users/[id]` | Mengupdate data admin atau menghapus akun secara permanen. |
| `GET/PUT` | `/api/settings` | Mengambil dan memperbarui konfigurasi global website. |
| `POST` | `/api/upload` | Mengunggah aset gambar (Logo/Favicon) ke penyimpanan lokal. |

---

## ⚠️ Important Callouts

> [!TIP]
> **DEFAULT ADMIN ACCOUNT**
> - **Email**: `admin@next.craft`
> - **Password**: `admin123`

> [!CAUTION]
> **SECURITY WARNING**
> Akun di atas dibuat secara otomatis untuk akses awal. Segera buat akun baru dengan password yang kuat dan hapus atau ubah akun default ini saat beralih ke lingkungan produksi untuk menghindari ancaman eksploitasi.

---


<div align="center">
  <p>Built with ❤️ by <b>NextCraft Team</b></p>
  <p><i>The Future of Rapid Web Development</i></p>
</div>
