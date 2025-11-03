# Quick Start Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (free tier)

## Step 1: Install Dependencies

```bash
npm run install-all
```

If you get an error, install concurrently:
```bash
npm install concurrently --save-dev
```

Then install dependencies in each folder:
```bash
cd client && npm install
cd ../api && npm install
```

## Step 2: Set Up Environment Variables

### Create `.env` file in the root directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthmate?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OPENAI_API_KEY=sk-your-openai-api-key-here (optional)
```

### Create `client/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

## Step 3: Start the Application

### Option A: Start Both Together (Recommended)
```bash
npm run dev
```

This will start:
- API server on http://localhost:5000
- React app on http://localhost:3000

### Option B: Start Separately

**Terminal 1 - Start API:**
```bash
cd api
npm run dev
```

**Terminal 2 - Start Client:**
```bash
cd client
npm run dev
```

## Step 4: Access the Application

- Frontend: http://localhost:3000
- API: http://localhost:5000
- Health Check: http://localhost:5000/api/health-check

## Troubleshooting

### "Connection Refused" Error
Make sure the API server is running on port 5000. Check:
1. Is `api/.env` or root `.env` configured with MongoDB URI?
2. Run `cd api && npm run dev` in a separate terminal
3. Check console for MongoDB connection errors

### MongoDB Connection Issues
1. Make sure MongoDB Atlas cluster is running
2. Check your IP is whitelisted (0.0.0.0/0 for development)
3. Verify connection string is correct
4. Ensure database user has read/write permissions

### Port Already in Use
If port 5000 is busy, change it in `api/server.js`:
```js
const PORT = process.env.PORT || 5001; // Change to 5001 or another port
```

And update `client/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

## Need Help?

Check the SETUP.md file for detailed instructions.
