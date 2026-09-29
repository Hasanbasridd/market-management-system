# 🛒 Market Management System

A full-stack, multi-branch market management application.

## 🛠️ Tech Stack

**Backend**
- .NET 9 / ASP.NET Core Web API
- Entity Framework Core 9 (Code-First)
- JWT Authentication + BCrypt
- SQL Server 2022

**Frontend**
- React 18 + Vite
- React Router v7
- Axios

**DevOps**
- Docker & Docker Compose

## ✨ Features

- 🔐 JWT-based authentication (admin / staff roles)
- 🏪 Multi-tenant architecture (multiple branches)
- 🛍️ Product and category management (CRUD)
- 📦 Stock in/out tracking
- 🛒 Cart and order system
- 🧾 Automatic PDF invoice generation (QuestPDF)
- 👥 User management
- 📊 Dashboard with low-stock alerts

## 🚀 Getting Started

### Prerequisites
- Docker Desktop
- Node.js 18+
- .NET 9 SDK

### Run with Docker

```bash
docker-compose up -d
```

### Run Manually

**Backend:**
```bash
cd MarketApp.API
dotnet run
```

**Frontend:**
```bash
cd market-ui
npm install
npm run dev
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register |
| GET | /api/products | List products |
| POST | /api/products | Create product |
| GET | /api/categories | List categories |
| POST | /api/stock/in | Stock entry |
| POST | /api/stock/out | Stock exit |
| GET | /api/stock/movements | List movements |

## 👤 Developer

**Hasan Basri Dede**  
Full-stack Developer  
.NET Core | React | Docker