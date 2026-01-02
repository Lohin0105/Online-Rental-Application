# 🏠 Haven - Online House Rental & Tenant Management System

<div align="center">

![Haven](https://img.shields.io/badge/Haven-House%20Rental-black?style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**A modern, full-stack web application for property rental management**

[Features](#-features) • [Quick Start](#-quick-start) • [Installation](#-installation) • [API Documentation](#-api-endpoints) • [Database](#-database-schema)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Test Credentials](#-test-credentials)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Package Dependencies](#-package-dependencies)
- [UI Design](#-ui-design)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🌟 Overview

**Haven** is a comprehensive house rental and tenant management system that connects property owners with potential tenants. The platform provides a seamless experience for listing properties, browsing available rentals, and managing booking requests through an intuitive approval workflow.

### What This Project Does

- **For Property Owners**: List and manage multiple properties, receive and respond to booking requests, track tenant applications, and monitor property performance through a dedicated dashboard.

- **For Tenants**: Browse available properties with advanced filtering, view detailed property information with photos and amenities, submit booking requests, and track application status.

- **For Administrators**: Oversee all users and property listings, manage system-wide settings.

---

## ✨ Features

### 👥 User Roles & Authentication
| Role | Capabilities |
|------|-------------|
| **Owner** | List properties, manage tenants, view/respond to booking requests, dashboard analytics |
| **Tenant** | Browse properties, view details, submit booking requests, track booking status |
| **Admin** | Oversee users and property listings, system management |

### 🏠 Core Functionality
- ✅ Property listing with multiple photos, amenities, and detailed descriptions
- ✅ Advanced search and filtering (location, budget, bedrooms, property type)
- ✅ Booking request system with approval/rejection workflow
- ✅ Owner dashboard with statistics and management tools
- ✅ Role-based access control with protected routes
- ✅ JWT-based secure authentication
- ✅ Fully responsive design for all devices
- ✅ Sleek monochromatic UI with smooth animations
- ✅ Real-time dashboard updates for instant booking status feedback
- ✅ Enhanced booking details with owner contact information
- ✅ Email notifications for booking status changes

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 18.x | Frontend framework |
| Angular Material | 18.x | UI component library |
| TypeScript | 5.4.x | Type-safe JavaScript |
| SCSS | - | Styling with CSS variables |
| RxJS | 7.8.x | Reactive programming |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | Runtime environment |
| Express.js | 4.18.x | Web framework |
| TypeScript | 5.3.x | Type-safe JavaScript |
| MySQL | 8.0+ | Database |
| mysql2 | 3.6.x | MySQL client |
| JWT | 9.x | Authentication tokens |
| bcryptjs | 2.4.x | Password hashing |

---

## 📁 Project Structure

```
House/
│
├── 📂 backend/                    # Node.js Express API
│   ├── 📂 src/
│   │   ├── 📂 config/
│   │   │   ├── database.ts        # Database connection pool
│   │   │   ├── init-db.ts         # Database initialization script
│   │   │   └── seed-db.ts         # Mock data seeding script
│   │   ├── 📂 controllers/
│   │   │   ├── authController.ts  # Authentication logic
│   │   │   ├── bookingController.ts # Booking management
│   │   │   └── propertyController.ts # Property CRUD operations
│   │   ├── 📂 middleware/
│   │   │   ├── auth.ts            # JWT authentication middleware
│   │   │   └── validation.ts      # Request validation
│   │   ├── 📂 routes/
│   │   │   ├── authRoutes.ts      # Auth endpoints
│   │   │   ├── bookingRoutes.ts   # Booking endpoints
│   │   │   ├── propertyRoutes.ts  # Property endpoints
│   │   │   └── index.ts           # Route aggregator
│   │   ├── 📂 types/
│   │   │   └── index.ts           # TypeScript type definitions
│   │   └── server.ts              # Express app entry point
│   ├── .env                       # Environment variables (create this)
│   ├── .env.example               # Environment template
│   ├── package.json               # Backend dependencies
│   └── tsconfig.json              # TypeScript configuration
│
├── 📂 frontend/                   # Angular 18 Application
│   ├── 📂 src/
│   │   ├── 📂 app/
│   │   │   ├── 📂 core/           # Core modules
│   │   │   │   ├── 📂 guards/     # Route guards (auth, role)
│   │   │   │   ├── 📂 interceptors/ # HTTP interceptors
│   │   │   │   ├── 📂 models/     # TypeScript interfaces
│   │   │   │   └── 📂 services/   # API services
│   │   │   ├── 📂 pages/          # Page components
│   │   │   │   ├── 📂 auth/       # Login & Register
│   │   │   │   ├── 📂 home/       # Landing page
│   │   │   │   ├── 📂 property-list/ # Property browsing
│   │   │   │   ├── 📂 property-details/ # Property view
│   │   │   │   ├── 📂 booking-request/ # Booking form
│   │   │   │   ├── 📂 owner/      # Owner dashboard & forms
│   │   │   │   └── 📂 tenant/     # Tenant bookings view
│   │   │   ├── 📂 shared/         # Shared components
│   │   │   │   └── 📂 components/ # Navbar, Footer, PropertyCard
│   │   │   ├── app.component.ts   # Root component
│   │   │   ├── app.config.ts      # App configuration
│   │   │   └── app.routes.ts      # Route definitions
│   │   ├── index.html             # Main HTML file
│   │   ├── main.ts                # Bootstrap file
│   │   └── styles.scss            # Global styles
│   ├── angular.json               # Angular CLI configuration
│   ├── package.json               # Frontend dependencies
│   └── tsconfig.json              # TypeScript configuration
│
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Installation |
|-------------|---------|--------------|
| **Node.js** | 18.x or higher | [Download](https://nodejs.org/) |
| **npm** | 9.x or higher | Comes with Node.js |
| **MySQL** | 8.0 or higher | [Download](https://dev.mysql.com/downloads/mysql/) |
| **Angular CLI** | 18.x | `npm install -g @angular/cli` |
| **Git** | Latest | [Download](https://git-scm.com/) |

### Verify Installation
```bash
node --version    # Should be v18.x or higher
npm --version     # Should be 9.x or higher
mysql --version   # Should be 8.x or higher
ng version        # Should show Angular CLI 18.x
```

---

## 🚀 Installation

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd House
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
# Copy .env.example to .env and update with your MySQL credentials
```

Create a `.env` file in the `backend` folder with the following content:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=house_rental_db
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

### Step 3: Initialize Database

```bash
# Make sure MySQL is running, then:
cd backend

# Create database and tables
npm run db:init

# (Optional) Seed with mock data
npm run db:seed
```

### Step 4: Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

---

## ▶️ Running the Application

### Option 1: Run Both Servers (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Option 2: Using npm scripts

**Backend Development Server:**
```bash
cd backend
npm run dev          # Starts with hot-reload using ts-node-dev
```

**Backend Production Build:**
```bash
cd backend
npm run build        # Compiles TypeScript to JavaScript
npm start            # Runs compiled JavaScript
```

**Frontend Development Server:**
```bash
cd frontend
npm start            # or: ng serve
```

### Access the Application

| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:4200 |
| 🔧 Backend API | http://localhost:3000 |
| 📡 API Base | http://localhost:3000/api |

---

## 🔐 Test Credentials

After running `npm run db:seed`, you can use these accounts:

### Admin Account
| Email | Password |
|-------|----------|
| `admin@houserental.com` | `admin123` |

### Owner Accounts
| Email | Password |
|-------|----------|
| `john.owner@email.com` | `password123` |
| `sarah.owner@email.com` | `password123` |
| `mike.owner@email.com` | `password123` |

### Tenant Accounts
| Email | Password |
|-------|----------|
| `alice.tenant@email.com` | `password123` |
| `bob.tenant@email.com` | `password123` |
| `carol.tenant@email.com` | `password123` |
| `david.tenant@email.com` | `password123` |
| `emma.tenant@email.com` | `password123` |

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Register new user | No |
| `POST` | `/login` | User login | No |
| `GET` | `/profile` | Get current user profile | Yes |
| `PUT` | `/profile` | Update user profile | Yes |

### Properties (`/api/properties`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/` | List all available properties | No |
| `GET` | `/:id` | Get property details | No |
| `POST` | `/` | Create new property | Yes (Owner) |
| `PUT` | `/:id` | Update property | Yes (Owner) |
| `DELETE` | `/:id` | Delete property | Yes (Owner) |
| `GET` | `/owner/my-properties` | Get owner's properties | Yes (Owner) |

### Bookings (`/api/bookings`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/` | Create booking request | Yes (Tenant) |
| `GET` | `/my-bookings` | Get tenant's bookings | Yes (Tenant) |
| `GET` | `/requests` | Get booking requests for owner | Yes (Owner) |
| `GET` | `/stats` | Get booking statistics | Yes (Owner) |
| `PATCH` | `/:id/status` | Approve/Reject booking | Yes (Owner) |
| `DELETE` | `/:id` | Cancel booking | Yes |

---

## 🗄 Database Schema

### Entity Relationship

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   USERS     │       │ PROPERTIES  │       │  BOOKINGS   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──┐   │ id (PK)     │◄──┐   │ id (PK)     │
│ email       │   │   │ owner_id(FK)│───┘   │ property_id │───┐
│ password    │   │   │ title       │       │ tenant_id   │───┤
│ name        │   │   │ description │       │ status      │   │
│ phone       │   │   │ rent        │       │ message     │   │
│ role        │   │   │ location    │       │ move_in_date│   │
│ avatar      │   │   │ amenities   │       │ duration    │   │
│ created_at  │   │   │ photos      │       │ request_time│   │
└─────────────┘   │   │ bedrooms    │       │ owner_notes │   │
                  │   │ bathrooms   │       └─────────────┘   │
                  │   │ area_sqft   │                         │
                  │   │ property_type│                        │
                  │   │ is_available │                        │
                  │   │ created_at   │                        │
                  │   └─────────────┘                         │
                  │                                           │
                  └───────────────────────────────────────────┘
```

### Tables

<details>
<summary><b>Users Table</b></summary>

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('owner', 'tenant', 'admin') DEFAULT 'tenant',
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
</details>

<details>
<summary><b>Properties Table</b></summary>

```sql
CREATE TABLE properties (
  id INT PRIMARY KEY AUTO_INCREMENT,
  owner_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  rent DECIMAL(10, 2) NOT NULL,
  location VARCHAR(500) NOT NULL,
  amenities JSON,
  photos JSON,
  bedrooms INT DEFAULT 1,
  bathrooms INT DEFAULT 1,
  area_sqft INT,
  property_type ENUM('apartment', 'house', 'studio', 'villa', 'condo') DEFAULT 'apartment',
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```
</details>

<details>
<summary><b>Bookings Table</b></summary>

```sql
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  tenant_id INT NOT NULL,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  message TEXT,
  move_in_date DATE,
  duration_months INT DEFAULT 12,
  request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  response_time TIMESTAMP NULL,
  owner_notes TEXT,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE
);
```
</details>

---

## 📦 Package Dependencies

### Backend Dependencies

| Package | Version | Description |
|---------|---------|-------------|
| `express` | ^4.18.2 | Fast web framework |
| `mysql2` | ^3.6.5 | MySQL client for Node.js |
| `cors` | ^2.8.5 | Cross-origin resource sharing |
| `dotenv` | ^16.3.1 | Environment variable management |
| `bcryptjs` | ^2.4.3 | Password hashing |
| `jsonwebtoken` | ^9.0.2 | JWT authentication |
| `express-validator` | ^7.0.1 | Input validation |
| `multer` | ^1.4.5 | File upload handling |

### Backend Dev Dependencies

| Package | Version | Description |
|---------|---------|-------------|
| `typescript` | ^5.3.3 | TypeScript compiler |
| `ts-node` | ^10.9.2 | TypeScript execution |
| `ts-node-dev` | ^2.0.0 | Development server with hot-reload |
| `@types/*` | various | TypeScript type definitions |

### Frontend Dependencies

| Package | Version | Description |
|---------|---------|-------------|
| `@angular/core` | ^18.0.0 | Angular framework |
| `@angular/material` | ^18.0.0 | Material Design components |
| `@angular/cdk` | ^18.0.0 | Component Dev Kit |
| `@angular/forms` | ^18.0.0 | Forms module |
| `@angular/router` | ^18.0.0 | Routing module |
| `rxjs` | ~7.8.0 | Reactive programming |

---

## 🎨 UI Design

### Color Palette (Monochromatic Dark Theme)
| Color | Hex Code | Usage |
|-------|----------|-------|
| Black | `#0a0a0a` | Primary background |
| Charcoal | `#1a1a1a` | Card backgrounds |
| Dark Gray | `#2a2a2a` | Secondary elements |
| Medium Gray | `#555555` | Borders |
| Light Gray | `#c5c5c5` | Secondary text |
| White | `#fafafa` | Primary text |
| Bronze Accent | `#d4a574` | Highlights & CTAs |

### Typography
- **Headings**: Playfair Display (Serif)
- **Body**: DM Sans (Sans-serif)

### Animations
- Fade in/up/down transitions
- Scale-in effects
- Slide animations
- Smooth hover states
- Staggered list animations

---

## 🔧 Troubleshooting

### Common Issues

<details>
<summary><b>❌ MySQL Connection Error</b></summary>

**Error**: `Access denied for user 'root'@'localhost'`

**Solution**:
1. Check your MySQL password in `.env` file
2. Ensure MySQL service is running
3. Try resetting MySQL root password

```bash
# Check MySQL service (Windows)
Get-Service -Name "*mysql*"

# Start MySQL if not running
net start MySQL80
```
</details>

<details>
<summary><b>❌ Port Already in Use</b></summary>

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Windows - Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in .env file
PORT=3001
```
</details>

<details>
<summary><b>❌ Angular CLI Not Found</b></summary>

**Solution**:
```bash
npm install -g @angular/cli
```
</details>

<details>
<summary><b>❌ Module Not Found Errors</b></summary>

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```
</details>

---

## 📜 Available Scripts

### Backend Scripts
```bash
npm run dev       # Start development server with hot-reload
npm run build     # Compile TypeScript to JavaScript
npm start         # Run production build
npm run db:init   # Initialize database and create tables
npm run db:seed   # Populate database with mock data
```

### Frontend Scripts
```bash
npm start         # Start development server (ng serve)
npm run build     # Build for production
npm run watch     # Build and watch for changes
npm test          # Run unit tests
```

---

## 📄 License

MIT License - Feel free to use this project for learning and development.

---

<div align="center">

**Built with ❤️ for better living**

[⬆ Back to Top](#-haven---online-house-rental--tenant-management-system)

</div>
