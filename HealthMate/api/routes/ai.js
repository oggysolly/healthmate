import express from 'express';
import { ObjectId } from 'mongodb';
import { connectDB } from '../utils/db.js';
import { authenticateToken } from '../utils/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Get AI recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = await connectDB();

    // Get recent health data
    const medicationLogs = db.collection('medication_logs');
    const sleepLogs = db.collection('sleep_logs');
    const waterLogs = db.collection('water_logs');
    const moodLogs = db.collection('mood_logs');

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateStr = sevenDaysAgo.toISOString().split('T')[0];

    const [medications, sleep, water, moods] = await Promise.all([
      medicationLogs.find({ userId, date: { $gte: dateStr } }).toArray(),
      sleepLogs.find({ userId, date: { $gte: dateStr } }).toArray(),
      waterLogs.find({ userId, date: { $gte: dateStr } }).toArray(),
      moodLogs.find({ userId, date: { $gte: dateStr } }).toArray(),
    ]);

    // Rule-based recommendations
    const recommendations = [];

    // Medication adherence
    const missedMeds = medications.filter(m => m.status === 'missed').length;
    if (missedMeds > 0) {
      recommendations.push({
        type: 'medication',
        priority: 'high',
        title: 'Medication Adherence',
        message: `You've missed ${missedMeds} medication dose(s). Try setting reminders for your medication times.`,
        icon: '💊',
      });
    }

    // Sleep analysis
    const avgSleep = sleep.reduce((sum, s) => sum + (s.duration || 0), 0) / Math.max(sleep.length, 1);
    if (avgSleep < 420) { // Less than 7 hours
      recommendations.push({
        type: 'sleep',
        priority: 'medium',
        title: 'Sleep Improvement',
        message: `Your average sleep is ${Math.round(avgSleep / 60)} hours. Aim for 7-9 hours of quality sleep.`,
        icon: '😴',
      });
    }

    // Water intake
    const todayWater = water
      .filter(w => w.date === new Date().toISOString().split('T')[0])
      .reduce((sum, w) => sum + (w.amount || 0), 0);
    if (todayWater < 2000) { // Less than 2L
      recommendations.push({
        type: 'hydration',
        priority: 'medium',
        title: 'Stay Hydrated',
        message: `You've had ${todayWater}ml today. Aim for 2-3 liters daily for optimal health.`,
        icon: '💧',
      });
    }

    // Mood trends
    if (moods.length > 0) {
      const recentMoods = moods.slice(0, 3).map(m => m.mood);
      const avgMood = recentMoods.reduce((sum, m) => sum + (m || 5), 0) / recentMoods.length;
      if (avgMood < 4) {
        recommendations.push({
          type: 'mood',
          priority: 'medium',
          title: 'Wellness Check',
          message: 'Your mood has been lower recently. Consider rest, light exercise, or speaking with someone.',
          icon: '💙',
        });
      }
    }

    res.json(recommendations);
  } catch (error) {
    console.error('AI recommendations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
