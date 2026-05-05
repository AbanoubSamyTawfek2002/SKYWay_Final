import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Star,
  Hotel as HotelIcon,
  ChevronDown,
  List,
  Map as MapIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { useCurrency } from "../contexts/CurrencyContext";
import { SafeImage } from "../components/SafeImage";
import { SkeletonHotelCard } from "../components/SkeletonLoaders";
import { WishlistButton } from "../components/WishlistButton";
import { CategorySlider } from "../components/CategorySlider";
import { HotelsMap } from "../components/HotelsMap";
import { calculateHotelPrice } from "../lib/hotelPricing";

const categories = [
  "All",
  "Egypt",
  "Dubai",
  "London",
  "Paris",
  "New York",
  "Tokyo",
  "Japan",
  "UAE",
  "Singapore",
  "Italy",
  "France",
];

export default function HotelSearch() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  // Interactive Map State
  const [activeHotelId, setActiveHotelId] = useState<string | null>(null);

  useEffect(() => {
    const country = searchParams.get("country");
    const city = searchParams.get("city");
    setActiveCategory(country || city || "All");
  }, [searchParams]);

  // Derived Pricing Params
  const searchPricingConfig = useMemo(() => {
    let nights = 1;
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    if (checkIn && checkOut) {
      nights = Math.max(
        1,
        Math.ceil(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            (1000 * 3600 * 24),
        ),
      );
    }
    let rooms: any[] = [];
    const roomsStr = searchParams.get("rooms");
    if (roomsStr) {
      try {
        rooms = JSON.parse(roomsStr);
      } catch (e) {}
    }
    const guests =
      rooms.reduce((acc, r) => acc + (r.adults || 1) + (r.children || 0), 0) ||
      1;
    return { nights, rooms, guests };
  }, [searchParams]);

  const fetchHotels = useCallback(
    async (isLoadMore = false) => {
      const page = isLoadMore ? (pagination?.page || 1) + 1 : 1;
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      params.set("limit", "12");

      if (!isLoadMore) setLoading(true);
      else setLoadingMore(true);

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/hotels?${params.toString()}`,
        );
        if (!res.ok) throw new Error("Failed to fetch hotels");
        const result = await res.json();

        if (isLoadMore) {
          setHotels((prev) => [...prev, ...(result.data || [])]);
        } else {
          setHotels(result.data || []);
        }
        setPagination(result.pagination);
      } catch (err) {
        console.error("Error fetching hotels:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchParams, pagination?.page],
  );

  useEffect(() => {
    fetchHotels();
  }, [searchParams]);

  const handleCategorySelect = (val: string) => {
    setActiveCategory(val);
    const newParams = new URLSearchParams(searchParams);
    if (val === "All") {
      newParams.delete("country");
      newParams.delete("city");
    } else {
      const countries = [
        "Egypt",
        "UAE",
        "France",
        "UK",
        "USA",
        "Japan",
        "Italy",
        "Singapore",
      ];
      if (countries.includes(val)) {
        newParams.set("country", val);
        newParams.delete("city");
      } else {
        newParams.set("city", val);
        newParams.delete("country");
      }
    }
    setSearchParams(newParams);
  };

  const scrollToHotel = (hotelId: string) => {
    setActiveHotelId(hotelId);

    // Smooth scroll to the map on mobile
    if (window.innerWidth < 1024) {
      const mapContainer = document.getElementById("hotel-map-section");
      if (mapContainer) {
        mapContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden lg:flex-row">
      {/* Top/Left Map Section */}
      <div
        id="hotel-map-section"
        className="w-full h-[300px] shrink-0 lg:h-full lg:w-[40%] xl:w-[35%] relative border-b lg:border-b-0 lg:border-r border-border bg-muted/10 z-10"
      >
        {loading && !hotels.length ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <HotelsMap
            hotels={hotels}
            activeHotelId={activeHotelId}
            onMarkerClick={(id) => {
              scrollToHotel(id);
            }}
            pricingConfig={searchPricingConfig}
          />
        )}
      </div>

      {/* Bottom/Right List Section */}
      <div className="w-full flex-1 lg:w-[60%] xl:w-[65%] overflow-y-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6 custom-scrollbar bg-background">
        <div className="mb-8">
          <span className="inline-block bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] mb-2 px-3 py-1 rounded-full italic">
            Find Your Stay
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none mb-4">
            Luxe Stays
          </h1>
          <p className="text-muted-foreground text-sm italic">
            Explore our curated selection of properties visually.
          </p>
        </div>

        <div className="mb-8 w-full overflow-hidden">
          <CategorySlider
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategorySelect}
          />
        </div>

        {loading ? (
          <div className="flex flex-col gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonHotelCard key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6">
              <AnimatePresence mode="popLayout">
                {hotels.map((hotel, i) => {
                  const { grandTotal: finalPrice } = calculateHotelPrice({
                    basePrice: hotel.pricePerNight,
                    nights: searchPricingConfig.nights,
                    rooms: searchPricingConfig.rooms,
                    category: hotel.category?.toLowerCase() || "standard",
                  });

                  return (
                    <motion.div
                      key={hotel._id || i}
                      id={`hotel-card-${hotel._id}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: (i % 6) * 0.05 }}
                      onClick={() => setActiveHotelId(hotel._id)}
                      className="group"
                    >
                      <Card
                        className={`relative flex flex-col sm:flex-row border border-border/50 bg-card overflow-hidden rounded-[20px] shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer ${activeHotelId === hotel._id ? "ring-2 ring-primary border-primary" : ""}`}
                      >
                        <div className="relative w-full sm:w-[220px] h-[200px] shrink-0 overflow-hidden">
                          <SafeImage
                            src={
                              hotel.images?.[0] ||
                              `https://source.unsplash.com/featured/?hotel,${hotel.city.toLowerCase()}`
                            }
                            alt={hotel.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute top-2 left-2 z-10 transition-transform duration-300 group-hover:scale-105">
                            <div className="bg-[rgba(0,0,0,0.05)] text-[#111] dark:bg-[rgba(255,255,255,0.08)] dark:border-[rgba(255,255,255,0.15)] dark:text-[#FFFFFF] backdrop-blur-[6px] border border-transparent dark:border-solid px-[12px] py-[6px] rounded-[10px] text-xs font-black uppercase tracking-tighter italic [text-shadow:0_2px_10px_rgba(255,255,255,0.8)] dark:[text-shadow:0_2px_10px_rgba(0,0,0,0.8)] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-end gap-1">
                              <span>{formatPrice(finalPrice)}</span>
                              <span className="text-[8px] font-bold opacity-80 mb-0.5">
                                / {searchPricingConfig.nights} NIGHT
                                {searchPricingConfig.nights !== 1 ? "S" : ""}
                              </span>
                            </div>
                          </div>
                          <div
                            className="absolute top-2 right-2 z-10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <WishlistButton
                              itemType="hotel"
                              itemId={hotel._id}
                              className="h-8 w-8 bg-black/20 backdrop-blur border-none text-white hover:bg-black/40 scale-75"
                            />
                          </div>
                        </div>

                        <CardContent className="p-4 sm:p-5 flex flex-col flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <div className="min-w-0">
                              <h3
                                className="font-black text-lg tracking-tight uppercase italic leading-none mb-1.5 truncate group-hover:text-primary transition-colors cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/hotels/${hotel._id}`);
                                }}
                              >
                                {hotel.name}
                              </h3>
                              <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                                <MapPin
                                  size={10}
                                  className="text-primary shrink-0"
                                />
                                <span className="truncate italic">
                                  {hotel.city}, {hotel.country}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">
                              <Star size={12} fill="currentColor" />
                              <span className="font-black text-xs italic">
                                {hotel.rating?.toFixed(1)}
                              </span>
                            </div>
                          </div>

                          <p className="text-muted-foreground text-[11px] italic leading-relaxed line-clamp-2 mt-2">
                            {hotel.description}
                          </p>

                          <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 flex-1 rounded-lg font-black uppercase tracking-widest text-[9px] transition-all hover:bg-primary/5 italic"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/hotels/${hotel._id}?rooms=${searchParams.get("rooms") || ""}&checkIn=${searchParams.get("checkIn") || ""}&checkOut=${searchParams.get("checkOut") || ""}`,
                                );
                              }}
                            >
                              Details
                            </Button>
                            <Button
                              size="sm"
                              className="h-8 flex-1 rounded-lg font-black uppercase tracking-widest text-[9px] shadow-sm transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/checkout/hotel/${hotel._id}?rooms=${searchParams.get("rooms") || ""}&checkIn=${searchParams.get("checkIn") || ""}&checkOut=${searchParams.get("checkOut") || ""}`,
                                );
                              }}
                            >
                              Book
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {pagination && pagination.page < pagination.pages && (
              <div className="mt-12 flex justify-center">
                <Button
                  variant="outline"
                  disabled={loadingMore}
                  onClick={() => fetchHotels(true)}
                  className="rounded-full px-8 h-10 font-bold uppercase tracking-widest text-[10px]"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}

            {hotels.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center border border-dashed rounded-3xl mt-4">
                <HotelIcon
                  size={40}
                  className="text-muted-foreground/30 mb-4"
                />
                <h2 className="text-xl font-black uppercase italic mb-2">
                  No Stays Found
                </h2>
                <p className="text-muted-foreground italic text-xs mb-4">
                  Try adjusting your filters or destination.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full font-bold uppercase tracking-widest text-[9px]"
                  onClick={() => handleCategorySelect("All")}
                >
                  View All
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
