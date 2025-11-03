import express from 'express';
import { ObjectId } from 'mongodb';
import { connectDB } from '../utils/db.js';
import { authenticateToken } from '../utils/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Get active alerts for user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = await connectDB();
    const alerts = db.collection('alerts');

    const userAlerts = await alerts
      .find({ userId, active: true })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(userAlerts);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create alert
router.post('/', async (req, res) => {
  try {
    const { type, message, scheduledTime, recurring } = req.body;
    const userId = req.user.userId;

    const db = await connectDB();
    const alerts = db.collection('alerts');

    const alert = {
      userId,
      type,
      message,
      scheduledTime,
      recurring,
      active: true,
      createdAt: new Date(),
    };

    const result = await alerts.insertOne(alert);
    res.status(201).json({ id: result.insertedId.toString(), ...alert });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Dismiss alert
router.patch('/:id/dismiss', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const db = await connectDB();
    const alerts = db.collection('alerts');

    await alerts.updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { active: false, dismissedAt: new Date() } }
    );

    res.json({ message: 'Alert dismissed' });
  } catch (error) {
    console.error('Dismiss alert error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Snooze alert
router.patch('/:id/snooze', async (req, res) => {
  try {
    const { id } = req.params;
    const { snoozeUntil } = req.body;
    const userId = req.user.userId;
    const db = await connectDB();
    const alerts = db.collection('alerts');

    await alerts.updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { snoozedUntil: snoozeUntil } }
    );

    res.json({ message: 'Alert snoozed' });
  } catch (error) {
    console.error('Snooze alert error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
