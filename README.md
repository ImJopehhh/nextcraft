<div align="center">

# 🚀 NextCraft - The Next Generation of FullStack

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Version](https://img.shields.io/badge/Version-1.0.0-FF4500?style=for-the-badge)](https://github.com/ImJopehhh/nextcraft)

**NextCraft** is a high-performance, enterprise-ready admin dashboard and full-stack framework built with **Next.js 16**, **Prisma**, and **MySQL**. It is designed to be the ultimate foundation for developers who prioritize security, stability, and a professional-grade deployment workflow.

</div>

---

## 📖 Introduction

NextCraft provides a robust architecture for building modern web applications. It goes beyond a simple template by integrating a **Fail-Safe Update System**, **Enterprise-Grade Security**, and a **Dynamic Interface Manager**. Whether you are building a corporate site or a complex SaaS dashboard, NextCraft handles the heavy lifting of backend logic and administrative control.

---

## 💎 Core Features

### 🔐 Advanced Security

* **JWT-Based Authentication**: Secure sessions using JSON Web Tokens stored in **HTTP-only cookies** to prevent XSS.
* **Brute-Force Protection**: Integrated **Rate Limiting** logic for login attempts to thwart automated attacks.
* **Route Guarding**: Next.js Middleware-driven protection for all `/admin` routes.
* **Encrypted Storage**: Password hashing using **Bcrypt.js** for maximum data integrity.

### 📋 Dynamic Content Management (CMS)

NextCraft includes an **Interface Manager** that allows you to control your landing page directly from the dashboard:

* **Hero Section**: Customize titles, descriptions, and CTAs in real-time.
* **Feature Grid**: Manage service listings with dynamic icons and content.
* **Team Management**: CRUD operations for team profiles and social links.
* **About Us**: Dedicated editor for company narratives.
* **Global Settings**: Centralized management for Site Names, Metadata, and SEO configurations.

---

## 🛠️ Technical Stack

* **Core**: Next.js 16 (App Router), React 19, TypeScript
* **ORM**: Prisma (Type-safe Database Client)
* **Database**: MySQL
* **Icons**: Lucide React
* **Authentication**: JOSE & Bcrypt.js
* **Styling**: Tailwind CSS & PostCSS

---

## 🚀 Getting Started

### 1. Prerequisites

* Node.js 18.x or higher
* MySQL Database instance
* Git

### 2. Installation

```bash
git clone https://github.com/imjopehhh/nextcraft.git
cd nextcraft
npm install

```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL="mysql://username:password@localhost:3306/nextcraft"
JWT_SECRET="your_very_long_random_secret_here"

```

### 4. Database Initialization

```bash
# Push schema to database
npx prisma migrate dev --name init

# Seed initial admin data and settings
npx prisma db seed

```

### 5. Running the Application

```bash
# Development
npm run dev

# Production
npm run build
npm start

```

---

## 📦 Production Update SOP

To update your production server safely, use the integrated script:

```bash
sh ./scripts/update.sh

```

**Procedures executed:**

1. **Safety Check**: Saves the current stable HEAD.
2. **Sync**: Pulls latest code from `main`.
3. **Install**: Updates all dependencies.
4. **Database**: Deploys pending migrations safely via `prisma migrate deploy`.
5. **Build**: Compiles the Next.js production bundle.
6. **Fail-Safe**: If any step fails, the script triggers an automatic rollback.

---

## 📡 API Reference

| Endpoint | Method | Description | Access |
| --- | --- | --- | --- |
| `/api/auth/login` | `POST` | Authenticate & set secure cookie | Public |
| `/api/auth/me` | `GET` | Retrieve current admin profile | Admin |
| `/api/admin/users` | `GET/POST` | Manage administrative accounts | Admin |
| `/api/content/home` | `PUT` | Update Home Page interface data | Admin |
| `/api/settings` | `GET/PUT` | Site-wide system configurations | Admin |

---

## 📝 License

Distributed under the **MIT License**. See `LICENSE` for more information.
