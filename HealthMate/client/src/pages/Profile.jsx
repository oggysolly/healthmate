import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    language: 'en',
    notifications: true,
    voiceAlerts: true,
  });

  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences);
    }
  }, [user]);

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold gradient-text flex items-center">
          <span className="mr-3">👤</span>
          Profile
        </h1>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-1">Name</label>
              <p className="text-xl font-semibold">{user?.name}</p>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <p className="text-xl font-semibold">{user?.email}</p>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Role</label>
              <p className="text-xl font-semibold capitalize">{user?.role}</p>
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-gray-700 font-medium">Notifications</label>
                <p className="text-sm text-gray-500">Receive push notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.notifications}
                  onChange={(e) =>
                    setPreferences({ ...preferences, notifications: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-health-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-health-green"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-gray-700 font-medium">Voice Alerts</label>
                <p className="text-sm text-gray-500">Enable voice reminders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.voiceAlerts}
                  onChange={(e) =>
                    setPreferences({ ...preferences, voiceAlerts: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-health-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-health-green"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 text-center"
        >
          <span className="text-6xl mb-4 block">⚕️</span>
          <h2 className="text-2xl font-bold gradient-text mb-2">HealthMate</h2>
          <p className="text-gray-600">
            Your wellness companion for better health tracking and management.
          </p>
          <p className="text-sm text-gray-500 mt-4">Version 1.0.0</p>
        </motion.div>
      </div>
    </Layout>
  );
}
