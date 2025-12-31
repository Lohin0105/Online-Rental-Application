# Haven - Complete Setup Guide

This guide will help you set up the Haven rental platform from scratch.

---

## Prerequisites

Before starting, ensure you have:

- Node.js: v20.17.0 or higher ([Download](https://nodejs.org/))
- npm: v10.x or higher (comes with Node.js)
- MySQL: v8.0 or higher ([Download](https://dev.mysql.com/downloads/mysql/)) - Optional for demo mode
- Gemini API Key: Free from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Verify Installations

```bash
node --version # Should show v20.x.x or higher
npm --version # Should show 10.x.x or higher
mysql --version # Should show 8.0.x or higher
```

---

## Quick Start (Demo Mode - No Database)

Perfect for testing! Works without MySQL.

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### Step 2: Configure Gemini API Key

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Open `frontend/src/environments/environment.ts`
3. Add your API key:

```typescript
export const environment = {
production: false,
apiUrl: 'http://localhost:3001/api',
geminiApiKey: 'YOUR_API_KEY_HERE' // ← Paste your key here
};
```

### Step 3: Start the Application

Open 2 terminal windows:

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Wait for: `Server running on: http://localhost:3001`

Terminal 2 - Frontend:
```bash
cd frontend
ng serve
```

Wait for: `Angular Live Development Server is listening on localhost:4200`

### Step 4: Access the Application

Open your browser: http://localhost:4200

### Step 5: Login with Demo Accounts

| Role | Email | Password | Features |
|------|-------|----------|----------|
| Tenant | tenant@demo.com | demo123 | Browse properties, AI search, chatbot |
| Owner | owner@demo.com | demo123 | List properties, AI tools, price calculator |
| Admin | admin@demo.com | demo123 | Manage users, properties, full control |

Done! All AI features work in demo mode.

---

## Full Setup (With MySQL Database)

For complete functionality including property listings and bookings.

### Step 1: Install and Start MySQL

#### Windows:
1. Download MySQL Installer from [mysql.com](https://dev.mysql.com/downloads/mysql/)
2. Run installer, choose "Developer Default"
3. Set root password (remember this!)
4. Complete installation
5. MySQL should start automatically

#### Mac:
```bash
brew install mysql
brew services start mysql
```

#### Linux:
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### Step 2: Verify MySQL is Running

```bash
# Windows (PowerShell)
Get-Service -Name "mysql"

# Mac
brew services list | grep mysql

# Linux
sudo systemctl status mysql
```

You should see MySQL service is running.

### Step 3: Create Backend Configuration

Create a file `backend/.env` with:

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

# JWT Configuration (change in production)
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

Important: Replace `your_mysql_password_here` with the password you set during MySQL installation.

### Step 4: Initialize Database

```bash
cd backend

# Create database and tables
npm run db:init

# (Optional) Add demo data
npm run db:seed
```

You should see:
```
Database created successfully
Tables created successfully
Demo data seeded (if you ran db:seed)
```

### Step 5: Configure Gemini API

Same as demo mode:

1. Get API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Edit `frontend/src/environments/environment.ts`
3. Add your API key

### Step 6: Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
ng serve
```

### Step 7: Access and Login

Open http://localhost:4200

If you seeded the database, login with:
- Tenant: alice.tenant@email.com / password123
- Owner: bob.owner@email.com / password123
- Admin: admin@haven.com / admin123

Or register a new account!

---

## AI Features Setup

All AI features require a Gemini API key.

### Getting Your API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

### Configuring the Key

Edit `frontend/src/environments/environment.ts`:

```typescript
export const environment = {
production: false,
apiUrl: 'http://localhost:3001/api',
geminiApiKey: 'AIzaSy...' // Your actual key
};
```

### AI Features Available

1. 24/7 AI Support Chatbot
- Floating button on all pages
- Answers questions about Haven
- Context-aware responses

2. Smart Property Search (RAG)
- Natural language queries
- Example: "2 bedroom apartment downtown under ₹50,000"
- AI extracts filters automatically

3. Price Calculator
- For property owners
- AI-powered market analysis
- Competitive pricing suggestions

4. Description Enhancer
- Transforms basic text into professional copy
- One-click enhancement
- Saves 15+ minutes per listing

### API Limits

- Free Tier: 60 requests per minute
- Model: gemini-2.5-flash (fast and efficient)
- If you hit limits, wait 60 seconds

---

## Troubleshooting

### "MySQL Connection Refused"

Problem: MySQL is not running

Solution:
```bash
# Windows: Open Services, find MySQL80, click Start
# Or use PowerShell:
Start-Service MySQL80

# Mac:
brew services start mysql

# Linux:
sudo systemctl start mysql
```

### "Port 3001 Already in Use"

Problem: Backend already running or port blocked

Solution:
```bash
# Windows (PowerShell):
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force

# Mac/Linux:
lsof -ti:3001 | xargs kill -9

# Then restart backend:
cd backend
npm run dev
```

### "Gemini API Error" or "Invalid API Key"

Problem: API key not configured or invalid

Solution:
1. Get new key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Update `frontend/src/environments/environment.ts`
3. Restart frontend: `Ctrl+C` then `ng serve`

### "Angular Build Errors"

Problem: Version mismatch or corrupted modules

Solution:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
ng serve
```

### "Database Not Found"

Problem: Database not initialized

Solution:
```bash
cd backend
npm run db:init
```

---

## Project Structure

```
Haven/
backend/ # Node.js/Express Backend
src/
config/
database.ts # MySQL connection
init-db.ts # Database setup script
seed-db.ts # Demo data script
controllers/
authController.demo.ts # Demo mode auth
adminController.demo.ts # Demo mode admin
...
routes/ # API endpoints
server.ts # Entry point
.env # Config (create this)
package.json

frontend/ # Angular 18 Frontend
src/
app/
core/
services/
ai-chatbot.service.ts # Gemini AI
pages/
shared/
components/
ai-chatbot/ # Support chat
price-calculator/ # AI pricing
environments/
environment.ts # API keys (edit this)
styles.scss
package.json

README.md # Main documentation
SETUP_GUIDE.md # This file
```

---

## Testing the Application

### Test Demo Mode (No Database)

1. Login: Use tenant@demo.com / demo123
2. AI Chatbot: Click floating icon, ask "How do I book?"
3. Smart Search: Type "2BR downtown" and press Enter
4. View Properties: Browse (will be empty in demo mode)

### Test Full Mode (With Database)

1. Register: Create new account
2. As Owner:
- List a property
- Use price calculator
- Enhance description with AI
3. As Tenant:
- Search properties
- Use smart search
- Submit booking request
4. As Admin:
- View dashboard
- Manage users
- Delete properties

---

## Security Notes

### For Development

- Demo accounts are safe for testing
- API keys are in frontend (okay for dev)
- JWT secret is in `.env` (not committed)

### For Production

1. Change JWT Secret: Use strong random string
2. Secure API Keys: Use environment variables
3. Enable HTTPS: Always use SSL in production
4. Strong Passwords: Enforce password policies
5. Rate Limiting: Add API rate limits

---

## What Works in Each Mode

### Demo Mode (No MySQL)
- Login/Logout (3 demo accounts)
- All 4 AI features
- AI chatbot
- Smart search
- Price calculator
- Description enhancer
- Property listings (empty)
- Bookings
- Registration

### Full Mode (With MySQL)
- Everything from demo mode
- Create/view/edit properties
- Submit/manage bookings
- User registration
- Profile management
- Full CRUD operations

---

## Next Steps

1. Explore Features: Try all AI tools
2. Customize Styling: Edit `frontend/src/styles.scss`
3. Add Properties: List sample properties as owner
4. Test Workflows: Complete booking flow
5. Deploy: See README.md for deployment guide

---

## Tips

- Gemini API: 60 requests/minute is plenty for testing
- Demo Mode: Perfect for quick demos
- Database: Only needed for full features
- Browser: Use Chrome/Edge for best experience
- Hot Reload: Frontend auto-reloads on changes

---

## Need Help?

1. Check this guide first
2. Review error messages in console
3. Verify all prerequisites installed
4. Check README.md for more details
5. Ensure API keys are correct

---

## Quick Checklist

Before starting:
- [ ] Node.js v20+ installed
- [ ] npm v10+ installed
- [ ] (Optional) MySQL 8+ installed
- [ ] Gemini API key obtained
- [ ] Two terminal windows ready

Setup steps:
- [ ] Dependencies installed (backend + frontend)
- [ ] Gemini API key configured
- [ ] (If using MySQL) `.env` file created
- [ ] (If using MySQL) Database initialized
- [ ] Backend started successfully
- [ ] Frontend started successfully
- [ ] Can access http://localhost:4200
- [ ] Can login with demo account

---

## Setup Complete

You're ready to use Haven!

Version: 1.0.0 
Last Updated: December 2025
