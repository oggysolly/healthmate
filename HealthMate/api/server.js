// Development server (not for Vercel deployment)
import app from './index.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Only start server if not in Vercel environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health-check`);
    console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    console.log('');
    console.log('Press Ctrl+C to stop the server');
  });
  
  // Handle errors
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
  });
}
