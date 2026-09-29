<div align="center">
  <img src="https://img.icons8.com/color/96/000000/shop.png" alt="MarketApp Logo" width="80" />
  <h1>Market Management System (SaaS)</h1>
  <p>Modern, Multi-Tenant, Full-Stack Market & Inventory Management Application</p>

  <p>
    <a href="#"><img src="https://img.shields.io/badge/.NET_9.0-512BD4?style=flat-square&logo=dotnet&logoColor=white" alt=".NET 9"></a>
    <a href="#"><img src="https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"></a>
    <a href="#"><img src="https://img.shields.io/badge/SQL_Server-CC2927?style=flat-square&logo=microsoftsqlserver&logoColor=white" alt="SQL Server"></a>
    <a href="#"><img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker"></a>
  </p>
</div>

<br />

## 📖 About

**Market Management System** is a modern B2B/SaaS inventory and store management system built with a multi-tenant architecture. 

It allows businesses with multiple branches (e.g., Central Branch, Kadıköy Branch) to manage their operations in complete isolation from a single centralized system. It digitizes end-to-end processes including role-based authorization, inventory tracking, dynamic cart/POS management, and automated PDF invoicing.

## ✨ Key Features

- **🏢 Multi-Tenant Architecture:** Data between branches is completely isolated. Branch admins can only manage their respective stores, while Super Admins have a global view of the entire system.
- **🔐 Security & Authorization:** Role-Based Access Control (RBAC) via JWT (JSON Web Tokens) with BCrypt password hashing.
- **📦 Advanced Inventory Management:** Track stock movements (in/out) and receive low-stock alerts.
- **🛒 POS & Order Module:** Fast checkout interface with real-time total calculations.
- **📄 Dynamic PDF Invoicing:** Automatically generates fully branded, real-time PDF invoices upon checkout using the `QuestPDF` engine.
- **🎨 Modern UI/UX:** Built with React and Vite featuring a clean, flat, neumorphic-inspired light theme for maximum usability.

## 🛠️ Tech Stack

### Backend
- **Framework:** .NET 9.0 (ASP.NET Core Web API)
- **ORM:** Entity Framework Core 9 (Code-First)
- **Database:** Microsoft SQL Server 2022
- **Tools:** QuestPDF (Invoicing), BCrypt.Net (Cryptography), JWT Bearer

### Frontend
- **Framework:** React 18 (Vite.js)
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **State Management:** Context API

### DevOps
- **Containerization:** Docker & Docker Compose
- **Web Server:** NGINX (Frontend)

---

## 🚀 Getting Started

The easiest way to run the project locally is via **Docker**.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Node.js 18+ (For local frontend development)
- .NET 9 SDK (For local backend development)

### One-Click Setup (Docker)
To spin up the Database, Backend, and Frontend simultaneously, run the following command in the root directory:

```bash
docker-compose up -d --build
```
* **Frontend (UI):** `http://localhost:3000`
* **Backend (API / Swagger):** `http://localhost:5228/swagger`

### Manual Setup (Development Environment)

**1. Database & API (Backend)**
```bash
cd MarketApp.API
# This will automatically apply migrations and seed test data
dotnet run
```
*(On first run, `DbSeeder.cs` will automatically create the test branches and admin accounts.)*

**2. React UI (Frontend)**
```bash
cd market-ui
npm install
npm run dev
```

## 🔑 Test Accounts

When the system boots up, the following test accounts are automatically seeded (Password for all accounts is `123` unless specified):

| Email | Password | Role | Scope |
|---|---|---|---|
| `super@market.com` | `super123` | Super Admin | Entire System |
| `hasan@market.com` | `123` | Admin | "Merkez Şube" (Central) Only |
| `besiktas@market.com` | `123` | Admin | "Beşiktaş Şube" Only |

## 📐 Architecture Design
The project follows a `Controller-Service-Repository` pattern optimized for micro-deployments. Authorization checks are centrally handled via `BaseApiController`, and all queries are strictly filtered using the `storeId` Claim embedded inside the JWT.

## 👨‍💻 Developer
**Hasan Basri Dede**  
Full-Stack Software Developer