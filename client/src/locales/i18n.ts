import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enCompleted from "./en/completed.json";
import enDashboard from "./en/dashboard.json";
import enHeader from "./en/header.json";
import enLogin from "./en/login.json";
import enMobile from "./en/mobile.json";
import enNotFound from "./en/not-found.json";
import enSidebar from "./en/sidebar.json";
import enTaskCard from "./en/task-card.json";
import enUpcoming from "./en/upcoming.json";
import ptCompleted from "./pt/completed.json";
import ptDashboard from "./pt/dashboard.json";
import ptHeader from "./pt/header.json";
import ptLogin from "./pt/login.json";
import ptMobile from "./pt/mobile.json";
import ptNotFound from "./pt/not-found.json";
import ptSidebar from "./pt/sidebar.json";
import ptTaskCard from "./pt/task-card.json";
import ptUpcoming from "./pt/upcoming.json";


const resources = {
  pt: {
    header: ptHeader,
    mobile: ptMobile,
    sidebar: ptSidebar,
    task_card: ptTaskCard,
    dashboard: ptDashboard,
    completed: ptCompleted,
    not_found: ptNotFound,
    upcoming: ptUpcoming,
    login: ptLogin,
  },
  en: {
    header: enHeader,
    mobile: enMobile,
    sidebar: enSidebar,
    task_card: enTaskCard,
    dashboard:enDashboard,
    completed:enCompleted,
    not_found: enNotFound,
    upcoming: enUpcoming,
    login: enLogin,
  }
};


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
