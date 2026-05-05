import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Plane,
  Clock,
  ShieldCheck,
  Calendar,
  Info,
  Star,
  MapPin,
  Wind,
  Zap,
  Briefcase,
  Coffee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { useCurrency } from "../contexts/CurrencyContext";
import { useFlightSearch } from "../contexts/FlightSearchContext";
import { calculateExactUserFormula } from "../lib/flightPricing";
import { WishlistButton } from "../components/WishlistButton";
import { SafeImage } from "../components/SafeImage";
import { ReviewSection } from "../components/ReviewSection";

export default function FlightDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { adults, children, infants, cabinClass, tripType } = useFlightSearch();

  const [flight, setFlight] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/flights/${id}`,
        ).then((res) => res.json());
        setFlight(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading || !flight)
    return (
      <div className="container mx-auto p-20 text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-black italic uppercase tracking-widest text-xs animate-pulse">
          Calculating optimal trajectory...
        </p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2 space-y-16">
          {/* Main Board */}
          <section className="space-y-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Badge className="bg-primary/10 text-primary font-black px-6 py-2 rounded-full border-none uppercase tracking-widest text-[10px] italic">
                  Global Network
                </Badge>
                <div className="flex items-center gap-2 text-primary font-black text-2xl italic leading-none">
                  <Star size={24} fill="currentColor" />
                  <span>{flight.rating?.toFixed(1) || "4.8"}</span>
                  <span className="text-muted-foreground text-xs font-black uppercase tracking-widest not-italic opacity-40 ml-4">
                    {flight.reviewCount} RECORDS
                  </span>
                </div>
              </div>
              <WishlistButton
                itemType="flight"
                itemId={id!}
                className="h-14 w-14 rounded-2xl border-2 shadow-xl hover:shadow-primary/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-10 p-12 bg-muted/20 rounded-[60px] border border-border/50 relative overflow-hidden">
              {/* Background Plane Icon */}
              <Plane className="absolute -right-20 -bottom-20 w-80 h-80 text-primary opacity-5 rotate-12 pointer-events-none" />

              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-4">
                  Departure
                </p>
                <h2 className="text-7xl font-black tracking-tighter italic leading-none mb-4">
                  {new Date(flight.departureTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </h2>
                <div className="space-y-1">
                  <p className="text-3xl font-black uppercase tracking-tight">
                    {flight.departureAirport}
                  </p>
                  <p className="text-primary font-black uppercase text-xs italic tracking-widest">
                    {flight.departureCity}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 px-6 py-2 bg-background rounded-full border shadow-sm">
                  <Clock size={16} className="text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest">
                    {flight.duration}
                  </span>
                </div>
                <div className="w-full relative py-2">
                  <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <div className="relative bg-background border-2 border-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-xl group hover:rotate-12 transition-transform">
                    <Plane size={20} className="text-primary rotate-90" />
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="rounded-full px-6 py-1 font-black text-[10px] uppercase tracking-[0.2em]"
                >
                  {flight.stops === 0
                    ? "Direct Route"
                    : `${flight.stops} Stopover`}
                </Badge>
              </div>

              <div className="text-center md:text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-4">
                  Arrival
                </p>
                <h2 className="text-7xl font-black tracking-tighter italic leading-none mb-4">
                  {new Date(flight.arrivalTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </h2>
                <div className="space-y-1">
                  <p className="text-3xl font-black uppercase tracking-tight">
                    {flight.arrivalAirport}
                  </p>
                  <p className="text-primary font-black uppercase text-xs italic tracking-widest">
                    {flight.arrivalCity}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-4xl font-black uppercase italic tracking-tighter">
                In-Flight Elite
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: Wind,
                    label: "Advanced Cabin Filtration",
                    desc: "HEPA-grade air circulation arriving fresh.",
                  },
                  {
                    icon: Coffee,
                    label: "Gourmet Dining",
                    desc: "Curated menu by leading international chefs.",
                  },
                  {
                    icon: Zap,
                    label: "Lightning Connect",
                    desc: "High-speed satellite connectivity throughout.",
                  },
                  {
                    icon: Briefcase,
                    label: "Priority Handling",
                    desc: "Seamless baggage and terminal transition.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-6 p-8 bg-muted/10 rounded-[30px] border border-border/50 group hover:bg-primary/5 transition-all"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center text-primary shrink-0 shadow-lg group-hover:scale-110 transition-all">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-black uppercase italic tracking-tighter text-lg leading-none mb-2">
                        {item.label}
                      </h4>
                      <p className="text-xs text-muted-foreground italic font-medium leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-4xl font-black uppercase italic tracking-tighter">
                Airline Intelligence
              </h3>
              <Card className="rounded-[40px] border-none shadow-xl bg-card p-10 space-y-8">
                <div className="flex items-center gap-8">
                  <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center p-3">
                    {flight.airlineLogo ? (
                      <SafeImage
                        src={flight.airlineLogo}
                        alt={flight.airline}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <span className="text-2xl font-black italic opacity-30">
                        {flight.airline?.substring(0, 2) ||
                          flight.airline?.substring(0, 2) ||
                          "FL"}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black italic uppercase tracking-tighter leading-none mb-2">
                      {flight.airline}
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                      Official SkyWay Partner
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-muted/20 rounded-[30px] border border-border/30">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                      Fleet ID
                    </span>
                    <span className="text-sm font-black italic uppercase">
                      {flight.flightNumber}
                    </span>
                  </div>
                  <div className="p-6 bg-muted/20 rounded-[30px] border border-border/30">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                      Class
                    </span>
                    <span className="text-sm font-black italic uppercase">
                      {flight.class} Elite
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  Operating one of the worlds youngest and most efficient
                  fleets, committed to reaching new heights in safety and
                  passenger satisfaction.
                </p>
              </Card>
            </div>
          </div>

          <section className="pt-20 border-t border-border/50">
            <div className="mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] mb-4 italic">
                Passenger Intel
              </span>
              <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
                Boarding Records
              </h3>
            </div>
            <ReviewSection
              targetType="flight"
              targetId={id!}
              onReviewAdded={(avg, count) =>
                setFlight((f: any) => ({
                  ...f,
                  rating: avg,
                  reviewCount: count,
                }))
              }
            />
          </section>
        </div>

        {/* Booking Card */}
        <div className="space-y-10">
          <Card className="rounded-[60px] shadow-[0_48px_96px_-12px_rgba(0,0,0,0.14)] dark:shadow-[0_48px_96px_-12px_rgba(0,0,0,0.5)] border-none sticky top-32 overflow-hidden bg-card">
            <CardContent className="p-12 space-y-8">
              {(() => {
                const pricing = calculateExactUserFormula(
                  flight.price,
                  { adults, children, infants },
                  cabinClass,
                  tripType,
                );
                return (
                  <>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic mb-6 block opacity-60">
                        Fare Breakdown
                      </span>

                      <div className="space-y-4 mb-8 bg-muted/10 p-6 rounded-3xl border border-border/50">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span>Adults (x{adults})</span>
                          <span>{formatPrice(pricing.adultTotal / 100)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span>Children (x{children})</span>
                          <span>{formatPrice(pricing.childTotal / 100)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span>Infants (x{infants})</span>
                          <span>{formatPrice(pricing.infantTotal / 100)}</span>
                        </div>

                        <div className="pt-4 border-t border-border mt-4 flex justify-between items-center text-sm font-bold text-muted-foreground">
                          <span>Subtotal</span>
                          <span>{formatPrice(pricing.subtotal / 100)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold text-muted-foreground mt-2">
                          <span>Taxes & Surcharges</span>
                          <span>{formatPrice(pricing.taxes / 100)}</span>
                        </div>
                      </div>

                      <div className="flex items-baseline justify-between pt-4">
                        <span className="text-xl font-black uppercase italic">
                          Final Total
                        </span>
                        <p className="text-5xl font-black italic tracking-tighter leading-none text-primary">
                          {formatPrice(pricing.total / 100)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6 pt-4">
                      <Button
                        className="w-full h-20 rounded-[30px] font-black uppercase tracking-[0.3em] text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-[1.02] active:scale-95"
                        onClick={() =>
                          navigate(`/checkout/flight/${flight._id}`)
                        }
                      >
                        Proceed to Checkout
                      </Button>
                      <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic">
                        <ShieldCheck size={14} className="text-primary" />{" "}
                        End-to-End Secure Transaction
                      </div>
                    </div>

                    <div className="p-8 bg-muted/20 rounded-[40px] border border-border/50 space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                          Cabin
                        </span>
                        <span className="text-xs font-black italic uppercase">
                          {cabinClass}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                          Trip Type
                        </span>
                        <span className="text-xs font-black italic uppercase">
                          {tripType}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                          Cancellation
                        </span>
                        <Badge
                          variant="outline"
                          className="rounded-full border-green-500/20 text-green-500 text-[8px] px-3"
                        >
                          Elite Flexible
                        </Badge>
                      </div>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
