import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { FlightSearchProvider } from "./contexts/FlightSearchContext";
import { Toaster } from "sonner";
import "./i18n";

// Components
import { Navbar } from "./components/Navbar";
import { ChatWidget } from "./components/ChatWidget";

// Pages
import Home from "./pages/Home";
import FlightSearch from "./pages/FlightSearch";
import HotelSearch from "./pages/HotelSearch";
import CarSearch from "./pages/CarSearch";
import JournalList from "./pages/JournalList";
import JournalDetails from "./pages/JournalDetails";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyResetOTP from "./pages/VerifyResetOTP";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import BookingDetails from "./pages/BookingDetails";
import TicketDetails from "./pages/TicketDetails";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import AboutUs from "./pages/AboutUs";
import HelpCenter from "./pages/HelpCenter";
import Safety from "./pages/Safety";
import Terms from "./pages/Terms";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import DestinationDetails from "./pages/DestinationDetails";
import Destinations from "./pages/Destinations";
import BlogList from "./pages/BlogList";
import BlogDetails from "./pages/BlogDetails";
import HotelDetails from "./pages/HotelDetails";
import FlightDetails from "./pages/FlightDetails";
import Wishlist from "./pages/Wishlist";
import { Link } from "react-router-dom";

const ProtectedRoute = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">
            Verifying Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return <>{children}</>;
};

const LoadingPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
        <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
      <div className="space-y-1 text-center">
        <h2 className="font-black text-2xl uppercase tracking-tighter italic">
          SkyWay
        </h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground italic">
          Preparing Flight Plan...
        </p>
      </div>
    </div>
  </div>
);

function AppRoutes() {
  const { i18n } = React.useMemo(
    () => ({ i18n: window.location.pathname }),
    [],
  );

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Toaster position="top-right" richColors />
      <Navbar />
      <main>
        <React.Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<FlightSearch />} />
            <Route path="/cars" element={<CarSearch />} />
            <Route path="/hotels" element={<HotelSearch />} />
            <Route path="/journals" element={<JournalList />} />
            <Route path="/journals/:id" element={<JournalDetails />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            <Route path="/flights/:id" element={<FlightDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/booking/:type/:id"
              element={
                <ProtectedRoute>
                  <BookingDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/:bookingId"
              element={
                <ProtectedRoute>
                  <TicketDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout/:type/:id"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route
              path="/payment-success"
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/about" element={<AboutUs />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route
              path="/destinations/:city"
              element={<DestinationDetails />}
            />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogDetails />} />
          </Routes>
        </React.Suspense>
      </main>
      <ChatWidget />

      <footer className="bg-muted/30 py-24 border-t border-border mt-20 px-4 sm:px-6 md:px-10">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <h3 className="font-black text-3xl mb-6 tracking-tighter uppercase italic">
              SkyWay Travel
            </h3>
            <p className="text-muted-foreground max-w-sm italic leading-relaxed text-sm sm:text-base">
              Redefining global exploration with premium booking experiences and
              intelligent travel assistance. Your gateway to the extraordinary.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {["FB", "TW", "IG", "LI"].map((s) => (
                <div
                  key={s}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-xs font-black hover:bg-primary hover:text-white transition-all cursor-pointer"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="font-black mb-8 uppercase text-xs tracking-[0.2em] text-primary italic">
              Resources
            </h4>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-widest italic">
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-primary transition-colors"
                >
                  Travel Journal
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="hover:text-primary transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/press"
                  className="hover:text-primary transition-colors"
                >
                  Press Room
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col">
            <h4 className="font-black mb-8 uppercase text-xs tracking-[0.2em] text-primary italic">
              Concierge
            </h4>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-widest italic">
              <li>
                <Link
                  to="/help"
                  className="hover:text-primary transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/safety"
                  className="hover:text-primary transition-colors"
                >
                  Safety & Shield
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-20 py-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground italic text-center md:text-left">
            © © 2026 SkyWay Travel Fleet. All rights reserved. | Designed &
            Developed by Abanoub Samy .
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">
            <Link to="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link to="/cookies" className="hover:text-primary">
              Cookies
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CurrencyProvider>
          <AuthProvider>
            <WishlistProvider>
              <FlightSearchProvider>
                <AppRoutes />
              </FlightSearchProvider>
            </WishlistProvider>
          </AuthProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
