import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { speakAlert } from '../utils/voiceAlerts';
import toast from 'react-hot-toast';
import AlertCard from './AlertCard';

export default function AlertManager() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Check for alerts on mount
    checkAlerts();

    // Set up interval to check for alerts every minute
    const interval = setInterval(checkAlerts, 60000);

    // Check for scheduled medication times
    const medicationInterval = setInterval(checkMedicationTimes, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(medicationInterval);
    };
  }, [user]);

  const checkAlerts = async () => {
    try {
      const response = await api.get('/alerts');
      const activeAlerts = response.data.filter(alert => {
        if (!alert.active) return false;
        
        // Check if it's time for this alert
        if (alert.scheduledTime) {
          const now = new Date();
          const scheduled = new Date(alert.scheduledTime);
          const diff = scheduled - now;
          
          // Show alert if it's within the next minute
          return diff >= 0 && diff < 60000;
        }
        
        return true;
      });

      setAlerts(activeAlerts);

      // Trigger voice alerts for new alerts
      activeAlerts.forEach(alert => {
        speakAlert(alert.message);
        toast(alert.message, {
          icon: alert.type === 'medication' ? '💊' : alert.type === 'water' ? '💧' : '💤',
          duration: 5000,
        });
      });
    } catch (error) {
      console.error('Error checking alerts:', error);
    }
  };

  const checkMedicationTimes = async () => {
    try {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const today = now.toISOString().split('T')[0];

      const response = await api.get(`/health/medication?startDate=${today}&endDate=${today}`);
      const pendingMeds = response.data.filter(med => {
        if (med.status !== 'pending') return false;
        const medTime = med.time.split(':').slice(0, 2).join(':');
        return medTime === currentTime;
      });

      pendingMeds.forEach(med => {
        const message = `Time to take your ${med.medicationName} 💊`;
        speakAlert(message);
        toast(message, { icon: '💊', duration: 5000 });

        // Create alert if not exists
        api.post('/alerts', {
          type: 'medication',
          message,
          scheduledTime: new Date().toISOString(),
        });
      });
    } catch (error) {
      console.error('Error checking medication times:', error);
    }
  };

  const handleDismiss = (alertId) => {
    setAlerts(alerts.filter(a => (a.id || a._id) !== alertId));
  };

  const handleSnooze = (alertId) => {
    // Alerts are still active but snoozed
    checkAlerts();
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-4 max-w-md">
      {alerts.map((alert) => (
        <AlertCard
          key={alert.id || alert._id}
          alert={alert}
          onDismiss={handleDismiss}
          onSnooze={handleSnooze}
        />
      ))}
    </div>
  );
}
