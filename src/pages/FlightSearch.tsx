import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plane, Clock, ArrowRight, Star, ChevronDown, Calendar, Users, MapPin, Search, List, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useAuth } from '../contexts/AuthContext';
import { useFlightSearch } from '../contexts/FlightSearchContext';
import { calculateExactUserFormula } from '../lib/flightPricing';
import { SafeImage } from '../components/SafeImage';
import { SkeletonFlightCard } from '../components/SkeletonLoaders';
import { WishlistButton } from '../components/WishlistButton';
import { FlightSearchBox } from '../components/FlightSearchBox';
import { ReviewSection } from '../components/ReviewSection';
import { CategorySlider } from '../components/CategorySlider';
import { FlightsMap } from '../components/FlightsMap';
import { getFlightImage } from '../lib/imageUtils';
import { FLIGHT_CITIES } from '../components/FlightSearchBox';

const routeCategories = [
  { name: 'All Routes', from: '', to: '' },
  { name: 'Cairo → Luxor', from: 'Cairo', to: 'Luxor' },
  { name: 'Cairo → Sharm', from: 'Cairo', to: 'Sharm El Sheikh' },
  { name: 'Cairo → Dubai', from: 'Cairo', to: 'Dubai' },
  { name: 'Cairo → London', from: 'Cairo', to: 'London' },
  { name: 'Cairo → Paris', from: 'Cairo', to: 'Paris' },
  { name: 'Cairo → New York', from: 'Cairo', to: 'New York' }
];

export default function FlightSearch() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const {
    tripType, setTripType,
    from, setFrom,
    to, setTo,
    adults, setAdults,
    children, setChildren,
    infants, setInfants,
    cabinClass, setCabinClass
  } = useFlightSearch();
  
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<any>(null);
  
  // Interactive Map State
  const [activeFlightId, setActiveFlightId] = useState<string | null>(null);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);

  // Sync context with params occasionally or use Context as SSOT for UI state
  useEffect(() => {
    if (user?.location && !from) {
      setFrom(user.location);
    }
  }, [user, from, setFrom]);

  const fetchFlights = useCallback(async (isLoadMore = false) => {
    const page = isLoadMore ? (pagination?.page || 1) + 1 : 1;
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    params.set('limit', '10');

    if (from) params.set('from', from);
    if (to) params.set('to', to);

    if (!isLoadMore) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(`/api/flights?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch flights');
      const result = await res.json();
      
      if (isLoadMore) {
        setFlights(prev => [...prev, ...(result.data || [])]);
      } else {
        setFlights(result.data || []);
      }
      setPagination(result.pagination);
    } catch (err) {
      console.error('Error fetching flights:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchParams, pagination?.page, from, to]);

  useEffect(() => {
    fetchFlights();
  }, [searchParams]);

  const handleRouteSelect = (routeName: string) => {
    const route = routeCategories.find(r => r.name === routeName);
    const newParams = new URLSearchParams(searchParams);
    if (!route || route.from === '') {
      setFrom('');
      setTo('');
      newParams.delete('from');
      newParams.delete('to');
    } else {
      setFrom(route.from);
      setTo(route.to);
      newParams.set('from', route.from);
      newParams.set('to', route.to);
    }
    setSearchParams(newParams);
  };

  const handleCityClick = (city: string) => {
    setFrom(city);
    setTo('');
    const newParams = new URLSearchParams(searchParams);
    newParams.set('from', city);
    newParams.delete('to');
    setSearchParams(newParams);
  };

  const scrollToMap = (flightId: string) => {
    setActiveFlightId(flightId);
    if (window.innerWidth < 1024) {
      const mapContainer = document.getElementById('flight-map-section');
      if (mapContainer) {
        mapContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  const activeFlightData = activeFlightId ? flights.find(f => f._id === activeFlightId) : null;

  const activeRoute = routeCategories.find(r => r.from === from && r.to === to)?.name || 'All Routes';

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden lg:flex-row">
      
      {/* Top/Left Map Section */}
      <div id="flight-map-section" className="w-full h-[300px] lg:h-full shrink-0 lg:w-[40%] xl:w-[35%] relative border-b lg:border-b-0 lg:border-r border-border bg-muted/10 z-10">
        <FlightsMap 
          cities={FLIGHT_CITIES} 
          activeFlight={activeFlightData} 
          onCityClick={handleCityClick}
        />
      </div>

      {/* Bottom/Right List Section */}
      <div className="w-full flex-1 lg:w-[60%] xl:w-[65%] overflow-y-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6 custom-scrollbar bg-background">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] mb-2 italic">SkyWay Elite Board</span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none mb-4">Global Wings</h1>
          <p className="text-muted-foreground text-sm italic">Book premium routes across the globe with our real-time intelligent flight board.</p>
        </div>
        
        <FlightSearchBox />

        <div className="mb-8 w-full overflow-hidden">
          <CategorySlider 
            categories={routeCategories.map(r => r.name)}
            activeCategory={activeRoute}
            onCategoryChange={handleRouteSelect}
          />
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => <SkeletonFlightCard key={i} />)}
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {flights.map((flight, i) => {
                const pricing = calculateExactUserFormula(flight.price, { adults, children, infants }, cabinClass, tripType);
                return (
                <motion.div 
                  key={flight._id || i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (i % 5) * 0.05 }}
                  onClick={() => scrollToMap(flight._id)}
                  className="cursor-pointer"
                >
                  <Card className={`overflow-hidden border-none shadow-md bg-card rounded-[30px] transition-all hover:shadow-xl cursor-pointer relative h-72 sm:h-80 group ${activeFlightId === flight._id ? 'ring-4 ring-primary' : ''}`}>
                    <SafeImage 
                      src={getFlightImage(flight.arrivalCity, flight.image, flight._id)} 
                      alt={flight.arrivalCity} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                    {/* Airline badge (top left) */}
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10 shadow-lg">
                        {flight.airlineLogo ? (
                          <SafeImage src={flight.airlineLogo} className="w-5 h-5 object-contain filter invert" alt={flight.airline} />
                        ) : (
                          <Plane className="w-4 h-4 text-white/70" />
                        )}
                        <span className="text-white text-xs font-bold tracking-widest">{flight.airline}</span>
                      </div>
                    </div>
                    
                    {/* Ticket type top right */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge variant="secondary" className="bg-white/20 backdrop-blur-md border-none text-white text-[10px] font-black uppercase tracking-widest px-3 py-1">
                        {tripType}
                      </Badge>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 flex justify-between items-end z-10">
                      <div>
                        <h3 className="text-white text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">{flight.arrivalCity}</h3>
                        <div className="flex flex-col gap-1">
                          <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <Clock size={12} className="text-primary hidden sm:inline" />
                            {new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                            <ArrowRight size={10} className="text-white/50" /> 
                            {new Date(flight.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                            {flight.duration} • {flight.stops === 0 ? 'Direct' : `${flight.stops} Transit`}
                          </span>
                          {/* "Adult: 4,500 EGP" badge */}
                          <div className="mt-2 text-[10px] text-white/70 font-bold uppercase tracking-widest">
                            Adult: {formatPrice(pricing.adultPricePerPerson / 100)} (Per Person)
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right flex flex-col items-end">
                        <span className="text-[10px] text-white/70 uppercase font-black tracking-widest mb-1">{cabinClass} Class</span>
                        
                        <div className="text-[10px] text-white/80 uppercase font-bold tracking-widest mb-1">
                          Total for {adults + children + infants} Passenger{(adults + children + infants) > 1 ? 's' : ''}
                        </div>
                        <span className="text-white text-2xl sm:text-3xl font-black tracking-tighter leading-none">{formatPrice(pricing.total / 100)}</span>
                        
                        <Button 
                          size="sm" 
                          className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase tracking-widest text-[10px] rounded-full px-5 py-1 transition-transform active:scale-95"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            navigate(`/flights/${flight._id}`); 
                          }}
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
                );
              })}
            </AnimatePresence>

            {pagination && pagination.page < pagination.pages && (
              <div className="mt-12 flex justify-center">
                <Button 
                  variant="outline" 
                  disabled={loadingMore}
                  onClick={() => fetchFlights(true)}
                  className="rounded-full px-8 h-10 font-bold uppercase tracking-widest text-[10px]"
                >
                  {loadingMore ? 'Loading...' : 'Load More Routes'}
                </Button>
              </div>
            )}

            {flights.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center border border-dashed rounded-3xl mt-4">
                <Plane size={40} className="text-muted-foreground/30 mb-4" />
                <h2 className="text-xl font-black uppercase italic mb-2">No Flights Found</h2>
                <p className="text-muted-foreground italic text-xs mb-4">Adjust your search criteria to find available routes.</p>
                <Button variant="outline" size="sm" className="rounded-full font-bold uppercase tracking-widest text-[9px]" onClick={() => handleRouteSelect(routeCategories[0].name)}>View All Routes</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
