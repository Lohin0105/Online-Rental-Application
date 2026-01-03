# Haven - House Rental & Tenant Management System 🏠

A modern, AI-powered rental platform connecting property owners with tenants. Built with Angular 18, Node.js/Express, and MySQL with Google Gemini AI integration.

![Haven Platform](https://img.shields.io/badge/Angular-18-red?logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-20.17-green?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql)
![AI Powered](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-purple)

---

## 🚀 Quick Start (Complete Setup)

### Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download Link |
|----------|---------|---------------|
| Node.js | v20.17.0+ | [nodejs.org](https://nodejs.org/) |
| MySQL | v8.0+ | [mysql.com](https://dev.mysql.com/downloads/mysql/) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

### Verify Installations

```bash
node --version    # Should show v20.x.x
npm --version     # Should show 10.x.x
mysql --version   # Should show 8.x.x
```

---

## 📦 Step 1: Install Dependencies

Open a terminal in the project root folder and run:

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Install Angular CLI (if not already installed)

```bash
npm install -g @angular/cli@18
```

---

## 🗄️ Step 2: Setup MySQL Database

### 2.1 Start MySQL Server

**Windows:**
- Open **MySQL Workbench** or **Services** app
- Start the MySQL service

**Mac:**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo systemctl start mysql
```

### 2.2 Create Environment File

Create a `.env` file in the `backend` folder:

```bash
cd backend
```

Create a new file named `.env` with the following content:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=house_rental_db
DB_PORT=3306

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Email Configuration (for notifications)
EMAIL_FROM=lohinreddy@gmail.com
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=9c69d0001@smtp-brevo.com
SMTP_PASS=1ZOncVN3h9RgYLDq
```

> ⚠️ **Important:** Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password.

### 2.3 Initialize Database (Create Tables)

```bash
cd backend
npm run db:init
```

**Expected Output:**
```
✅ Database initialized successfully!
📋 Tables created: users, properties, bookings, property_ratings, user_ratings
👤 Default admin user: admin@houserental.com / admin123
```

### 2.4 Seed Sample Data (Optional but Recommended)

This adds sample properties, users, and bookings to test the platform:

```bash
npm run db:seed
```

**Expected Output:**
```
🗑️  Clearing existing data...
✅ All existing data cleared!
🌱 Starting fresh database seeding with Indian data...

👥 Creating users...
   ✅ Created 11 users (including admin)
🏠 Creating properties...
   ✅ Created 12 properties
📋 Creating booking requests...
   ✅ Created 8 bookings

🎉 Database seeding completed successfully!
```

---

## 🔑 Step 3: Configure Gemini AI (Optional)

For AI-powered features (chatbot, price calculator, description enhancement):

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the API key

5. Open `frontend/src/environments/environment.ts` and add your key:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api',
  geminiApiKey: 'YOUR_GEMINI_API_KEY_HERE'  // ← Paste your API key
};
```

> 💡 **Note:** The platform works without Gemini API key - AI features will just be disabled.

---

## ▶️ Step 4: Run the Application

You need **two terminal windows** - one for backend and one for frontend.

### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🏠 House Rental API Server                          ║
║                                                       ║
║   Server running on: http://localhost:3001            ║
║   Environment: development                            ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

### Terminal 2: Start Frontend Application

```bash
cd frontend
ng serve
```

**Expected Output:**
```
✔ Compiled successfully.
Angular Live Development Server is listening on localhost:4200
```

### 🌐 Open in Browser

Navigate to: **http://localhost:4200**

---

## 👤 Login Credentials

After running `npm run db:seed`, use these credentials:

### Admin Account
| Email | Password |
|-------|----------|
| admin@houserental.com | admin123 |

### Primary Accounts (Added to Database)
| Role | Email | Password | Name |
|------|-------|----------|------|
| **Owner** | srivathsathotamsetty@gmail.com | owner123 | Srivathsathotamsetty Owner |
| **Tenant** | sreevastha7@gmail.com | tenant123 | Sreevastha Tenant |

### Property Owners
| Name | Email | Password | Properties Location |
|------|-------|----------|---------------------|
| Srivathsathotamsetty Owner | srivathsathotamsetty@gmail.com | owner123 | Various locations |
| Rajesh Sharma | rajesh.sharma@email.com | password123 | Mumbai |
| Priya Patel | priya.patel@email.com | password123 | Bangalore |
| Vikram Malhotra | vikram.malhotra@email.com | password123 | Delhi NCR |
| Anita Reddy | anita.reddy@email.com | password123 | Hyderabad & Chennai |

### Tenants
| Name | Email | Password |
|------|-------|----------|
| Sreevastha Tenant | sreevastha7@gmail.com | tenant123 |
| Amit Kumar | amit.kumar@email.com | password123 |
| Sneha Gupta | sneha.gupta@email.com | password123 |
| Rohit Singh | rohit.singh@email.com | password123 |
| Kavita Nair | kavita.nair@email.com | password123 |
| Arjun Mehta | arjun.mehta@email.com | password123 |
| Deepika Iyer | deepika.iyer@email.com | password123 |

---

## 🏠 Sample Properties

The database includes 12 properties across major Indian cities:

| City | Properties | Rent Range (₹/month) |
|------|------------|----------------------|
| **Mumbai** | Bandra Sea View, Powai Studio, Malabar Hill Bungalow | ₹32,000 - ₹3,50,000 |
| **Bangalore** | Whitefield Villa, Indiranagar 2BHK, Koramangala Loft | ₹48,000 - ₹95,000 |
| **Delhi NCR** | Gurgaon Penthouse, Noida 3BHK, Dwarka 1BHK | ₹18,000 - ₹2,50,000 |
| **Hyderabad** | Jubilee Hills Villa, HITEC City 2BHK | ₹35,000 - ₹1,75,000 |
| **Chennai** | ECR Sea-Facing Flat | ₹42,000 |

---

## 📁 Project Structure

```
Haven-Rental-Platform/
├── backend/                    # Node.js/Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts     # MySQL connection
│   │   │   ├── init-db.ts      # Database initialization
│   │   │   └── seed-db.ts      # Sample data seeding
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Auth & validation
│   │   ├── routes/             # API routes
│   │   └── server.ts           # Express server
│   ├── .env                    # Environment variables (create this)
│   └── package.json
│
├── frontend/                   # Angular 18 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Services, guards, interceptors
│   │   │   ├── pages/          # Page components
│   │   │   └── shared/         # Shared components
│   │   └── environments/
│   │       └── environment.ts  # API config (add Gemini key here)
│   └── package.json
│
└── README.md
```

---

## 🔧 Available Commands

### Backend Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production server |
| `npm run db:init` | Initialize database tables |
| `npm run db:seed` | Seed database with sample data |

### Frontend Commands

| Command | Description |
|---------|-------------|
| `ng serve` | Start development server |
| `ng build` | Build for production |
| `ng build --configuration production` | Build optimized for production |

---

## ✨ Features

### Core Features
- 🏠 **Property Listings** - Owners list properties with photos, amenities, details
- 🔍 **Advanced Search** - Filter by location, price, bedrooms, property type
- 📋 **Booking System** - Tenants request, owners approve/reject
- ⭐ **Rating System** - Tenants can rate properties and owners (1-5 stars with animations)
- 📧 **Email Notifications** - Automated emails for booking approvals, rejections, and new listings
- 👥 **Role-Based Access** - Separate dashboards for Tenants, Owners, Admins
- 💰 **INR Currency** - All prices displayed in Indian Rupees (₹)
- 🎨 **Modern Admin Dashboard** - Dark theme with glassmorphism effects and real-time updates
- 🔐 **Secure Authentication** - JWT-based with role authorization

### AI Features (Requires Gemini API Key)
- 🤖 **AI Chatbot** - Instant support (floating button, bottom-right)
- 💰 **Price Calculator** - AI-powered rent estimation
- ✍️ **Description Enhancement** - Transform basic text to professional listings
- 💡 **Smart Search** - AI-generated search suggestions

---

## 🔧 Troubleshooting

### MySQL Connection Error

**Error:** `ECONNREFUSED localhost:3306`

**Solution:**
1. Check if MySQL is running:
   ```bash
   # Windows (PowerShell)
   Get-Service -Name "MySQL*"
   
   # Mac
   brew services list | grep mysql
   
   # Linux
   sudo systemctl status mysql
   ```

2. Start MySQL if not running:
   ```bash
   # Windows: Use Services app or MySQL Workbench
   # Mac
   brew services start mysql
   # Linux
   sudo systemctl start mysql
   ```

3. Verify credentials in `backend/.env`

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3001`

**Solution:**
```bash
# Windows (PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### Session Expired After Database Reset

**Error:** "Session expired. Please login again."

**Solution:**
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Run: `localStorage.clear(); location.reload();`
4. Login again with new credentials

### Angular Build Errors

**Error:** Module not found or version mismatch

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
ng serve
```

---

## 📱 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get current user profile |

### Properties
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | List all properties |
| GET | `/api/properties/:id` | Get property details |
| POST | `/api/properties` | Create property (Owner) |
| PUT | `/api/properties/:id` | Update property (Owner) |
| DELETE | `/api/properties/:id` | Delete property (Owner) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking request (Tenant) |
| GET | `/api/bookings/my-bookings` | Get tenant's bookings |
| GET | `/api/bookings/requests` | Get owner's booking requests |
| PATCH | `/api/bookings/:id/status` | Approve/Reject booking (Owner) - **Sends email notification** |
| DELETE | `/api/bookings/:id` | Cancel booking (Tenant) |

### Ratings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ratings/property` | Submit property rating (Tenant) |
| POST | `/api/ratings/user` | Submit user/owner rating (Tenant) |
| GET | `/api/ratings/property/:id` | Get property ratings |
| GET | `/api/ratings/user/:id` | Get user ratings |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/properties` | List all properties |
| DELETE | `/api/admin/users/:id` | Delete user |
| DELETE | `/api/admin/properties/:id` | Delete property |

---

## 🏗️ Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
ng build --configuration production
```

Production files will be in `frontend/dist/` directory.

---

## 🔒 Security Notes (Production)

1. **Change JWT Secret** - Use a strong, random string in `JWT_SECRET`
2. **Secure .env files** - Never commit to Git
3. **Use HTTPS** - Always use HTTPS in production
4. **Rotate API Keys** - Change Gemini API key regularly
5. **Database Security** - Use strong passwords, restrict privileges

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Verify all prerequisites are installed
3. Check terminal logs for errors
4. Ensure `.env` file is configured correctly

---

---

## ✨ What's New in Version 2.1.0

### 🆕 New Features

1. **⭐ Rating System**
   - Tenants can rate properties (1-5 stars) after booking approval
   - Tenants can rate property owners
   - Beautiful animated star rating component
   - Average ratings displayed on property cards and details
   - Rating count shown with each property

2. **📧 Email Notifications**
   - **Booking Approved**: Tenants receive beautiful HTML email when booking is approved
   - **Booking Rejected**: Tenants receive notification when booking is rejected
   - **New Property Listing**: All tenants notified when new property is listed
   - **Booking Request**: Owners notified when tenant submits booking request
   - All emails include property details, owner/tenant names, and action links

3. **🎨 Admin Dashboard Redesign**
   - Modern dark theme with gradient backgrounds
   - Glassmorphism effects for cards
   - Animated stat cards with hover effects
   - Real-time data updates (30-second polling)
   - Enhanced booking requests grid view
   - All currency displayed in INR (₹)

4. **💰 Currency Localization**
   - All prices converted from USD ($) to INR (₹)
   - Proper Indian number formatting
   - Consistent currency display across all components

5. **🗄️ Database Updates**
   - Added primary owner account: `srivathsathotamsetty@gmail.com`
   - Added primary tenant account: `sreevastha7@gmail.com`
   - Removed all demo account bypasses
   - All operations now use real database

### 📧 Email Notification System

See `EMAIL_NOTIFICATIONS.md` for complete documentation on all email notifications.

**Email Triggers:**
- ✅ New property created → All tenants notified
- ✅ Booking request submitted → Property owner notified
- ✅ Booking approved → Tenant receives approval email
- ✅ Booking rejected → Tenant receives rejection email

---

**Built with ❤️ for the Indian rental community**

Version: 2.1.0  
Last Updated: January 2026
