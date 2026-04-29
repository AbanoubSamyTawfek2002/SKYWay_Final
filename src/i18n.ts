import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "welcome": "Fly Higher with SkyWay",
      "search_flights": "Search Flights",
      "search_hotels": "Search Hotels",
      "from": "From",
      "to": "To",
      "date": "Date",
      "passengers": "Passengers",
      "search": "Search",
      "login": "Login",
      "register": "Register",
      "logout": "Logout",
      "my_bookings": "My Bookings",
      "admin_dashboard": "Admin Dashboard",
      "language": "Language",
      "hotel_booking": "Hotel Booking",
      "flight_booking": "Flight Booking",
      "price": "Price",
      "book_now": "Book Now",
      "total": "Total",
      "confirm_booking": "Confirm Booking",
      "payment": "Payment",
      "pay_securely": "Pay Securely with Stripe",
      "chat_placeholder": "Ask our AI concierge...",
      "home": "Home",
      "journal": "Journal",
      "flights": "Flights",
      "hotels": "Hotels"
    }
  },
  ar: {
    translation: {
      "welcome": "حلق عالياً مع سكاي واي",
      "search_flights": "البحث عن رحلات",
      "search_hotels": "البحث عن فنادق",
      "from": "من",
      "to": "إلى",
      "date": "التاريخ",
      "passengers": "المسافرون",
      "search": "بحث",
      "login": "تسجيل الدخول",
      "register": "إنشاء حساب",
      "logout": "تسجيل الخروج",
      "my_bookings": "حجوزاتي",
      "admin_dashboard": "لوحة التحكم",
      "language": "اللغة",
      "hotel_booking": "حجز فندق",
      "flight_booking": "حجز رحلة",
      "price": "السعر",
      "book_now": "احجز الآن",
      "total": "المجموع",
      "confirm_booking": "تأكيد الحجز",
      "payment": "الدفع",
      "pay_securely": "ادفع بأمان عبر سترايب",
      "email": "البريد الإلكتروني",
      "password": "كلمة المرور",
      "chat_placeholder": "اسأل مساعدنا الذكي...",
      "home": "الرئيسية",
      "journal": "المجلة",
      "flights": "الرحلات",
      "hotels": "الفنادق"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
