import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import AlertCard from '../components/AlertCard';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    medicationAdherence: 0,
    avgSleep: 0,
    waterIntake: 0,
    moodAvg: 0,
  });
  const [waterAmount, setWaterAmount] = useState(250);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Set up interval to check for new alerts
    const interval = setInterval(fetchAlerts, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [alertsRes, recommendationsRes, achievementsRes, medicationRes, sleepRes, waterRes, moodRes] = await Promise.all([
        api.get('/alerts'),
        api.get('/ai/recommendations'),
        api.get('/gamification/achievements'),
        api.get('/health/medication?startDate=' + getDateNDaysAgo(7)),
        api.get('/health/sleep?startDate=' + getDateNDaysAgo(7)),
        api.get('/health/water?date=' + new Date().toISOString().split('T')[0]),
        api.get('/health/mood?startDate=' + getDateNDaysAgo(7)),
      ]);

      setAlerts(alertsRes.data || []);
      setRecommendations(recommendationsRes.data || []);
      setAchievements(achievementsRes.data || []);

      // Calculate medication adherence
      const taken = medicationRes.data.filter(m => m.status === 'taken').length;
      const total = medicationRes.data.length || 1;
      
      // Calculate average sleep
      const avgSleepHours = sleepRes.data.length > 0
        ? sleepRes.data.reduce((sum, s) => sum + (s.duration || 0), 0) / sleepRes.data.length / 60
        : 0;

      // Calculate average mood
      const avgMood = moodRes.data.length > 0
        ? moodRes.data.reduce((sum, m) => sum + (m.mood || 5), 0) / moodRes.data.length
        : 5;

      setStats({
        medicationAdherence: Math.round((taken / total) * 100),
        avgSleep: avgSleepHours,
        waterIntake: waterRes.data?.totalAmount || 0,
        moodAvg: avgMood,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/alerts');
      setAlerts(response.data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleLogWater = async () => {
    try {
      await api.post('/health/water', { amount: waterAmount });
      toast.success(`Logged ${waterAmount}ml of water! 💧`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to log water intake');
    }
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(alerts.filter(a => (a.id || a._id) !== alertId));
  };

  const handleSnoozeAlert = (alertId) => {
    // Alert is still active but snoozed
    fetchAlerts();
  };

  const getDateNDaysAgo = (n) => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-4xl animate-spin">⚕️</div>
        </div>
      </Layout>
    );
  }

  const moodData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Mood',
        data: [4, 5, 4, 6, 5, 7, 6],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const waterGoal = 2000; // 2L daily goal
  const waterPercentage = Math.min((stats.waterIntake / waterGoal) * 100, 100);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Welcome Back!</h1>
          <p className="text-gray-600">Here's your health overview</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon="💊"
            title="Medication"
            value={`${stats.medicationAdherence}%`}
            subtitle="Adherence Rate"
            color="from-purple-400 to-pink-400"
          />
          <StatCard
            icon="😴"
            title="Sleep"
            value={`${stats.avgSleep.toFixed(1)}h`}
            subtitle="Average Daily"
            color="from-indigo-400 to-purple-400"
          />
          <StatCard
            icon="💧"
            title="Water"
            value={`${stats.waterIntake}ml`}
            subtitle="Today's Intake"
            color="from-blue-400 to-cyan-400"
          />
          <StatCard
            icon="😊"
            title="Mood"
            value={`${stats.moodAvg.toFixed(1)}/10`}
            subtitle="Average Mood"
            color="from-green-400 to-emerald-400"
          />
        </div>

        {/* Quick Water Log */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">💧</span>
            Quick Water Log
          </h2>
          <div className="flex items-center space-x-4">
            <select
              value={waterAmount}
              onChange={(e) => setWaterAmount(Number(e.target.value))}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-health-green"
            >
              <option value={250}>250ml</option>
              <option value={500}>500ml</option>
              <option value={750}>750ml</option>
              <option value={1000}>1000ml</option>
            </select>
            <button onClick={handleLogWater} className="btn-primary">
              Log Water
            </button>
            <div className="flex-1 ml-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Water Goal</span>
                <span>{stats.waterIntake}/{waterGoal}ml</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-400 to-cyan-400 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${waterPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">🔔</span>
              {t('alerts')}
            </h2>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <AlertCard
                  key={alert.id || alert._id}
                  alert={alert}
                  onDismiss={handleDismissAlert}
                  onSnooze={handleSnoozeAlert}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">🤖</span>
              {t('recommendations')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-health-green/10 to-health-blue/10 p-4 rounded-xl border border-health-green/20"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-3xl">{rec.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-800">{rec.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{rec.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">🏆</span>
              {t('achievements')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-yellow-400 to-orange-400 p-4 rounded-xl text-center text-white"
                >
                  <span className="text-4xl block mb-2">{achievement.icon}</span>
                  <h3 className="font-bold">{achievement.name}</h3>
                  <p className="text-xs mt-1 opacity-90">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Mood Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Weekly Mood Trend</h2>
          <Line data={moodData} options={{ responsive: true }} />
        </motion.div>
      </div>
    </Layout>
  );
}

function StatCard({ icon, title, value, subtitle, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`glass-card p-6 bg-gradient-to-br ${color} text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-white/70 text-xs mt-1">{subtitle}</p>
        </div>
        <span className="text-5xl">{icon}</span>
      </div>
    </motion.div>
  );
}