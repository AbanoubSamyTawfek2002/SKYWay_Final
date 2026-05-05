import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Star,
  Wifi,
  Droplets,
  Dumbbell,
  Coffee,
  Utensils,
  Sparkles,
  User,
  Calendar,
  MessageSquare,
  Send,
  ShieldCheck,
  Plane,
  GlassWater,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { WishlistButton } from "../components/WishlistButton";
import { SafeImage } from "../components/SafeImage";
import { ReviewSection } from "../components/ReviewSection";
import { calculateHotelPrice } from "../lib/hotelPricing";

const amenityIcons: Record<string, any> = {
  WiFi: Wifi,
  Pool: Droplets,
  Gym: Dumbbell,
  Spa: Sparkles,
  "Butler Service": User,
  "Fine Dining": Utensils,
  Coffee: Coffee,
  "Luxury Spa": Sparkles,
  Helipad: Plane,
  "Wine Cellar": GlassWater,
  "Personal Butler": User,
  "Private Beach": Droplets,
};

export default function HotelDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { formatPrice } = useCurrency();

  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const roomsParamsStr = searchParams.get("rooms");
  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");

  const [rooms, setRooms] = useState<any[]>([]);
  const [checkIn, setCheckIn] = useState<string | null>(checkInParam);
  const [checkOut, setCheckOut] = useState<string | null>(checkOutParam);

  useEffect(() => {
    // 1. Initial values from URL if they exist
    if (roomsParamsStr) {
      try {
        setRooms(JSON.parse(roomsParamsStr));
      } catch (e) {}
    }

    // 2. Fill missing values from sessionStorage
    const saved = sessionStorage.getItem("hotelSearch");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!roomsParamsStr && parsed.rooms) setRooms(parsed.rooms);
        if (!checkInParam && parsed.checkIn) setCheckIn(parsed.checkIn);
        if (!checkOutParam && parsed.checkOut) setCheckOut(parsed.checkOut);
      } catch (e) {}
    }

    // 3. Last fallback for rooms if still empty
    setRooms((prev) => (prev.length > 0 ? prev : [{ adults: 1, children: 0 }]));
  }, [roomsParamsStr, checkInParam, checkOutParam]);

  let numberOfNights = 1;
  if (checkIn && checkOut) {
    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    if (!isNaN(ci.getTime()) && !isNaN(co.getTime())) {
      const diffTime = Math.abs(co.getTime() - ci.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) numberOfNights = diffDays;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryStr = roomsParamsStr
          ? `?rooms=${encodeURIComponent(roomsParamsStr)}`
          : "";
        const hotelRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/hotels/${id}${queryStr}`,
        ).then((res) => res.json());
        setHotel(hotelRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, roomsParamsStr]);

  const pricing = useMemo(() => {
    if (!hotel)
      return {
        totalPerNight: 0,
        subtotal: 0,
        tax: 0,
        grandTotal: 0,
        breakdown: {},
      };
    return calculateHotelPrice({
      basePrice: hotel.pricePerNight,
      nights: numberOfNights,
      rooms: rooms,
      category: hotel.category?.toLowerCase() || "standard",
    });
  }, [hotel, numberOfNights, rooms]);

  if (loading || !hotel)
    return (
      <div className="container mx-auto p-20 text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-black italic uppercase tracking-widest text-xs animate-pulse">
          Designing your exclusive retreat...
        </p>
      </div>
    );

  const images = hotel.images || [];

  const navigateToCheckout = () => {
    if (rooms.length === 0) {
      alert("Please configure your room setup before proceeding.");
      return;
    }

    // Attempt to map requested rooms to actual hotel rooms dynamically
    const selectedRoomsForCheckout = [];
    const availableRooms = [...hotel.rooms].filter(
      (r) => r.inventory && r.inventory.availableRooms > 0,
    );
    const bookedRoomIds = new Map();

    for (const reqRoom of rooms) {
      const matchingType = availableRooms.find((rt: any) => {
        const used = bookedRoomIds.get(rt._id.toString()) || 0;
        return (
          rt.capacity &&
          rt.capacity.maxAdults >= (reqRoom.adults || 1) &&
          rt.capacity.maxChildren >= (reqRoom.children || 0) &&
          rt.inventory.availableRooms > used
        );
      });
      if (!matchingType) {
        alert("The requested room configuration exceeds the hotel's capacity.");
        return;
      }
      const used = bookedRoomIds.get(matchingType._id.toString()) || 0;
      bookedRoomIds.set(matchingType._id.toString(), used + 1);
      selectedRoomsForCheckout.push({
        roomTypeId: matchingType._id,
        adults: reqRoom.adults || 1,
        children: reqRoom.children || 0,
      });
    }

    const bookingData = {
      type: "hotel" as const,
      id: hotel._id,
      totalPrice: pricing.grandTotal,
      pricePerNight: pricing.totalPerNight,
      durationDays: numberOfNights,
      rooms: selectedRoomsForCheckout,
      item: hotel,
      checkIn,
      checkOut,
      totalAdults: rooms.reduce((s, r) => s + (r.adults || 0), 0),
      totalChildren: rooms.reduce((s, r) => s + (r.children || 0), 0),
    };

    sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));

    navigate(`/checkout/hotel/${hotel._id}`, {
      state: { bookingData },
    });
  };

  const updateRoomCount = (
    index: number,
    field: "adults" | "children",
    delta: number,
  ) => {
    const newRooms = [...rooms];
    const newValue = Math.max(
      field === "adults" ? 1 : 0,
      (newRooms[index][field] || 0) + delta,
    );
    newRooms[index][field] = newValue;
    setRooms(newRooms);
  };

  const addRoom = () => setRooms([...rooms, { adults: 1, children: 0 }]);
  const removeRoom = (index: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16">
        {/* LEFT COLUMN: Gallery, Details, Reviews */}
        <div className="lg:col-span-8 space-y-12 sm:space-y-16">
          {/* Gallery component */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-4 h-auto md:h-[500px]">
            <div className="md:col-span-3 relative overflow-hidden rounded-[24px] shadow-xl group min-h-[300px]">
              <SafeImage
                src={images[0]}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="flex md:flex-col gap-4 sm:gap-4 col-span-1 md:col-span-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
              {images.slice(1, 4).map((img: string, i: number) => (
                <div
                  key={i}
                  className="flex-none w-32 md:w-full h-32 md:flex-1 rounded-[16px] overflow-hidden shadow-md group relative"
                >
                  <SafeImage
                    src={img || images[0]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {i === 2 && images.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-black text-xl italic tracking-tighter backdrop-blur-sm cursor-pointer hover:bg-black/40 transition-colors">
                      +{images.length - 4}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-4">
                <Badge className="bg-primary/10 text-primary font-black px-4 sm:px-6 py-2 rounded-full border-none uppercase tracking-widest text-[9px] sm:text-[10px] italic">
                  Prestige Platinum
                </Badge>
                <div className="flex items-center gap-2 text-primary font-black text-xl sm:text-2xl italic leading-none">
                  <Star size={20} fill="currentColor" />
                  <span>{hotel.rating?.toFixed(1) || "0.0"}</span>
                  <span className="text-muted-foreground text-[10px] sm:text-xs font-black uppercase tracking-widest not-italic opacity-40 ml-2 sm:ml-4">
                    {hotel.reviewCount || 0} GLOBAL REVIEWS
                  </span>
                </div>
              </div>
              <WishlistButton
                itemType="hotel"
                itemId={id!}
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl border-2 shadow-xl hover:shadow-primary/20 transition-all self-end sm:self-auto"
              />
            </div>

            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[0.9] mb-4 sm:mb-6">
                {hotel.name}
              </h1>
              <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground text-lg sm:text-xl md:text-2xl font-black italic">
                <MapPin size={24} className="text-primary shrink-0" />
                <span className="opacity-80">
                  {hotel.address ? `${hotel.address}, ` : ""}
                  {hotel.city}, {hotel.country}
                </span>
              </div>
            </div>
          </div>

          <div className="prose prose-lg sm:prose-xl max-w-none dark:prose-invert italic text-muted-foreground/80 leading-relaxed font-medium">
            {hotel.description ||
              "A sanctuary of unparalleled luxury where every detail is meticulously crafted to produce an atmosphere of absolute distinction and comfort."}
          </div>

          <div className="pt-12 sm:pt-16 border-t border-border/50">
            <h3 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter mb-8 sm:mb-10">
              Curated Amenities
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {hotel.amenities?.map((amenity: string) => {
                const Icon = amenityIcons[amenity] || Sparkles;
                return (
                  <motion.div
                    key={amenity}
                    whileHover={{ y: -5, backgroundColor: "var(--primary-10)" }}
                    className="flex flex-col items-center gap-4 sm:gap-6 p-6 sm:p-8 bg-muted/20 rounded-[24px] sm:rounded-[32px] border border-border/50 transition-all group"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[16px] sm:rounded-[20px] bg-background flex items-center justify-center text-primary shadow-xl group-hover:scale-110 transition-transform">
                      <Icon size={24} className="sm:size-[28px]" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground text-center line-clamp-1">
                      {amenity}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Reviews Section */}
          <section className="pt-12 sm:pt-16 border-t border-border/50">
            <div className="mb-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-[9px] sm:text-[10px] mb-4 italic">
                Social Proof
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter">
                Guest Testimonials
              </h3>
            </div>
            <ReviewSection
              targetType="hotel"
              targetId={id!}
              onReviewAdded={(avg, count) =>
                setHotel((h: any) => ({
                  ...h,
                  rating: avg,
                  reviewCount: count,
                }))
              }
            />
          </section>
        </div>

        {/* RIGHT COLUMN: Sticky Booking Card */}
        <div className="lg:col-span-4">
          <Card className="rounded-[32px] sm:rounded-[48px] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_80px_-12px_rgba(0,0,0,0.5)] border border-border/30 sticky top-32 overflow-hidden bg-card">
            <CardContent className="p-6 sm:p-10 space-y-8 sm:space-y-10">
              <div className="flex flex-col gap-4 border-b border-border/30 pb-6">
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic opacity-60">
                      TOTAL RATE ({numberOfNights} NIGHT
                      {numberOfNights !== 1 ? "s" : ""})
                    </span>
                    <div className="flex flex-col gap-1 mt-2">
                      <div className="flex justify-between items-baseline">
                        <p className="text-3xl sm:text-4xl font-black italic tracking-tighter leading-none text-primary">
                          {formatPrice(pricing.totalPerNight)}
                        </p>
                        <span className="text-xs font-black uppercase tracking-widest opacity-40 italic">
                          / NIGHT
                        </span>
                      </div>

                      <div className="space-y-1 pt-4 border-t border-border/10">
                        <div className="flex justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          <span>Subtotal ({numberOfNights} nights)</span>
                          <span>{formatPrice(pricing.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          <span>Tax (15%)</span>
                          <span>{formatPrice(pricing.tax)}</span>
                        </div>
                        <div className="flex justify-between text-base font-black text-foreground uppercase tracking-tighter pt-2 italic">
                          <span>Total Investment</span>
                          <span className="text-primary">
                            {formatPrice(pricing.grandTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Selection */}
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black uppercase italic tracking-tighter">
                      Your Setup ({rooms.length} Rooms)
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-[10px] font-black uppercase tracking-widest"
                      onClick={addRoom}
                    >
                      <Plus size={14} className="mr-1" /> Add Room
                    </Button>
                  </div>

                  {rooms.map((room, idx) => {
                    const base = hotel.pricePerNight;
                    const extraAdultsCost = (room.adults - 1) * base * 0.25;
                    const childCost = room.children * base * 0.7;
                    const roomTotal = base + extraAdultsCost + childCost;

                    return (
                      <div
                        key={idx}
                        className="p-4 border border-primary/20 rounded-[20px] bg-primary/5 space-y-4 relative group"
                      >
                        <div className="flex justify-between items-center">
                          <h5 className="font-black text-[10px] uppercase italic tracking-widest text-primary">
                            Room {idx + 1}
                          </h5>
                          {rooms.length > 1 && (
                            <button
                              onClick={() => removeRoom(idx)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                          )}
                        </div>

                        <div className="flex gap-4">
                          <div className="flex-1 space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block text-center">
                              Adults
                            </span>
                            <div className="flex items-center justify-between bg-background rounded-xl p-1 border border-border/50 shadow-sm">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg"
                                onClick={() =>
                                  updateRoomCount(idx, "adults", -1)
                                }
                              >
                                <Minus size={12} />
                              </Button>
                              <span className="text-sm font-black">
                                {room.adults}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg"
                                onClick={() =>
                                  updateRoomCount(idx, "adults", 1)
                                }
                              >
                                <Plus size={12} />
                              </Button>
                            </div>
                          </div>

                          <div className="flex-1 space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block text-center">
                              Children
                            </span>
                            <div className="flex items-center justify-between bg-background rounded-xl p-1 border border-border/50 shadow-sm">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg"
                                onClick={() =>
                                  updateRoomCount(idx, "children", -1)
                                }
                              >
                                <Minus size={12} />
                              </Button>
                              <span className="text-sm font-black">
                                {room.children}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg"
                                onClick={() =>
                                  updateRoomCount(idx, "children", 1)
                                }
                              >
                                <Plus size={12} />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-primary/10 space-y-1">
                          <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            <span>Base (1 Adult)</span>
                            <span>{formatPrice(base)}</span>
                          </div>
                          {room.adults > 1 && (
                            <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-muted-foreground/60">
                              <span>{room.adults - 1} Extra Adults (+25%)</span>
                              <span>+{formatPrice(extraAdultsCost)}</span>
                            </div>
                          )}
                          {room.children > 0 && (
                            <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-muted-foreground/60">
                              <span>{room.children} Children (+70%)</span>
                              <span>+{formatPrice(childCost)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-primary pt-1">
                            <span>Room Subtotal</span>
                            <span>{formatPrice(roomTotal)}/night</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-[10px] font-black uppercase tracking-widest rounded-full h-10"
                      onClick={() => navigate("/")}
                    >
                      Return to Search
                    </Button>
                  </div>
                </div>

                <h4 className="font-black uppercase italic tracking-tighter mt-6">
                  Property Room Types
                </h4>
                <div className="space-y-3">
                  {hotel.rooms?.map((roomType: any) => (
                    <div
                      key={roomType._id}
                      className="p-3 border border-border/50 rounded-[16px] bg-muted/10 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-black text-sm uppercase italic">
                            {roomType.name}
                          </h5>
                          <p className="text-[10px] text-muted-foreground">
                            Max {roomType.capacity.maxTotalGuests} Guests (
                            {roomType.capacity.maxAdults} Adults)
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-primary">
                        {formatPrice(roomType.pricing.pricePerNight)} Base
                      </p>
                    </div>
                  ))}
                  {(!hotel.rooms || hotel.rooms.length === 0) && (
                    <p className="text-sm italic text-muted-foreground">
                      Loading inventory...
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full h-14 sm:h-16 rounded-[20px] sm:rounded-[24px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-sm sm:text-base shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-95"
                  onClick={navigateToCheckout}
                >
                  Secure Reservation
                </Button>
                <div className="flex items-center justify-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic">
                  <ShieldCheck size={14} className="text-primary" /> Transparent
                  Pricing, No Hidden Fees
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
