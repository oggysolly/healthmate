# 🚀 Quick Start Guide - Fix Connection Error

## The Problem
You're seeing `ERR_CONNECTION_REFUSED` because the **API server is not running**.

## Solution: Start the API Server

### Step 1: Check if you have environment variables

Create a file called `.env` in the `api` folder with:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthmate?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this
```

**Important:** 
- Replace `username`, `password`, and `cluster` with your MongoDB Atlas credentials
- Make sure MongoDB Atlas allows connections from your IP (or use `0.0.0.0/0` for development)

### Step 2: Start the API Server

#### Option A: Using the provided script (Easiest)

**Windows (Double-click):**
- Double-click `start-api.bat`

**Windows PowerShell:**
```powershell
.\start-api.ps1
```

#### Option B: Manual Start

**Open a terminal/command prompt:**

1. Navigate to the api folder:
```bash
cd api
```

2. Start the server:
```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
📊 Health check: http://localhost:5000/api/health-check
```

### Step 3: Verify API is Running

Open your browser and visit:
- http://localhost:5000/api/health-check

You should see:
```json
{"status":"ok","message":"HealthMate API is running"}
```

### Step 4: Start the React App (in a NEW terminal)

**Keep the API server running**, then open a **NEW terminal**:

```bash
cd client
npm run dev
```

The React app will start on http://localhost:3000

## ✅ Success Checklist

- [ ] Created `api/.env` file with MongoDB URI
- [ ] API server running (see console output)
- [ ] Can access http://localhost:5000/api/health-check
- [ ] React app running on http://localhost:3000
- [ ] No more connection errors!

## Troubleshooting

### "Cannot find module" error
Run in the `api` folder:
```bash
npm install
```

### "Port 5000 already in use"
Change the port in `api/server.js`:
```js
const PORT = process.env.PORT || 5001; // Change to 5001
```

And update `client/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

### MongoDB Connection Error
1. Check your connection string is correct
2. Make sure your IP is whitelisted in MongoDB Atlas
3. Verify your database user has proper permissions

### Still having issues?
1. Make sure Node.js is installed: `node --version` (should be 18+)
2. Check all dependencies are installed: `npm install` in both `api` and `client` folders
3. Check the console for specific error messages

## Need Help?
Check the detailed setup guide in `SETUP.md`
