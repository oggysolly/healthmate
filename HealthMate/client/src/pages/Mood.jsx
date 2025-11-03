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

const moods = [
  { value: 1, emoji: '😢', label: 'Very Sad' },
  { value: 2, emoji: '😔', label: 'Sad' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Happy' },
  { value: 6, emoji: '😄', label: 'Very Happy' },
  { value: 7, emoji: '🤩', label: 'Excellent' },
];

export default function Mood() {
  const { t } = useTranslation();
  const [moodLogs, setMoodLogs] = useState([]);
  const [formData, setFormData] = useState({
    mood: 5,
    note: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoodLogs();
  }, []);

  const fetchMoodLogs = async () => {
    try {
      const response = await api.get('/health/mood?startDate=' + getDateNDaysAgo(7));
      setMoodLogs(response.data);
    } catch (error) {
      toast.error('Failed to fetch mood logs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/health/mood', formData);
      toast.success('Mood logged successfully!');
      setFormData({
        mood: 5,
        note: '',
        date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
      fetchMoodLogs();
    } catch (error) {
      toast.error('Failed to log mood');
    }
  };

  const getDateNDaysAgo = (n) => {
    const date = new Date();
    date.setDate(date.getDate() - n);
    return date.toISOString().split('T')[0];
  };

  const moodData = {
    labels: moodLogs.slice(-7).map(log => log.date),
    datasets: [
      {
        label: 'Mood Score',
        data: moodLogs.slice(-7).map(log => log.mood),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const avgMood = moodLogs.length > 0
    ? moodLogs.reduce((sum, log) => sum + (log.mood || 5), 0) / moodLogs.length
    : 5;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold gradient-text flex items-center">
            <span className="mr-3">😊</span>
            {t('mood')}
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Log Mood'}
          </button>
        </div>

        {/* Stats */}
        <div className="glass-card p-6 bg-gradient-to-br from-green-400 to-emerald-400 text-white text-center">
          <p className="text-white/80 mb-2">Average Mood</p>
          <p className="text-5xl font-bold mb-2">
            {moods.find(m => m.value === Math.round(avgMood))?.emoji || '😊'}
          </p>
          <p className="text-2xl">{avgMood.toFixed(1)}/7</p>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h2 className="text-2xl font-bold mb-4">How are you feeling?</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-4">
                  Select your mood
                </label>
                <div className="flex justify-center space-x-4">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood: mood.value })}
                      className={`text-5xl transition-all transform hover:scale-125 ${
                        formData.mood === mood.value
                          ? 'scale-125 ring-4 ring-health-green rounded-full'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      {mood.emoji}
                    </button>
                  ))}
                </div>
                <p className="text-center mt-2 text-gray-600">
                  {moods.find(m => m.value === formData.mood)?.label}
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Note (optional)
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-health-green"
                  rows="3"
                  placeholder="How are you feeling today?"
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

              <button type="submit" className="btn-primary w-full">
                Log Mood
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
          <h2 className="text-xl font-bold mb-4">Mood Trend</h2>
          <Line data={moodData} options={{ responsive: true }} />
        </motion.div>

        {/* Mood Logs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Recent Mood Logs</h2>
          <div className="space-y-3">
            {moodLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No mood logs yet</p>
            ) : (
              moodLogs.slice(0, 10).map((log) => (
                <div
                  key={log._id || log.id}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-xl"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">
                      {moods.find(m => m.value === log.mood)?.emoji || '😊'}
                    </span>
                    <div>
                      <h3 className="font-bold text-lg">{log.date}</h3>
                      {log.note && (
                        <p className="text-gray-600">{log.note}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-400">
                    {log.mood}/7
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
