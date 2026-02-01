# 🏫 School Management System (ERP)

A full-featured **School Management System (ERP)** designed to manage academic, administrative, and operational activities of a school in a centralized and efficient way.

This system is built with a **modern full-stack architecture**, supporting **web + desktop (offline-capable)** usage, role-based access control, and a scalable modular design.

---

## 🚀 Features

### 👤 Authentication & Roles

* Secure login system
* Role-based access control (Admin, Teacher, Staff)
* JWT-based authentication

### 🏫 Academic Management

* Academic Year management
* Class & Section management
* Student registration & profiles
* Student academic records

### 💰 Fees Management

* Fee structure setup
* Fee collection tracking
* Payment history per student

### 📊 Dashboard

* Centralized dashboard for quick insights
* Student & fee summaries
* Academic year overview

### 🖥 Web + Desktop Support

* Web application (browser-based)
* Desktop application using Electron
* Offline support using SQLite (planned)

---

## 🧱 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Framer Motion
* Lucide Icons

### Backend

* Node.js
* Express.js
* SQLite
* JWT Authentication

### Desktop

* Electron
* React (Renderer Process)

### Tooling

* npm (Monorepo)
* Git & GitHub
* ESLint & Prettier

---

## 📁 Project Structure

```
school-management-system/
│
├── apps/
│   ├── web/        # React Web App
│   ├── desktop/    # Electron App
│   └── api/        # Express Backend
│
├── packages/
│   └── shared/     # Shared utilities & constants
│
├── docs/           # Documentation
├── package.json    # Root configuration
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/school-management-system.git
cd school-management-system
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run Backend Server

```bash
cd apps/api
npm run dev
```

### 4️⃣ Run Web Application

```bash
cd apps/web
npm run dev
```

### 5️⃣ Run Desktop Application

```bash
cd apps/desktop
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file inside `apps/api`:

```env
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 🛣 Roadmap (Planned Features)

* 📚 Attendance Management
* 🧑‍🏫 Teacher Management
* 📝 Exams & Results Module
* 📄 Report Generation (PDF)
* ☁️ Cloud Sync Support
* 📱 Mobile Application

---

## 🤝 Contribution Guidelines

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Vishal Singh**
Full-Stack Developer
🚀 Building scalable education & ERP solutions

---

⭐ If you like this project, don’t forget to **star the repository**!

