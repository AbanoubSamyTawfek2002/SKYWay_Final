import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../contexts/CurrencyContext";
import {
  ShieldCheck,
  Loader2,
  Plane,
  Hotel,
  Star,
  MapPin,
  Clock,
} from "lucide-react";
import { SafeImage } from "../components/SafeImage";
import { getFlightImage, getCarImage } from "../lib/imageUtils";
import { useFlightSearch } from "../contexts/FlightSearchContext";
import { calculateExactUserFormula } from "../lib/flightPricing";
import {
  calculateCarTotalPrice,
  calculateRentalDuration,
} from "../lib/pricingUtils";
import { TravelerReviews } from "../components/TravelerReviews";
import { calculateHotelPrice } from "../lib/hotelPricing";

const CheckoutForm = ({ amount, bookingData }: any) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      bookingData.type === "flight" &&
      bookingData.passengers &&
      bookingData.passengerNames
    ) {
      const missingNames = bookingData.passengers.some(
        (_: any, i: number) =>
          !bookingData.passengerNames[i] ||
          bookingData.passengerNames[i].trim() === "",
      );
      if (missingNames) {
        setError("Please enter names for all passengers");
        return;
      }
    }

    setProcessing(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const fakePaymentIntentId =
        "pi_mock_" + Math.random().toString(36).substring(7);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: bookingData.type,
          flightId: bookingData.type === "flight" ? bookingData.id : undefined,
          hotelId: bookingData.type === "hotel" ? bookingData.id : undefined,
          carId: bookingData.type === "car" ? bookingData.id : undefined,
          rooms:
            bookingData.type === "hotel" ? bookingData.rooms || [] : undefined,
          nights: bookingData.durationDays || 1,
          totalAmount: amount,
          paymentIntentId: fakePaymentIntentId,
          passengers:
            bookingData.type === "flight"
              ? bookingData.passengers.map((p: any, i: number) => ({
                  name: bookingData.passengerNames[i],
                  type: p.type,
                  seat: ["12A", "12B", "12C", "14A", "14B", "14C"][i % 6],
                  ticketNumber: `TKT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
                }))
              : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Backend error response:", errorData);
        throw new Error(
          errorData.message || "Failed to create booking on backend.",
        );
      }

      const responseData = await res.json();
      const booking = responseData.booking;

      const { onPassengerNameChange, ...safeBookingData } = bookingData;

      navigate("/payment-success", {
        state: {
          bookingData: safeBookingData,
          amount,
          transactionId: booking.bookingReference || fakePaymentIntentId,
          createdBooking: booking,
        },
      });
    } catch (err) {
      console.error(err);
      setError("Payment simulation failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="h-14 rounded-2xl bg-muted/20 border-2"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="h-14 rounded-2xl bg-muted/20 border-2"
            required
          />
          <Input
            placeholder="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="h-14 rounded-2xl bg-muted/20 border-2"
            required
          />
        </div>
      </div>
      {bookingData.type === "flight" && bookingData.passengers && (
        <div className="space-y-4 pt-4 border-t border-border mt-4">
          <h4 className="font-bold text-sm uppercase px-1">
            Passenger Details
          </h4>
          {bookingData.passengers.map((p: any, i: number) => (
            <Input
              key={i}
              placeholder={`Passenger ${i + 1} Name (${p.type})`}
              value={bookingData.passengerNames[i]}
              onChange={(e) =>
                bookingData.onPassengerNameChange(i, e.target.value)
              }
              className="h-12 rounded-2xl bg-muted/20 border-2"
              required
            />
          ))}
        </div>
      )}
      {error && (
        <div className="text-destructive text-sm font-bold bg-destructive/10 p-3 rounded-xl">
          {error}
        </div>
      )}
      <Button
        type="submit"
        className="w-full h-20 rounded-3xl font-black uppercase tracking-[0.2em] text-lg shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all"
        disabled={processing}
      >
        {processing ? (
          <Loader2 className="animate-spin mr-3" />
        ) : (
          <ShieldCheck className="mr-3" />
        )}
        {t("pay_securely")} {formatPrice(amount)}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const stateBookingData = location.state?.bookingData;
  const [resolvedBookingData, setResolvedBookingData] =
    useState<any>(stateBookingData);
  const { adults, children, infants, cabinClass, tripType } = useFlightSearch();
  const urlPickup = searchParams.get("pickup");
  const urlDropoff = searchParams.get("dropoff");
  const { formatPrice } = useCurrency();
  const [passengerNames, setPassengerNames] = useState<string[]>(
    Array.from({ length: adults + children + infants }).fill("") as string[],
  );
  const [item, setItem] = useState<any>(stateBookingData?.item || null);
  const [loading, setLoading] = useState(!stateBookingData);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (loading) {
      timeoutId = setTimeout(() => {
        setLoadError(true);
        setLoading(false);
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [loading]);

  useEffect(() => {
    if (stateBookingData) return;

    if (!type || !id) {
      setLoading(false);
      return;
    }

    const fetchItem = async () => {
      try {
        const roomsParam = searchParams.get("rooms");
        let endpoint =
          type === "hotel"
            ? `/api/hotels/${id}`
            : type === "flight"
              ? `/api/flights/${id}`
              : `/api/cars/${id}`;

        if (type === "hotel" && roomsParam) {
          endpoint += `?rooms=${encodeURIComponent(roomsParam)}`;
        }

        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();

          if (type === "hotel" && roomsParam) {
            try {
              const parsedRooms = JSON.parse(roomsParam);
              const selectedRoomsForCheckout = [];
              const availableRooms = [...data.rooms].filter(
                (r) => r.inventory && r.inventory.availableRooms > 0,
              );
              const bookedRoomIds = new Map();
              for (const reqRoom of parsedRooms) {
                const matchingType = availableRooms.find((rt: any) => {
                  const used = bookedRoomIds.get(rt._id.toString()) || 0;
                  return (
                    rt.capacity &&
                    rt.capacity.maxAdults >= (reqRoom.adults || 1) &&
                    rt.capacity.maxChildren >= (reqRoom.children || 0) &&
                    rt.inventory.availableRooms > used
                  );
                });
                if (matchingType) {
                  const used =
                    bookedRoomIds.get(matchingType._id.toString()) || 0;
                  bookedRoomIds.set(matchingType._id.toString(), used + 1);
                  selectedRoomsForCheckout.push({
                    roomTypeId: matchingType._id,
                    adults: reqRoom.adults || 1,
                    children: reqRoom.children || 0,
                  });
                }
              }

              const checkInParam = searchParams.get("checkIn");
              const checkOutParam = searchParams.get("checkOut");
              let durationDays = 1;
              if (checkInParam && checkOutParam) {
                const ci = new Date(checkInParam);
                const co = new Date(checkOutParam);
                if (!isNaN(ci.getTime()) && !isNaN(co.getTime())) {
                  const diffTime = Math.abs(co.getTime() - ci.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays > 0) durationDays = diffDays;
                }
              }

              const { grandTotal: finalPrice } = calculateHotelPrice({
                basePrice: data.pricePerNight,
                nights: durationDays,
                rooms: parsedRooms,
                category: data.category?.toLowerCase() || "standard",
              });

              setResolvedBookingData({
                type: "hotel",
                id,
                totalPrice: finalPrice,
                durationDays: durationDays,
                rooms: selectedRoomsForCheckout,
                item: data,
              });
            } catch (e) {}
          }

          setItem(data);
        } else {
          setItem(null);
        }
      } catch (err) {
        console.error(err);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [type, id, stateBookingData]);

  if (loading)
    return (
      <div className="container mx-auto p-20 text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-black italic uppercase tracking-widest text-xs">
          Preparing secure gateway...
        </p>
      </div>
    );

  if (loadError)
    return (
      <div className="container mx-auto p-20 text-center flex flex-col items-center gap-6">
        <p className="font-black uppercase tracking-widest text-destructive">
          Checkout Gateway Timeout.
        </p>
        <p className="text-muted-foreground text-sm font-semibold">
          We couldn't prepare the secure gateway. Please try again.
        </p>
        <Button
          onClick={() => navigate(-1)}
          className="rounded-xl font-bold uppercase tracking-widest"
        >
          Go Back
        </Button>
      </div>
    );

  if (!item)
    return <div className="p-20 text-center font-bold">Item not found.</div>;

  const actualType = type || resolvedBookingData?.type;
  const actualId = id || resolvedBookingData?.id;

  let basePrice = 0;
  let durationText = "";
  let flightPricing: any = null;
  let hotelPricingBreakdown: any = null;

  if (actualType === "car") {
    const pickupDate = urlPickup || resolvedBookingData?.pickupDate;
    const dropoffDate = urlDropoff || resolvedBookingData?.dropoffDate;

    if (pickupDate && dropoffDate) {
      const days = calculateRentalDuration(
        new Date(pickupDate),
        new Date(dropoffDate),
      );
      console.log(
        `[Car Checkout] pickupDate=${pickupDate}, dropoffDate=${dropoffDate}, duration=${days}`,
      );
      basePrice = calculateCarTotalPrice(item.pricePerDay, days);
      durationText = `(x${days} days)`;
    } else if (resolvedBookingData?.durationDays) {
      const days = resolvedBookingData.durationDays;
      basePrice =
        resolvedBookingData.totalPrice ||
        calculateCarTotalPrice(item.pricePerDay, days);
      durationText = `(x${days} days)`;
    } else {
      basePrice = item.pricePerDay; // default 1 day fallback
      durationText = `(x1 day)`;
    }
  } else if (actualType === "hotel") {
    const hotelPricing = calculateHotelPrice({
      basePrice: item.pricePerNight,
      nights: resolvedBookingData?.durationDays || 1,
      rooms: resolvedBookingData?.rooms || [],
      category: item.category?.toLowerCase() || "standard",
    });
    hotelPricingBreakdown = hotelPricing.breakdown;
    basePrice = hotelPricing.subtotal; // Before taxes
    durationText = resolvedBookingData?.durationDays
      ? `(x${resolvedBookingData.durationDays} nights)`
      : `(x1 nights)`;
  } else {
    // Flight
    flightPricing = calculateExactUserFormula(
      item.price,
      { adults, children, infants },
      cabinClass,
      tripType,
    );
    basePrice = flightPricing.subtotal / 100;
  }

  let surcharge = 0;
  if (actualType === "car") surcharge = basePrice * 0.15;
  if (actualType === "hotel") {
    surcharge = hotelPricingBreakdown?.taxes || basePrice * 0.15;
  }
  if (actualType === "flight" && flightPricing)
    surcharge = flightPricing.taxes / 100;

  const totalAmount =
    actualType === "flight" && flightPricing
      ? flightPricing.total / 100
      : basePrice + surcharge;

  if (actualType === "hotel") {
    console.log({
      basePricePerNight: hotelPricingBreakdown
        ? hotelPricingBreakdown.basePrice /
          hotelPricingBreakdown.roomsCount /
          (resolvedBookingData?.durationDays || 1)
        : item.pricePerNight,
      nights: resolvedBookingData?.durationDays || 1,
      rooms: hotelPricingBreakdown ? hotelPricingBreakdown.roomsCount : 1,
      guests: hotelPricingBreakdown ? hotelPricingBreakdown.totalGuests : 1,
      totalPrice: totalAmount,
    });
  }

  return (
    <div className="container mx-auto px-4 sm:px-10 py-12 sm:py-20 flex flex-col lg:flex-row gap-12 sm:gap-20 justify-center">
      {/* Booking Summary */}
      <div className="w-full lg:w-1/2 space-y-10">
        <div className="space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] italic">
            Review Selection
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
            Final Confirmation
          </h1>
        </div>

        <Card className="rounded-[40px] border-none shadow-2xl bg-card overflow-hidden">
          <div className="aspect-[21/9] relative overflow-hidden bg-muted">
            {actualType === "hotel" ? (
              <SafeImage
                src={item.images?.[0]}
                className="w-full h-full object-cover"
              />
            ) : actualType === "car" ? (
              <SafeImage
                src={getCarImage(item.brand, item.model, item.images?.[0])}
                fallbackSrc="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200"
                className="w-full h-full object-cover"
              />
            ) : (
              <SafeImage
                src={getFlightImage(item.arrivalCity, item.image, item._id)}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-10 left-10">
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                {actualType === "hotel"
                  ? item.name
                  : actualType === "car"
                    ? `${item.brand} ${item.model}`
                    : item.airline}
              </h2>
              <p className="text-white/60 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                {actualType === "hotel" || actualType === "car" ? (
                  <MapPin size={14} />
                ) : (
                  <Plane size={14} />
                )}
                {actualType === "hotel" || actualType === "car"
                  ? `${item.city}, ${item.country}`
                  : `${item.departureCity} → ${item.arrivalCity}`}
              </p>
            </div>
          </div>
          <CardContent className="p-10 space-y-8">
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block italic">
                  Service Level
                </span>
                <div className="flex items-center gap-2 font-black italic uppercase">
                  <Star
                    size={16}
                    className="text-primary"
                    fill="currentColor"
                  />
                  <span>
                    {actualType === "hotel" || actualType === "car"
                      ? `${item.rating || 5} Stars`
                      : `${item.class} Elite`}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block italic">
                  Reference
                </span>
                <p className="font-black italic uppercase italic">
                  {actualType === "hotel"
                    ? "Luxe Property"
                    : actualType === "car"
                      ? "Vehicle Rental"
                      : item.flightNumber}
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-border/50">
              <h4 className="font-black uppercase italic tracking-tighter text-xl mb-6">
                Pricing Distribution
              </h4>
              <div className="space-y-4">
                {actualType === "flight" && flightPricing ? (
                  <>
                    {adults > 0 && (
                      <div className="flex justify-between items-center text-sm italic font-medium">
                        <span className="text-muted-foreground">
                          Adults (x{adults})
                        </span>
                        <span>
                          {formatPrice(flightPricing.adultTotal / 100)}
                        </span>
                      </div>
                    )}
                    {children > 0 && (
                      <div className="flex justify-between items-center text-sm italic font-medium">
                        <span className="text-muted-foreground">
                          Children (x{children})
                        </span>
                        <span>
                          {formatPrice(flightPricing.childTotal / 100)}
                        </span>
                      </div>
                    )}
                    {infants > 0 && (
                      <div className="flex justify-between items-center text-sm italic font-medium">
                        <span className="text-muted-foreground">
                          Infants (x{infants})
                        </span>
                        <span>
                          {formatPrice(flightPricing.infantTotal / 100)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm italic font-medium pt-2 border-t border-border">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(flightPricing.subtotal / 100)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm italic font-medium">
                      <span className="text-muted-foreground">
                        Premium Surcharge & Taxes
                      </span>
                      <span>{formatPrice(surcharge)}</span>
                    </div>
                  </>
                ) : actualType === "hotel" ? (
                  <>
                    <div className="flex justify-between items-center text-sm italic font-medium">
                      <span className="text-muted-foreground">
                        Guests & Rooms
                      </span>
                      <span className="font-bold">
                        {hotelPricingBreakdown?.totalGuests || 1} Guests /{" "}
                        {hotelPricingBreakdown?.roomsCount || 1} Rooms
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm italic font-medium pt-2 border-t border-border">
                      <span className="text-muted-foreground">
                        Base Price {durationText}
                      </span>
                      <span>
                        {formatPrice(
                          hotelPricingBreakdown?.basePrice ||
                            item.pricePerNight *
                              (resolvedBookingData?.durationDays || 1),
                        )}
                      </span>
                    </div>
                    {hotelPricingBreakdown?.extraGuestsPrice > 0 && (
                      <div className="flex justify-between items-center text-sm italic font-medium">
                        <span className="text-muted-foreground">
                          Extra Guests Price {durationText}
                        </span>
                        <span>
                          {formatPrice(hotelPricingBreakdown.extraGuestsPrice)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm italic font-medium">
                      <span className="text-muted-foreground">
                        Premium Surcharge & Taxes (15%)
                      </span>
                      <span>{formatPrice(surcharge)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center text-sm italic font-medium">
                      <span className="text-muted-foreground">
                        {actualType === "car"
                          ? `Total for ${durationText.match(/\d+/) ? durationText.match(/\d+/)?.[0] : 1} days`
                          : `Standard Rate ${durationText}`}
                        {actualType === "car" && (
                          <span className="block text-xs mt-1">
                            {formatPrice(item.pricePerDay)} / day
                          </span>
                        )}
                      </span>
                      <span>{formatPrice(basePrice)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm italic font-medium">
                      <span className="text-muted-foreground">
                        Premium Surcharge & Taxes
                      </span>
                      <span>{formatPrice(surcharge)}</span>
                    </div>
                  </>
                )}
                <div className="pt-4 flex justify-between items-center">
                  <span className="text-xl font-black uppercase tracking-tighter italic">
                    Total Amount
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-4xl font-black italic tracking-tighter text-primary underline underline-offset-8 decoration-4 leading-none">
                      {formatPrice(totalAmount)}
                    </span>
                    {actualType === "car" && (
                      <span className="text-xs font-bold text-muted-foreground mt-2 italic uppercase">
                        total
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-primary/5 rounded-[30px] border-2 border-dashed border-primary/20 space-y-4">
              <h5 className="font-black uppercase italic tracking-tighter text-primary">
                SkyWay Protection Included
              </h5>
              <p className="text-[10px] leading-relaxed italic text-muted-foreground font-medium">
                This transaction is covered by our elite travel insurance,
                guaranteeing 100% reimbursement in case of institutional
                cancellations.
              </p>
            </div>
          </CardContent>
        </Card>

        {actualType === "flight" && <TravelerReviews flight={item} />}
      </div>

      {/* Payment Form */}
      <div className="w-full lg:w-1/2 mt-10 lg:mt-32">
        <Card className="rounded-[40px] shadow-[0_48px_96px_-12px_rgba(0,0,0,0.14)] dark:shadow-[0_48px_96px_-12px_rgba(0,0,0,0.5)] border-none overflow-hidden bg-card">
          <CardHeader className="p-12 text-center space-y-4">
            <CardTitle className="text-4xl font-black uppercase italic tracking-tighter">
              Cipher Payment
            </CardTitle>
            <p className="text-muted-foreground italic text-sm">
              Enter your payment credentials into our encrypted gateway for
              instant processing.
            </p>
          </CardHeader>
          <CardContent className="p-12 pt-0">
            <CheckoutForm
              amount={totalAmount}
              bookingData={{
                type: actualType,
                id: actualId,
                item,
                rooms: resolvedBookingData?.rooms || [],
                durationDays: resolvedBookingData?.durationDays || 1,
                passengers:
                  actualType === "flight"
                    ? [
                        ...Array(adults).fill({ type: "Adult" }),
                        ...Array(children).fill({ type: "Child" }),
                        ...Array(infants).fill({ type: "Infant" }),
                      ]
                    : null,
                passengerNames,
                onPassengerNameChange: (i: number, val: string) => {
                  const newNames = [...passengerNames];
                  newNames[i] = val;
                  setPassengerNames(newNames);
                },
              }}
            />

            <div className="mt-12 flex flex-col items-center gap-6">
              <div className="flex gap-4 grayscale opacity-30">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  className="h-6 w-auto"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  className="h-8 w-auto"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                  className="h-6 w-auto"
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 italic">
                <ShieldCheck size={14} className="text-primary" /> End-to-End
                Encrypted Gateway
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
