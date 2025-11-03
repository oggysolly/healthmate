import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/dashboard', icon: '📊', label: 'dashboard' },
  { path: '/medication', icon: '💊', label: 'medication' },
  { path: '/sleep', icon: '😴', label: 'sleep' },
  { path: '/mood', icon: '😊', label: 'mood' },
  { path: '/profile', icon: '👤', label: 'profile' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-card sticky top-0 z-50 mx-4 mt-4 mb-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className="text-3xl">⚕️</span>
              <span className="text-2xl font-bold gradient-text">HealthMate</span>
            </Link>

            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="flex space-x-2">
                {['en', 'es', 'fr'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      i18n.language === lang
                        ? 'bg-health-green text-white'
                        : 'bg-white/50 text-gray-600 hover:bg-white/80'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{user?.name}</span>
                <button
                  onClick={logout}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex justify-center space-x-4 mt-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-health-green to-health-blue text-white shadow-lg'
                      : 'bg-white/50 text-gray-600 hover:bg-white/80'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{t(item.label)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
