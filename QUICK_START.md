# 🚀 Haven - Quick Start Guide

Get the Haven Rental Platform running in 5 minutes!

---

## Step 1: Install Dependencies (2 minutes)

Open terminal in project root and run:

```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

---

## Step 2: Setup Database (2 minutes)

### Make sure MySQL is running

**Windows:** Start MySQL from Services or MySQL Workbench  
**Mac:** `brew services start mysql`  
**Linux:** `sudo systemctl start mysql`

### Create `.env` file in backend folder

Create file: `backend/.env`

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=house_rental_db
DB_PORT=3306
PORT=3001
JWT_SECRET=your_secret_key_here
```

> ⚠️ Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL password

### Initialize & Seed Database

```bash
cd backend
npm run db:init    # Creates tables
npm run db:seed    # Adds sample data
```

---

## Step 3: Run the Application (1 minute)

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend

```bash
cd frontend
ng serve
```

---

## Step 4: Open Browser 🎉

Go to: **http://localhost:4200**

---

## 👤 Login Credentials

### Admin
- Email: `admin@houserental.com`
- Password: `admin123`

### Owner (try this to list properties)
- Email: `rajesh.sharma@email.com`
- Password: `password123`

### Tenant (try this to book properties)
- Email: `amit.kumar@email.com`
- Password: `password123`

---

## 🏠 What's Included

After seeding, you'll have:
- **11 Users** (1 admin, 4 owners, 6 tenants)
- **12 Properties** across Mumbai, Bangalore, Delhi, Hyderabad, Chennai
- **8 Booking Requests** (approved, pending, rejected)

---

## ⚠️ Common Issues

### "Session expired" error
Clear browser storage: Press F12 → Console → Type: `localStorage.clear()` → Enter → Refresh

### MySQL not connecting
1. Check MySQL is running
2. Verify password in `.env` file

### Port 3001 in use
```bash
# Windows PowerShell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force
```

---

## 📚 Full Documentation

See [README.md](README.md) for complete documentation including:
- AI features setup (Gemini)
- Production deployment
- All API endpoints
- Troubleshooting guide

---

**Happy Renting! 🏠**
