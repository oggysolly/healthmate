import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
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

export default function Sleep() {
  const { t } = useTranslation();
  const [sleepLogs, setSleepLogs] = useState([]);
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSleepLogs();
  }, []);

  const fetchSleepLogs = async () => {
    try {
      const response = await api.get('/health/sleep?startDate=' + getDateNDaysAgo(7));
      setSleepLogs(response.data);
    } catch (error) {
      toast.error('Failed to fetch sleep logs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/health/sleep', formData);
      toast.success('Sleep logged successfully!');
      setFormData({
        startTime: '',
        endTime: '',
        date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
      fetchSleepLogs();
    } catch (error) {
      toast.error('Failed to log sleep');
    }
  };

  const getDateNDaysAgo = (n) => {
    const date = new Date();
    date.setDate(date.getDate() - n);
    return date.toISOString().split('T')[0];
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const sleepData = {
    labels: sleepLogs.slice(-7).map(log => log.date),
    datasets: [
      {
        label: 'Sleep Duration (hours)',
        data: sleepLogs.slice(-7).map(log => (log.duration || 0) / 60),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const avgSleep = sleepLogs.length > 0
    ? sleepLogs.reduce((sum, log) => sum + (log.duration || 0), 0) / sleepLogs.length / 60
    : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold gradient-text flex items-center">
            <span className="mr-3">😴</span>
            {t('sleep')}
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Log Sleep'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 bg-gradient-to-br from-indigo-400 to-purple-400 text-white">
            <p className="text-white/80 mb-2">Average Sleep</p>
            <p className="text-3xl font-bold">{avgSleep.toFixed(1)} hours</p>
          </div>
          <div className="glass-card p-6 bg-gradient-to-br from-blue-400 to-cyan-400 text-white">
            <p className="text-white/80 mb-2">Total Logs</p>
            <p className="text-3xl font-bold">{sleepLogs.length}</p>
          </div>
          <div className="glass-card p-6 bg-gradient-to-br from-purple-400 to-pink-400 text-white">
            <p className="text-white/80 mb-2">This Week</p>
            <p className="text-3xl font-bold">{sleepLogs.filter(s => {
              const logDate = new Date(s.date);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return logDate >= weekAgo;
            }).length} days</p>
          </div>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h2 className="text-2xl font-bold mb-4">Log Sleep</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Sleep Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-health-green"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Wake Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-health-green"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-health-green"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                Log Sleep
              </button>
            </form>
          </motion.div>
        )}

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Sleep Duration Trend</h2>
          <Line data={sleepData} options={{ responsive: true }} />
        </motion.div>

        {/* Sleep Logs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Recent Sleep Logs</h2>
          <div className="space-y-3">
            {sleepLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sleep logs yet</p>
            ) : (
              sleepLogs.slice(0, 10).map((log) => (
                <div
                  key={log._id || log.id}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-xl"
                >
                  <div>
                    <h3 className="font-bold text-lg">{log.date}</h3>
                    <p className="text-gray-600">
                      {log.startTime} - {log.endTime} • {formatDuration(log.duration || 0)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
