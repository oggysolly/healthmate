import express from 'express';
import { ObjectId } from 'mongodb';
import { connectDB } from '../utils/db.js';
import { authenticateToken } from '../utils/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Get user achievements
router.get('/achievements', async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = await connectDB();

    const medicationLogs = db.collection('medication_logs');
    const sleepLogs = db.collection('sleep_logs');
    const waterLogs = db.collection('water_logs');

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateStr = sevenDaysAgo.toISOString().split('T')[0];

    const [medications, sleep, water] = await Promise.all([
      medicationLogs.find({ userId, date: { $gte: dateStr }, status: 'taken' }).toArray(),
      sleepLogs.find({ userId, date: { $gte: dateStr } }).toArray(),
      waterLogs.find({ userId, date: { $gte: dateStr } }).toArray(),
    ]);

    const achievements = [];

    // Medicine Master badge
    if (medications.length >= 14) {
      achievements.push({
        id: 'medicine_master',
        name: 'Medicine Master',
        description: 'Took all medications for 7 days',
        icon: '💊',
        unlocked: true,
        unlockedAt: new Date(),
      });
    }

    // Sleep Champ badge
    if (sleep.length >= 7) {
      achievements.push({
        id: 'sleep_champ',
        name: 'Sleep Champ',
        description: 'Logged sleep for 7 consecutive days',
        icon: '😴',
        unlocked: true,
        unlockedAt: new Date(),
      });
    }

    // Hydration Hero badge
    const totalWater = water.reduce((sum, w) => sum + (w.amount || 0), 0);
    if (totalWater >= 14000) { // 2L per day for 7 days
      achievements.push({
        id: 'hydration_hero',
        name: 'Hydration Hero',
        description: 'Drank 2L+ water daily for 7 days',
        icon: '💧',
        unlocked: true,
        unlockedAt: new Date(),
      });
    }

    // Wellness Warrior
    if (achievements.length >= 3) {
      achievements.push({
        id: 'wellness_warrior',
        name: 'Wellness Warrior',
        description: 'Unlocked all basic achievements',
        icon: '🏆',
        unlocked: true,
        unlockedAt: new Date(),
      });
    }

    res.json(achievements);
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
