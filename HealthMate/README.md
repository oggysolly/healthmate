# HealthMate 🏥

A full-stack MERN healthcare web application that provides real-time wellness alerts and AI-powered health assistance to patients.

## Features

- 🚨 Real-time health alerts with voice reminders
- 💊 Medication tracking and adherence analytics
- 😴 Sleep tracker with consistency graphs
- 😊 Mood tracking and analytics
- 🤖 AI-powered health recommendations
- 👨‍👩‍👧‍👦 Family/Doctor access with role-based permissions
- 🏆 Gamification with digital badges
- 🌍 Multi-language support

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS + Chart.js + Framer Motion
- **Backend:** Express.js (Vercel Serverless Functions)
- **Database:** MongoDB Atlas
- **Hosting:** Vercel
- **Notifications:** Web Push API
- **Voice:** Web Speech API
- **Auth:** JWT

## Setup

1. Install dependencies:
```bash
npm run install-all
```

2. Set up environment variables:
- Create `.env` in root with:
  - `MONGODB_URI` - MongoDB Atlas connection string
  - `JWT_SECRET` - Secret for JWT tokens
  - `OPENAI_API_KEY` - (Optional) OpenAI API key for AI features

3. Run development server:
```bash
npm run dev
```

## Deployment

Deploy to Vercel:
```bash
vercel
```

Make sure to add environment variables in Vercel dashboard.
