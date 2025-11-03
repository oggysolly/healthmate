import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Medication() {
  const { t } = useTranslation();
  const [medications, setMedications] = useState([]);
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    time: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const response = await api.get('/health/medication?startDate=' + getDateNDaysAgo(7));
      setMedications(response.data);
    } catch (error) {
      toast.error('Failed to fetch medications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/health/medication', formData);
      toast.success('Medication logged successfully!');
      setFormData({
        medicationName: '',
        dosage: '',
        time: '',
        date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
      fetchMedications();
    } catch (error) {
      toast.error('Failed to log medication');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/health/medication/${id}`, { status });
      toast.success('Medication status updated!');
      fetchMedications();
    } catch (error) {
      toast.error('Failed to update medication');
    }
  };

  const getDateNDaysAgo = (n) => {
    const date = new Date();
    date.setDate(date.getDate() - n);
    return date.toISOString().split('T')[0];
  };

  const adherenceData = {
    labels: ['Taken', 'Missed', 'Pending'],
    datasets: [
      {
        data: [
          medications.filter(m => m.status === 'taken').length,
          medications.filter(m => m.status === 'missed').length,
          medications.filter(m => m.status === 'pending').length,
        ],
        backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'],
      },
    ],
  };

  const dailyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Medications Taken',
        data: [2, 3, 2, 4, 3, 3, 2],
        backgroundColor: '#3b82f6',
      },
    ],
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold gradient-text flex items-center">
            <span className="mr-3">💊</span>
            {t('medication')}
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add Medication'}
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h2 className="text-2xl font-bold mb-4">Log New Medication</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Medication Name
                  </label>
                  <input
                    type="text"
                    value={formData.medicationName}
                    onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-health-green"
                    placeholder="Aspirin"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-health-green"
                    placeholder="100mg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
                Log Medication
              </button>
            </form>
          </motion.div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold mb-4">Adherence Rate</h2>
            <Doughnut data={adherenceData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold mb-4">Weekly Overview</h2>
            <Bar data={dailyData} />
          </motion.div>
        </div>

        {/* Medication List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Recent Medications</h2>
          <div className="space-y-3">
            {medications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No medications logged yet</p>
            ) : (
              medications.map((med) => (
                <div
                  key={med._id || med.id}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-xl"
                >
                  <div>
                    <h3 className="font-bold text-lg">{med.medicationName}</h3>
                    <p className="text-gray-600">
                      {med.dosage} • {med.time} • {med.date}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(med._id || med.id, 'taken')}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        med.status === 'taken'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white'
                      } transition-all`}
                    >
                      Taken
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(med._id || med.id, 'missed')}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        med.status === 'missed'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white'
                      } transition-all`}
                    >
                      Missed
                    </button>
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
