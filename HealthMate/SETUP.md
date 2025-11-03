# HealthMate Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (free tier works)
- Vercel account (for deployment)

## Local Development Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install API dependencies
cd ../api
npm install
```

Or use the convenience script:
```bash
npm run install-all
```

### 2. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (0.0.0.0/0 for development)
5. Get your connection string

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthmate?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OPENAI_API_KEY=sk-your-openai-api-key-here (optional)
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Development Server

#### Option A: Run Client Only (uses proxy)
```bash
cd client
npm run dev
```
The client will run on http://localhost:3000 and proxy API requests.

#### Option B: Run Both (recommended for testing)
Terminal 1 - API:
```bash
cd api
npm run dev
```

Terminal 2 - Client:
```bash
cd client
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:3000
- API: http://localhost:5000

## Vercel Deployment

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Deploy to Vercel

```bash
vercel
```

Follow the prompts:
- Link to existing project or create new
- Set root directory to project root
- Set build command: `cd client && npm run build`
- Set output directory: `client/dist`

### 3. Configure Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables and add:

- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Your JWT secret key
- `OPENAI_API_KEY` - (Optional) OpenAI API key

### 4. Update API URL

After deployment, update `VITE_API_URL` in Vercel environment variables to:
```
https://your-project.vercel.app/api
```

Or update the client code to use the deployed API URL.

## Project Structure

```
healthmate/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── utils/         # Utility functions
│   │   └── ...
│   └── package.json
├── api/                    # Express backend (Vercel serverless)
│   ├── routes/            # API route handlers
│   ├── utils/             # Utility functions
│   └── index.js           # Main Express app
├── vercel.json            # Vercel configuration
└── package.json           # Root package.json
```

## Features

✅ User Authentication (JWT)
✅ Medication Tracking
✅ Sleep Logging
✅ Mood Tracking
✅ Water Intake Logging
✅ Real-time Alerts with Voice Reminders
✅ AI-powered Recommendations
✅ Gamification (Achievements/Badges)
✅ Multi-language Support (English, Spanish, French)
✅ Responsive Design
✅ Charts and Analytics

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Health Tracking
- `POST /api/health/medication` - Log medication
- `GET /api/health/medication` - Get medication logs
- `PATCH /api/health/medication/:id` - Update medication status
- `POST /api/health/sleep` - Log sleep
- `GET /api/health/sleep` - Get sleep logs
- `POST /api/health/mood` - Log mood
- `GET /api/health/mood` - Get mood logs
- `POST /api/health/water` - Log water intake
- `GET /api/health/water` - Get water logs

### Alerts
- `GET /api/alerts` - Get active alerts
- `POST /api/alerts` - Create alert
- `PATCH /api/alerts/:id/dismiss` - Dismiss alert
- `PATCH /api/alerts/:id/snooze` - Snooze alert

### AI & Gamification
- `GET /api/ai/recommendations` - Get AI recommendations
- `GET /api/gamification/achievements` - Get user achievements

## Troubleshooting

### MongoDB Connection Issues
- Verify your connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

### CORS Errors
- Make sure API URL is correctly configured
- Check Vercel headers configuration

### Build Errors
- Clear node_modules and reinstall
- Check Node.js version (should be 18+)
- Verify all environment variables are set

## Support

For issues or questions, please check the README.md or create an issue in the repository.
