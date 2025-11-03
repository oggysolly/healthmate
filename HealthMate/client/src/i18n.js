import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to HealthMate',
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      dashboard: 'Dashboard',
      medication: 'Medication',
      sleep: 'Sleep',
      mood: 'Mood',
      alerts: 'Alerts',
      recommendations: 'Recommendations',
      achievements: 'Achievements',
      'time-to-medicine': 'Time to take your medicine 💊',
      'drink-water': 'Drink some water 💧',
      'take-rest': 'Take a short rest 💤',
    },
  },
  es: {
    translation: {
      welcome: 'Bienvenido a HealthMate',
      login: 'Iniciar sesión',
      register: 'Registrarse',
      email: 'Correo electrónico',
      password: 'Contraseña',
      name: 'Nombre',
      dashboard: 'Panel',
      medication: 'Medicación',
      sleep: 'Sueño',
      mood: 'Estado de ánimo',
      alerts: 'Alertas',
      recommendations: 'Recomendaciones',
      achievements: 'Logros',
      'time-to-medicine': 'Hora de tomar tu medicina 💊',
      'drink-water': 'Bebe un poco de agua 💧',
      'take-rest': 'Tómate un descanso corto 💤',
    },
  },
  fr: {
    translation: {
      welcome: 'Bienvenue sur HealthMate',
      login: 'Connexion',
      register: "S'inscrire",
      email: 'E-mail',
      password: 'Mot de passe',
      name: 'Nom',
      dashboard: 'Tableau de bord',
      medication: 'Médicament',
      sleep: 'Sommeil',
      mood: 'Humeur',
      alerts: 'Alertes',
      recommendations: 'Recommandations',
      achievements: 'Réalisations',
      'time-to-medicine': "Il est temps de prendre votre médicament 💊",
      'drink-water': 'Buvez de l\'eau 💧',
      'take-rest': 'Prenez un court repos 💤',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
