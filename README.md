# NextCraft 🚀

**NextCraft** is a high-performance, premium web application built with [Next.js](https://nextjs.org/) and Prisma. It features a robust Admin Dashboard, Role-Based Access Control (RBAC), and a seamless notification system, designed for scalability and modern aesthetics.

## cast Features ✨

### 🛡️ Admin Dashboard (`/admin`)
- **Secure Authentication**: Hashed passwords (Bcrypt), session management, and middleware protection.
- **Account Management**: Full CRUD for admin users with role assignment (Webmaster, Developer, Admin).
- **Collapsible Sidebar**: Organized navigation with accordion-style categories.
- **Global Settings**: Configure Site Name, Logo, SEO (Keywords/Description), and Favicon directly from the UI.
- **File Upload**: Local file storage support with validation.

### 🎨 User Interface (`/`)
- **Modern Design**: Glassmorphism, blurred backdrops, and smooth animations using Framer Motion.
- **Responsive**: Fully optimized for Desktop, Tablet, and Mobile.
- **Dynamic Branding**: Navbar and metadata adapt to global settings instantly.

### ⚡ Technical Highlights
- **Stack**: Next.js 14 (App Router), TypeScript, Prisma (MySQL), Tailwind CSS.
- **Notification System**: Global Toast notifications (Success, Error, Warning, Alert) replacing standard alerts.
- **Performance**: Optimized loading screens with session persistence.

## 🛠️ Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ImJopehhh/nextcraft.git
    cd nextcraft
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Database**
    Update `.env` with your MySQL credentials:
    ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_PORT=3306
   DB_NAME=nextcraft_db

   # Authentication
   JWT_SECRET=your-super-secret-jwt-key

   # App Settings
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Initialize the database**
    ```bash
    npx prisma db push
    ```

5.  **Run the checks**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔑 Default Admin

- **Login URL**: `/admin/login`
- **Email**: `admin@next.craft`
- **Password**: `admin123`

---
*Built with ❤️ by NextCraft Team*
