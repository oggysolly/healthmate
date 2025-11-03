// Vercel serverless function entry point for root /api route
import app from '../index.js';

export default async function handler(req, res) {
  // Handle root /api path
  return new Promise((resolve, reject) => {
    // Ensure the path includes /api
    if (!req.url.startsWith('/api')) {
      req.url = '/api' + (req.url === '/' ? '' : req.url);
      req.originalUrl = req.url;
    }
    
    app(req, res, (err) => {
      if (err) {
        console.error('Express error:', err);
        return reject(err);
      }
      resolve();
    });
  });
}
