import { motion } from 'framer-motion';
import { speakAlert, stopSpeaking } from '../utils/voiceAlerts';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function AlertCard({ alert, onDismiss, onSnooze }) {
  const handleDismiss = async () => {
    try {
      const alertId = alert.id || alert._id;
      await api.patch(`/alerts/${alertId}/dismiss`);
      onDismiss(alertId);
      toast.success('Alert dismissed');
    } catch (error) {
      toast.error('Failed to dismiss alert');
    }
  };

  const handleSnooze = async () => {
    const snoozeUntil = new Date();
    snoozeUntil.setMinutes(snoozeUntil.getMinutes() + 15);
    
    try {
      const alertId = alert.id || alert._id;
      await api.patch(`/alerts/${alertId}/snooze`, {
        snoozeUntil: snoozeUntil.toISOString(),
      });
      onSnooze(alertId);
      toast.success('Alert snoozed for 15 minutes');
    } catch (error) {
      toast.error('Failed to snooze alert');
    }
  };

  const handleVoiceAlert = () => {
    speakAlert(alert.message);
  };

  const alertIcons = {
    medication: '💊',
    water: '💧',
    rest: '💤',
    default: '🔔',
  };

  const alertColors = {
    medication: 'from-purple-400 to-pink-400',
    water: 'from-blue-400 to-cyan-400',
    rest: 'from-indigo-400 to-purple-400',
    default: 'from-gray-400 to-gray-500',
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className={`glass-card p-6 bg-gradient-to-r ${alertColors[alert.type] || alertColors.default} text-white mb-4`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <span className="text-4xl">{alertIcons[alert.type] || alertIcons.default}</span>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{alert.message}</h3>
            {alert.scheduledTime && (
              <p className="text-white/80 text-sm">
                Scheduled: {new Date(alert.scheduledTime).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleVoiceAlert}
            className="px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
            title="Voice Alert"
          >
            🔊
          </button>
          <button
            onClick={handleSnooze}
            className="px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
            title="Snooze"
          >
            ⏰
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </motion.div>
  );
}
