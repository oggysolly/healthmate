import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthmate';

// For serverless functions, we need to cache the connection globally
// to avoid creating new connections on every function invocation
let cachedClient = null;
let cachedDb = null;

export async function connectDB() {
  try {
    // In serverless environments, reuse existing connection
    if (cachedClient && cachedDb) {
      // Check if connection is still alive
      try {
        await cachedClient.db('admin').command({ ping: 1 });
        return cachedDb;
      } catch (e) {
        // Connection is dead, need to reconnect
        cachedClient = null;
        cachedDb = null;
      }
    }

    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    const db = client.db('healthmate');

    // Cache the connection
    cachedClient = client;
    cachedDb = db;

    console.log('Connected to MongoDB Atlas');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export function getDB() {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return db;
}

export async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
