# Haven - House Rental & Tenant Management System

A modern, AI-powered rental platform connecting property owners with tenants. Built with Angular 18, Node.js/Express, and integrated with Google Gemini AI for intelligent features.

![Haven Platform](https://img.shields.io/badge/Angular-18-red?logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-20.17-green?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![AI Powered](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-purple)

---

## Features

### Core Functionality
- Property Listings: Owners can list properties with photos, amenities, and detailed information
- Advanced Search & Filters: Search by location, price, bedrooms, bathrooms, and property type
- Booking System: Tenants submit requests; owners approve/reject applications
- Role-Based Access: Separate dashboards for Tenants, Owners, and Admins
- Secure Authentication: JWT-based authentication with role-based authorization

### AI-Powered Features (Gemini 2.5 Flash)
1. AI Support Chatbot 
- Real-time conversational support
- Answers questions about platform features
- Clean, concise responses (2-3 sentences)
- Available on all pages (floating button, bottom-right)

2. Rental Price Calculator 
- AI-powered price estimation
- Market analysis based on property details
- Provides competitive pricing insights
- Integrated into property listing form

3. Property Description Enhancement 
- Transforms basic descriptions into professional listings
- Uses real estate marketing language
- One-click enhancement button
- Available when adding/editing properties

4. Smart Search Suggestions 
- AI-generated search refinements
- Context-aware recommendations
- Helps users find better matches
- Accessible from property search page

---

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js: v20.17.0 or higher ([Download](https://nodejs.org/))
- npm: v10.x or higher (comes with Node.js)
- MySQL: v8.0 or higher ([Download](https://dev.mysql.com/downloads/mysql/))
- Angular CLI: v18.x (installed globally)
- Gemini API Key: Get one from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Check Your Installations
```bash
node --version # Should be v20.17.0 or higher
npm --version # Should be 10.x or higher
mysql --version # Should be 8.0 or higher
```

---

## Installation & Setup

### Step 1: Clone the Repository
```bash
cd path/to/your/projects
```

### Step 2: Install Angular CLI Globally
```bash
npm install -g @angular/cli@18
```

### Step 3: Install Dependencies

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

---

## Database Setup (MySQL)

### Option 1: Full MySQL Setup (Recommended for Production)

#### 1. Start MySQL Server
- Windows: Open MySQL Workbench → Click on your local MySQL connection
- Mac/Linux: 
```bash
sudo systemctl start mysql # Linux
brew services start mysql # Mac
```

#### 2. Configure Database Connection

Create a `.env` file in the `backend` directory:

```bash
cd backend
```

Create file `backend/.env` with the following content:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=house_rental_db
DB_PORT=3306

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

Important: Replace `your_mysql_password_here` with your actual MySQL root password.

#### 3. Initialize Database

Run the following commands to create tables and seed demo data:

```bash
cd backend

# Create database and tables
npm run db:init

# Seed demo data (optional - adds sample properties and users)
npm run db:seed
```

#### 4. Demo Accounts (After Seeding)

If you ran `npm run db:seed`, you'll have these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Tenant | `alice.tenant@email.com` | `password123` |
| Owner | `bob.owner@email.com` | `password123` |
| Admin | `admin@haven.com` | `admin123` |

---

### Option 2: Demo Mode (No MySQL Required)

If you want to quickly test the platform without setting up MySQL, the project includes a demo mode with hardcoded accounts.

Demo Accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@demo.com` | `demo123` |
| Tenant | `tenant@demo.com` | `demo123` |

Features in Demo Mode:
- Login/Logout works
- AI Chatbot fully functional
- Price Calculator works
- All AI features available
- Cannot create/view properties (requires database)
- Cannot create bookings
- No registration

To use demo mode, simply skip the database setup and the project will automatically use demo accounts.

---

## Gemini AI Setup

### 1. Get Your API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your new API key

### 2. Configure API Key

Open `frontend/src/environments/environment.ts` and add your API key:

```typescript
export const environment = {
production: false,
apiUrl: 'http://localhost:3001/api',
geminiApiKey: 'YOUR_GEMINI_API_KEY_HERE' // ← Paste your API key here
};
```

Important: Replace `YOUR_GEMINI_API_KEY_HERE` with your actual Gemini API key.

### 3. API Usage & Limits

- Free Tier: 60 requests per minute
- Model: gemini-2.5-flash (fast and efficient)
- Features: Text generation, conversational AI, content analysis

If you exceed the free quota, you'll see temporary "unavailable" messages. Wait a few seconds and try again.

---

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Expected Output:
```
House Rental API Server
Server running on: http://localhost:3001
Environment: development
```

### Start Frontend Application

Open a new terminal window:

```bash
cd frontend
ng serve
```

Expected Output:
```
Angular Live Development Server is listening on localhost:4200 
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:4200
```

---

## Project Structure

```
Haven/
backend/ # Node.js/Express Backend
src/
config/ # Database configuration
database.ts # MySQL connection
init-db.ts # Database initialization script
seed-db.ts # Demo data seeding
controllers/ # Route handlers
authController.ts
authController.demo.ts # Demo mode (no DB)
propertyController.ts
bookingController.ts
middleware/ # Authentication & validation
routes/ # API route definitions
server.ts # Express server entry
.env # Environment variables (create this)
package.json

frontend/ # Angular 18 Frontend
src/
app/
core/
services/
ai-chatbot.service.ts # Gemini AI integration
auth.service.ts
property.service.ts
booking.service.ts
guards/ # Route guards
interceptors/
pages/ # Route components
home/
property-list/
property-details/
auth/
owner/
tenant/
shared/
components/
ai-chatbot/ # Floating AI support chat
price-calculator/ # AI price estimation
navbar/
property-card/
environments/
environment.ts # API keys & config (edit this)
styles.scss # Global styles
package.json

README.md # This file
```

---

## Usage Guide

### For Tenants

1. Browse Properties
- Visit the "Properties" page
- Use filters: location, price, bedrooms, property type
- Click "Get AI Suggestions" for smart search refinements

2. Book a Property
- Click on a property card to view details
- Click "Book Now" (requires login)
- Submit booking request with move-in date

3. Track Bookings
- Navigate to "My Bookings" dashboard
- View request status: Pending, Approved, or Rejected

4. Get Help
- Click the floating chat icon (bottom-right)
- Ask questions about Haven features
- Get instant AI-powered support

### For Property Owners

1. List a Property
- Login → Click "List Property" in navbar
- Use the AI Price Calculator for market estimates
- Fill in property details
- Click "Enhance with AI" to improve your description
- Add photos and amenities
- Submit listing

2. Manage Bookings
- View incoming booking requests in Owner Dashboard
- Approve or reject requests
- Add notes for tenants

3. View Analytics
- Access Owner Dashboard
- See property performance metrics
- Track booking statistics

### For Admins

1. System Oversight
- Access Admin Dashboard
- View all users and properties
- Monitor platform activity

2. User Management
- View user accounts
- Manage property listings
- Access system analytics

---

## AI Features in Detail

### 1. AI Support Chatbot

Location: Floating button (bottom-right corner, all pages)

How to Use:
- Click the chat icon
- Type your question
- Get instant, helpful responses about Haven

Example Questions:
- "How do I book a property?"
- "What features are available for owners?"
- "How does the approval process work?"

Technical Details:
- Model: Gemini 2.5 Flash
- Response Length: 2-3 sentences (concise)
- Context-Aware: Knows all Haven features
- Fallback: Shows error message if API unavailable

---

### 2. Rental Price Calculator

Location: "List Property" page (owners/admins only)

How to Use:
1. Navigate to "List Property"
2. See the calculator at the top
3. Enter property details:
- Property type
- Location
- Bedrooms, bathrooms
- Square footage
4. Click "Calculate Estimate"
5. Receive AI-generated price range and tips

What It Provides:
- Estimated monthly rent range
- Market factors affecting price
- Competitive pricing tips

---

### 3. Description Enhancement

Location: Property description field in "List Property" form

How to Use:
1. Write a basic description (minimum 10 characters)
2. Click "Enhance with AI" button next to the label
3. AI transforms it into professional real estate copy
4. Review and edit as needed
5. Submit property

Example:

Before: "2 bedroom apartment near downtown. Has parking."

After: "Experience urban living at its finest in this charming 2-bedroom apartment, ideally situated near the vibrant downtown core. Enjoy the convenience of dedicated parking while being steps away from dining, entertainment, and transit. Perfect for professionals or small families seeking a prime location with modern amenities."

---

### 4. Smart Search Suggestions

Location: Property search filters sidebar

How to Use:
1. Go to "Properties" page
2. Type a search term (at least 3 characters)
3. Click the lightbulb icon 
4. AI suggests 3 refined searches
5. Click any suggestion to apply it

Example:
- Your search: "cheap apartment"
- AI suggests:
- "Studio apartments under ₹50,000"
- "Budget-friendly rentals near transit"
- "Affordable 1BR units"

---

## Troubleshooting

### MySQL Connection Issues

Error: `ECONNREFUSED localhost:3306`

Solutions:
1. Check if MySQL is running:
```bash
# Windows (PowerShell)
Get-Service -Name "mysql"

# Mac
brew services list | grep mysql

# Linux
sudo systemctl status mysql
```

2. Start MySQL:
```bash
# Windows: Use MySQL Workbench or Services
# Mac
brew services start mysql
# Linux
sudo systemctl start mysql
```

3. Verify credentials in `backend/.env`

4. Test connection:
```bash
mysql -u root -p
# Enter your password
```

### Gemini API Issues

Error: "API key is invalid" or "Quota exceeded"

Solutions:
1. Verify API key is correct in `frontend/src/environments/environment.ts`
2. Check API key is active at [Google AI Studio](https://aistudio.google.com/app/apikey)
3. If quota exceeded, wait 60 seconds and try again
4. Free tier: 60 requests/minute limit

### Port Already in Use

Error: `EADDRINUSE: address already in use :::3001`

Solutions:
```bash
# Windows (PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### Angular Build Errors

Error: Version incompatibility or module not found

Solutions:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
ng serve
```

---

## Building for Production

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

The production files will be in `frontend/dist/` directory.

---

## Security Notes

### For Production Deployment:

1. Change JWT Secret:
- Update `JWT_SECRET` in `backend/.env` with a strong, random string

2. Protect API Keys:
- Never commit `.env` files
- Use environment variables on hosting platform
- Rotate Gemini API key regularly

3. Database Security:
- Use strong MySQL passwords
- Enable SSL connections
- Restrict database user privileges

4. HTTPS:
- Always use HTTPS in production
- Update `apiUrl` in `environment.ts` to use `https://`

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support

If you encounter any issues:

1. Check the Troubleshooting section above
2. Review the console logs for errors
3. Ensure all prerequisites are installed
4. Verify API keys and database credentials

Common Questions:

Q: Can I use this without MySQL? 
A: Yes! Demo mode works without MySQL. Login with `admin@demo.com` / `demo123` or `tenant@demo.com` / `demo123`.

Q: Is Gemini API free? 
A: Yes, there's a free tier with 60 requests/minute. Perfect for testing and small-scale deployments.

Q: How do I deploy this? 
A: Backend can be deployed to Heroku, Railway, or any Node.js hosting. Frontend can be deployed to Vercel, Netlify, or Firebase Hosting.

---

## Key Technologies

- Frontend: Angular 18, TypeScript, SCSS, Material Icons
- Backend: Node.js 20, Express.js, TypeScript
- Database: MySQL 8.0
- AI: Google Gemini 2.5 Flash
- Authentication: JWT (JSON Web Tokens)
- Architecture: RESTful API, Role-Based Access Control

---

## Screenshots

### Home Page with AI Chatbot
The landing page features a modern design with the AI support chatbot accessible via floating button.

### Property Search with AI Suggestions
Smart search suggestions help users refine their property searches.

### Property Listing with AI Tools
Owners can use AI to calculate prices and enhance descriptions.

---

## Quick Start Summary

```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Setup database (optional - skip for demo mode)
cd backend
# Create .env file with database credentials
npm run db:init
npm run db:seed

# 3. Configure Gemini API
# Edit frontend/src/environments/environment.ts
# Add your Gemini API key

# 4. Run the application
cd backend && npm run dev # Terminal 1
cd frontend && ng serve # Terminal 2

# 5. Open browser
# http://localhost:4200

# 6. Login (Demo Mode)
# Email: admin@demo.com
# Password: demo123
```

---

Built with for the rental community

Version: 1.0.0 
Last Updated: December 2025
