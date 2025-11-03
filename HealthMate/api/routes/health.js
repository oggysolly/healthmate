import express from 'express';
import { ObjectId } from 'mongodb';
import { connectDB } from '../utils/db.js';
import { authenticateToken } from '../utils/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Medication logs
router.post('/medication', async (req, res) => {
  try {
    const { medicationName, dosage, time, date } = req.body;
    const userId = req.user.userId;

    const db = await connectDB();
    const logs = db.collection('medication_logs');

    const log = {
      userId,
      medicationName,
      dosage,
      time,
      date: date || new Date().toISOString().split('T')[0],
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await logs.insertOne(log);
    res.status(201).json({ id: result.insertedId.toString(), ...log });
  } catch (error) {
    console.error('Medication log error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/medication', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { startDate, endDate } = req.query;

    const db = await connectDB();
    const logs = db.collection('medication_logs');

    const query = { userId };
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const medicationLogs = await logs.find(query).sort({ date: -1, time: 1 }).toArray();
    res.json(medicationLogs);
  } catch (error) {
    console.error('Get medication error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/medication/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    const db = await connectDB();
    const logs = db.collection('medication_logs');

    const result = await logs.updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Medication log not found' });
    }

    res.json({ message: 'Medication log updated' });
  } catch (error) {
    console.error('Update medication error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Sleep logs
router.post('/sleep', async (req, res) => {
  try {
    const { startTime, endTime, date } = req.body;
    const userId = req.user.userId;

    const db = await connectDB();
    const logs = db.collection('sleep_logs');

    const sleepDuration = calculateSleepDuration(startTime, endTime);

    const log = {
      userId,
      startTime,
      endTime,
      date: date || new Date().toISOString().split('T')[0],
      duration: sleepDuration,
      createdAt: new Date(),
    };

    const result = await logs.insertOne(log);
    res.status(201).json({ id: result.insertedId.toString(), ...log });
  } catch (error) {
    console.error('Sleep log error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/sleep', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { startDate, endDate } = req.query;

    const db = await connectDB();
    const logs = db.collection('sleep_logs');

    const query = { userId };
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const sleepLogs = await logs.find(query).sort({ date: -1 }).toArray();
    res.json(sleepLogs);
  } catch (error) {
    console.error('Get sleep error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mood logs
router.post('/mood', async (req, res) => {
  try {
    const { mood, note, date } = req.body;
    const userId = req.user.userId;

    const db = await connectDB();
    const logs = db.collection('mood_logs');

    const log = {
      userId,
      mood,
      note,
      date: date || new Date().toISOString().split('T')[0],
      createdAt: new Date(),
    };

    const result = await logs.insertOne(log);
    res.status(201).json({ id: result.insertedId.toString(), ...log });
  } catch (error) {
    console.error('Mood log error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/mood', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { startDate, endDate } = req.query;

    const db = await connectDB();
    const logs = db.collection('mood_logs');

    const query = { userId };
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const moodLogs = await logs.find(query).sort({ date: -1 }).toArray();
    res.json(moodLogs);
  } catch (error) {
    console.error('Get mood error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Water intake
router.post('/water', async (req, res) => {
  try {
    const { amount, date } = req.body;
    const userId = req.user.userId;

    const db = await connectDB();
    const logs = db.collection('water_logs');

    const log = {
      userId,
      amount,
      date: date || new Date().toISOString().split('T')[0],
      createdAt: new Date(),
    };

    const result = await logs.insertOne(log);
    res.status(201).json({ id: result.insertedId.toString(), ...log });
  } catch (error) {
    console.error('Water log error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/water', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { date } = req.query;

    const db = await connectDB();
    const logs = db.collection('water_logs');

    const query = { userId };
    if (date) {
      query.date = date;
    }

    const waterLogs = await logs.find(query).sort({ createdAt: -1 }).toArray();
    const totalAmount = waterLogs.reduce((sum, log) => sum + (log.amount || 0), 0);
    
    res.json({ logs: waterLogs, totalAmount });
  } catch (error) {
    console.error('Get water error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

function calculateSleepDuration(startTime, endTime) {
  const start = new Date(`2000-01-01T${startTime}`);
  let end = new Date(`2000-01-01T${endTime}`);
  
  // Handle overnight sleep
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  const diff = end - start;
  return Math.round(diff / (1000 * 60)); // Return minutes
}

export default router;
