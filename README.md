# 🚀 NextCraft

> **⚠️ IMPORTANT: This project is currently under active development and is NOT ready for production use.**

A modern, full-stack web application built with Next.js 16, featuring a professional admin dashboard, secure authentication system, and a stunning guest-facing interface.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.19.2-2D3748?style=for-the-badge&logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

---

## ✨ Features

### 🎨 Guest Interface
- **Modern Landing Page** with smooth animations and dark theme aesthetics
- **Enhanced Navigation** with dropdown menus for Server, Community, Support, and Leaderboard
- **Scroll Animations** - Navbar shrinks and becomes transparent on scroll
- **Fully Responsive** design across all devices
- **Optimized Loading Screen** - Only appears on initial visit or hard refresh

### 🔐 Authentication & Security
- **JWT-based Session Management** with HttpOnly cookies
- **Volatile Sessions** - All sessions reset on server restart for enhanced security
- **In-Memory Rate Limiting** - 3 failed login attempts = 1-minute cooldown
- **"Remember Me" Functionality** - Extends session from 1 day to 7 days
- **Password Encryption** using bcryptjs
- **Protected Routes** with middleware authentication

### 📊 Admin Dashboard
- **Professional Dark-Themed UI** with glassmorphism effects
- **Rank-Based Access Control** - Webmaster, Developer, and Admin roles
- **Dynamic Page Titles** in header
- **Responsive Sidebar** with collapse functionality
- **Mobile Hamburger Menu** with animated slide-out drawer
- **Specialized Error Pages** - Custom 404 and 403 pages for admin area
- **Real-time Session Monitoring**
- **Profile Box** with role indicators and quick logout

### 🗄️ Database & Backend
- **Prisma ORM** with MySQL integration
- **Automated Database Initialization** on server startup
- **Secure API Routes** with proper error handling
- **Environment-based Configuration**

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.1.6](https://nextjs.org/) with Turbopack
- **Language**: TypeScript
- **Database**: MySQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **UI/Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Tailwind CSS (via Next.js)

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MySQL 8.0+
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ImJopehhh/nextcraft.git
   cd nextcraft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_PORT=3306
   DB_NAME=nextcraft_db
   DATABASE_URL="mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # App Settings
   APP_URL=http://localhost:3000

   # Initial Admin Account (Auto-created on first run)
   INITIAL_ADMIN_EMAIL=admin@web.next
   INITIAL_ADMIN_USERNAME=webmaster
   INITIAL_ADMIN_PASSWORD=admin123
   ```

4. **Initialize the database**
   ```bash
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Guest Site: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin/login`
   - Default Credentials: `webmaster` / `admin123`

---

## 🏗️ Project Structure

```
NextCraft/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin dashboard pages
│   │   ├── layout.tsx       # Admin layout with sidebar
│   │   ├── page.tsx         # Admin overview
│   │   ├── login/           # Admin login page
│   │   └── not-found.tsx    # Admin-specific 404
│   ├── api/                 # API routes
│   │   └── auth/            # Authentication endpoints
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── not-found.tsx        # Global 404 page
├── components/              # React components
│   ├── Admin/               # Admin-specific components
│   ├── Layout/              # Layout components (Navbar, Footer, etc.)
│   └── Home/                # Landing page sections
├── lib/                     # Utility functions
│   ├── auth.ts              # JWT utilities
│   ├── security.ts          # Rate limiting logic
│   ├── prisma.ts            # Prisma client
│   └── init.ts              # Database initialization
├── prisma/                  # Prisma schema and migrations
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
│   └── assets/              # Images, logos, etc.
└── middleware.ts            # Route protection middleware
```

---

## 🔒 Security Features

- **Volatile Sessions**: Sessions are stored in server memory and reset on restart
- **In-Memory Rate Limiting**: Prevents brute-force attacks without database overhead
- **HttpOnly Cookies**: Session tokens are not accessible via JavaScript
- **Secure Password Hashing**: One-way bcrypt encryption
- **Role-Based Access Control**: Granular permissions for different admin levels
- **Protected API Routes**: Middleware authentication on all sensitive endpoints

---

## 🎯 Roadmap

- [ ] User registration and profile management
- [ ] Email verification system
- [ ] Advanced analytics dashboard
- [ ] Content management system (CMS)
- [ ] Multi-language support (i18n)
- [ ] Dark/Light theme toggle
- [ ] API documentation with Swagger
- [ ] Comprehensive test coverage
- [ ] Docker containerization
- [ ] CI/CD pipeline

---

## 🤝 Contributing

This project is currently in early development. Contributions, issues, and feature requests are welcome once the project reaches a stable state.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**NextCraft Team**
- GitHub: [@ImJopehhh](https://github.com/ImJopehhh)

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI animations powered by [Framer Motion](https://www.framer.com/motion/)
- Icons from [Lucide](https://lucide.dev/)
- Database management with [Prisma](https://www.prisma.io/)

---

<div align="center">
  <p>Made with ❤️ and ☕</p>
  <p><strong>⚠️ Remember: This is a development project. Do not use in production without proper security audits and testing.</strong></p>
</div>
