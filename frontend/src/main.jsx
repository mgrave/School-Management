import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import store from "./store/store.js";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { I18nextProvider } from 'react-i18next';

// Configuración de idiomas
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import idTranslations from './locales/id.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      id: { translation: idTranslations }
    },
    supportedLngs: ['es', 'en', 'id'],
    fallbackLng: 'es',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    },
    defaultNS: 'translation'
  });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <App />
        <Toaster position="top-center" richColors closeButton={true} />
      </Provider>
    </I18nextProvider>
  </React.StrictMode>
);
