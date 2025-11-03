// Vercel serverless function - catch-all route handler
// This file handles all /api/* routes as serverless functions

import app from '../index.js';

export default async function handler(req, res) {
  // Handle OPTIONS preflight requests immediately
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    // Set the origin from the request (browsers always send it for CORS)
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else {
      // No origin means not a browser request, allow it
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }

  // Vercel serverless functions receive requests here
  // We pass them to our Express app
  return new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}
