import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plane,
  Hotel,
  Calendar,
  MapPin,
  CheckCircle2,
  User,
  Heart,
  Settings,
  XCircle,
  Car,
  LogOut,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCurrency } from "../contexts/CurrencyContext";

export default function UserDashboard() {
  const { t } = useTranslation();
  const { user, token, logout, login } = useAuth();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState("bookings");

  // Bookings State
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Profile State
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
    address: user?.address || "",
    profileImage: user?.profileImage || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (activeTab === "bookings") fetchBookings();
    if (activeTab === "profile") fetchProfile();
  }, [activeTab, token]);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setProfileData({
          name: data.user.name || "",
          phone: data.user.phone || "",
          dob: data.user.dob
            ? new Date(data.user.dob).toISOString().split("T")[0]
            : "",
          address: data.user.address || "",
          profileImage: data.user.profileImage || "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}/cancel`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        toast.success("Booking cancelled successfully");
        fetchBookings();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to cancel booking");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success("Profile updated successfully");
        login(data.user, token!); // Update context
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <Card className="border-none shadow-sm bg-muted/30">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex flex-col items-center mb-8 mt-4">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden mb-4 border-2 border-primary/20">
                  {profileData.profileImage ? (
                    <img
                      src={profileData.profileImage}
                      alt={user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={40} className="text-primary" />
                  )}
                </div>
                <h3 className="font-bold text-lg text-center">{user?.name}</h3>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                {!user?.isVerified && (
                  <Badge variant="destructive" className="mt-2 text-[10px]">
                    Unverified
                  </Badge>
                )}
              </div>

              <div className="space-y-1">
                <Button
                  variant={activeTab === "bookings" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab !== "bookings" ? "text-muted-foreground hover:bg-muted/50" : ""}`}
                  onClick={() => setActiveTab("bookings")}
                >
                  <Calendar className="mr-2 h-4 w-4" /> My Bookings
                </Button>
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab !== "profile" ? "text-muted-foreground hover:bg-muted/50" : ""}`}
                  onClick={() => setActiveTab("profile")}
                >
                  <Settings className="mr-2 h-4 w-4" /> Edit Profile
                </Button>

                <div className="pt-4 mt-4 border-t border-border/50">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === "bookings" && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                  <Calendar className="text-primary" /> My Trips
                </h2>

                {loadingBookings ? (
                  <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : bookings.length === 0 ? (
                  <Card className="p-12 text-center text-muted-foreground bg-muted/20 border-dashed">
                    <Plane size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-bold mb-2">
                      No trips found yet.
                    </p>
                    <p>Start exploring and book your first adventure today!</p>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {bookings.map((booking) => (
                      <Card
                        key={booking._id}
                        className={`overflow-hidden border-l-4 ${booking.status === "cancelled" ? "border-l-destructive opacity-75" : "border-l-primary"}`}
                      >
                        <CardContent className="p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
                          <div className="flex items-center gap-6 flex-1 w-full">
                            <div
                              className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${booking.status === "cancelled" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}
                            >
                              {booking.type === "flight" ? (
                                <Plane size={32} />
                              ) : booking.type === "car" ? (
                                <Car size={32} />
                              ) : (
                                <Hotel size={32} />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  variant="secondary"
                                  className="uppercase text-[10px] tracking-widest"
                                >
                                  {booking.type}
                                </Badge>
                                <span className="text-muted-foreground text-xs">
                                  {new Date(
                                    booking.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <CardTitle className="text-xl capitalize">
                                {booking.type === "flight"
                                  ? `${booking.flightId?.departureCity || "Unknown"} → ${booking.flightId?.arrivalCity || "Unknown"}`
                                  : booking.type === "car"
                                    ? `${booking.carId?.brand || "Car"} ${booking.carId?.model || "Rental"}`
                                    : booking.hotelId?.name || "Hotel Stay"}
                              </CardTitle>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                <div className="flex items-center gap-1">
                                  <MapPin size={14} />
                                  {booking.type === "hotel"
                                    ? booking.hotelId?.city || "Location"
                                    : booking.type === "car"
                                      ? booking.carId?.city || "Location"
                                      : booking.flightId?.airline || "Airline"}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {booking.type === "flight"
                                    ? booking.flightId?.departureTime
                                      ? new Date(
                                          booking.flightId.departureTime,
                                        ).toLocaleDateString()
                                      : ""
                                    : "Flexible Dates"}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col lg:items-end w-full lg:w-auto gap-3 border-t lg:border-t-0 pt-4 lg:pt-0">
                            <div className="lg:text-right flex justify-between lg:block">
                              <p className="text-xs font-bold uppercase text-muted-foreground mb-1">
                                Total Paid
                              </p>
                              <p className="text-2xl font-black">
                                {formatPrice(booking.totalAmount)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 justify-between lg:justify-end">
                              {booking.status === "cancelled" ? (
                                <Badge
                                  variant="destructive"
                                  className="px-3 py-1 gap-1"
                                >
                                  <XCircle size={12} /> CANCELLED
                                </Badge>
                              ) : (
                                <>
                                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 px-3 py-1 gap-1">
                                    <CheckCircle2 size={12} /> CONFIRMED
                                  </Badge>
                                  <Link to={`/booking/${booking._id}`}>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="font-bold"
                                    >
                                      View Ticket
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive border-destructive/30 hover:bg-destructive hover:text-white"
                                    onClick={() =>
                                      handleCancelBooking(booking._id)
                                    }
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                  <Settings className="text-primary" /> Profile Settings
                </h2>

                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details below.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <Input
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone Number</Label>
                          <Input
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                phone: e.target.value,
                              })
                            }
                            placeholder="+1 234 567 890"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date of Birth</Label>
                          <Input
                            type="date"
                            value={profileData.dob}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                dob: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Profile Image URL</Label>
                          <Input
                            type="url"
                            value={profileData.profileImage}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                profileImage: e.target.value,
                              })
                            }
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Address</Label>
                          <Input
                            value={profileData.address}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                address: e.target.value,
                              })
                            }
                            placeholder="123 Main St, City, Country"
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="mt-4"
                        disabled={savingProfile}
                      >
                        {savingProfile ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
