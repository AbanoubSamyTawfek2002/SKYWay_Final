import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Star, Car as CarIcon, Users, Gauge, Droplet, Briefcase, Building2, Calendar, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SafeImage } from '../components/SafeImage';
import { getCarImage } from '../lib/imageUtils';
import { AutocompleteInput } from '../components/AutocompleteInput';
import { TimeSelect } from '../components/TimeSelect';
import { DatePicker } from '../components/DatePicker';
import { useCurrency } from '../contexts/CurrencyContext';
import { calculateRentalDuration, calculateCarTotalPrice } from '../lib/pricingUtils';
import { cn } from '@/lib/utils';

const AIRPORT_OPTIONS = [
  'Cairo International Airport',
  'Dubai International Airport',
  'Heathrow Airport',
  'JFK International Airport',
  'Paris Charles de Gaulle',
  'Tokyo Haneda Airport',
  'Istanbul Airport',
  'Los Angeles International',
  'Frankfurt Airport'
];

interface Car {
  _id: string;
  brand: string;
  model: string;
  type: string;
  pricePerDay: number;
  images: string[];
  seats: number;
  transmission: string;
  fuelType: string;
  city: string;
  country: string;
  rating: number;
  reviewCount: number;
}

export default function CarSearch() {
  const [location, setLocation] = useState('Cairo International Airport');
  const [pickUpDate, setPickUpDate] = useState<Date | undefined>();
  const [pickUpTime, setPickUpTime] = useState('10:00');
  const [dropOffDate, setDropOffDate] = useState<Date | undefined>();
  const [dropOffTime, setDropOffTime] = useState('10:00');
  
  // Filters
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [maxPriceUSD, setMaxPriceUSD] = useState<number>(1000); 
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice, currency, rates } = useCurrency();

  // Load from URL on mount
  useEffect(() => {
    const loc = searchParams.get('location');
    const pDate = searchParams.get('pickupDate');
    const pTime = searchParams.get('pickupTime');
    const dDate = searchParams.get('dropoffDate');
    const dTime = searchParams.get('dropoffTime');
    
    if (loc) setLocation(loc);
    
    if (pDate && dDate) {
      // Must add a generic time to prevent timezone offset from shifting the date back one day
      setPickUpDate(new Date(`${pDate}T12:00:00Z`));
      setDropOffDate(new Date(`${dDate}T12:00:00Z`));
    } else {
      const today = new Date();
      const tmrw = new Date(today);
      tmrw.setDate(tmrw.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 4);
      setPickUpDate(tmrw);
      setDropOffDate(nextWeek);
    }
    
    if (pTime) setPickUpTime(pTime);
    if (dTime) setDropOffTime(dTime);
  }, [searchParams]);

  const calculateDuration = () => {
    if (!pickUpDate || !dropOffDate) return 1;
    const startStr = pickUpDate.toISOString().split('T')[0];
    const endStr = dropOffDate.toISOString().split('T')[0];
    const start = new Date(`${startStr}T${pickUpTime || '00:00'}`);
    const end = new Date(`${endStr}T${dropOffTime || '00:00'}`);
    
    return calculateRentalDuration(start, end);
  };

  const durationDays = useMemo(() => calculateDuration(), [pickUpDate, pickUpTime, dropOffDate, dropOffTime]);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      // Only generic location if needed, otherwise grab all and filter frontend for demo
      const res = await fetch(`/api/cars?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch cars');
      
      const data = await res.json();
      setCars(data.data || []);
    } catch (err) {
      console.error(err);
      setError('Could not load car rentals at this time.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCars();
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const toggleSeat = (seatStr: string) => {
    setSelectedSeats(prev => prev.includes(seatStr) ? prev.filter(s => s !== seatStr) : [...prev, seatStr]);
  };

  // Filter cars client side
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const rate = rates[currency] || 1;
      const localPrice = car.pricePerDay * rate;
      if (maxPriceUSD < 1000 && car.pricePerDay > maxPriceUSD) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(car.type)) return false;
      if (selectedSeats.length > 0) {
        if (selectedSeats.includes('4+') && car.seats >= 4) return true;
        if (selectedSeats.includes('5+') && car.seats >= 5) return true;
        if (selectedSeats.includes('7+') && car.seats >= 7) return true;
        if (selectedSeats.includes(car.seats.toString())) return true;
        return false;
      }
      return true;
    });
  }, [cars, maxPriceUSD, selectedTypes, selectedSeats, currency, rates]);

  const getCompany = (brand: string) => {
    const companies = ['Avis', 'Europcar', 'Hertz', 'Sixt', 'Budget', 'Enterprise'];
    return companies[brand.length % companies.length];
  };

  const getLuggage = (type: string) => {
    if (type === 'SUV') return 4;
    if (type === 'Economy') return 2;
    if (type === 'Luxury' || type === 'Sedan') return 3;
    return 2;
  };

  return (
    <div className="bg-muted/10 min-h-[calc(100vh-80px)]">
      {/* Search Header */}
      <div className="relative px-4 py-16 md:py-24 overflow-hidden bg-gradient-to-b from-[#F7F8FA] to-[#EDEFF3] dark:from-[#0B0B0B] dark:to-[#111111] border-b border-border/40">
        {/* Subtle blurred car image overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2000')] bg-cover bg-center opacity-[0.03] dark:opacity-[0.08] blur-xl pointer-events-none mix-blend-luminosity"></div>
        {/* Radial Glow for Dark Mode */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/20 dark:bg-primary/20 rounded-[100%] blur-[120px] pointer-events-none hidden dark:block"></div>

        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-[0.02em] mb-4 text-center text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Rent The Perfect Car
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-12 text-sm md:text-lg text-center tracking-wide max-w-2xl">
            Compare premium car rental deals from top companies. Experience luxury and comfort on your terms.
          </p>
          
          <form onSubmit={handleSearch} className="w-full p-4 md:p-6 rounded-[24px] backdrop-blur-[14px] bg-white/80 dark:bg-[rgba(20,20,20,0.75)] border border-black/5 dark:border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4 relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block ml-2">Pick-up Location</label>
                <div className="relative group">
                  <AutocompleteInput
                    placeholder="City, Airport or Region"
                    value={location}
                    onChange={setLocation}
                    options={AIRPORT_OPTIONS}
                    inputClassName="pl-12 h-16 w-full rounded-[16px] text-base font-bold placeholder:font-normal bg-[#F1F3F6] dark:bg-[rgba(255,255,255,0.05)] border-2 border-transparent transition-all focus:border-primary/50 focus:bg-white dark:focus:bg-[rgba(255,255,255,0.1)] focus:shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                  />
                </div>
              </div>
              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block ml-2">Pick-up Date</label>
                  <DatePicker 
                    date={pickUpDate}
                    setDate={setPickUpDate}
                    minDate={new Date()}
                    placeholder="Select date"
                    inputClassName={cn("w-full pl-10 pr-4 h-16 rounded-[16px] justify-start text-left text-base font-bold transition-all bg-[#F1F3F6] dark:bg-[rgba(255,255,255,0.05)] border-2 border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-[rgba(255,255,255,0.1)] focus:shadow-[0_0_15px_rgba(var(--primary),0.1)]", !pickUpDate && "text-muted-foreground font-normal")}
                  />
                </div>
                <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block ml-2">Time</label>
                  <TimeSelect 
                    value={pickUpTime} 
                    onChange={setPickUpTime} 
                    inputClassName="w-full pl-10 pr-8 h-16 rounded-[16px] text-base font-bold transition-all flex items-center cursor-pointer bg-[#F1F3F6] dark:bg-[rgba(255,255,255,0.05)] border-2 border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-[rgba(255,255,255,0.1)] focus:shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                  />
                </div>
                <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block ml-2">Drop-off Date</label>
                  <DatePicker 
                    date={dropOffDate}
                    setDate={setDropOffDate}
                    minDate={pickUpDate || new Date()}
                    placeholder="Select date"
                    disabled={!pickUpDate}
                    inputClassName={cn("w-full pl-10 pr-4 h-16 rounded-[16px] justify-start text-left text-base font-bold transition-all bg-[#F1F3F6] dark:bg-[rgba(255,255,255,0.05)] border-2 border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-[rgba(255,255,255,0.1)] focus:shadow-[0_0_15px_rgba(var(--primary),0.1)]", !dropOffDate && "text-muted-foreground font-normal")}
                  />
                </div>
                <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block ml-2">Time</label>
                  <TimeSelect 
                    value={dropOffTime} 
                    onChange={setDropOffTime} 
                    inputClassName="w-full pl-10 pr-8 h-16 rounded-[16px] text-base font-bold transition-all flex items-center cursor-pointer bg-[#F1F3F6] dark:bg-[rgba(255,255,255,0.05)] border-2 border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-[rgba(255,255,255,0.1)] focus:shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-2">
              <Button type="submit" className="h-14 w-full md:w-auto px-12 md:px-16 font-black tracking-[0.1em] text-sm uppercase rounded-[14px] transition-all duration-300 bg-black text-white hover:bg-black/90 dark:bg-gradient-to-br dark:from-white dark:to-gray-300 dark:text-black dark:hover:from-white dark:hover:to-white shadow-[0_10px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-xl dark:hover:shadow-white/20 hover:scale-[1.02]">
                Search Cars
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-black text-sm uppercase tracking-widest">
            {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
          </div>
          <Button variant="outline" onClick={() => setShowMobileFilters(true)} className="rounded-xl font-bold uppercase tracking-widest text-xs">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
        </div>

        {/* Sidebar Filters */}
        <aside className={`fixed inset-0 z-50 bg-background lg:bg-transparent lg:static lg:block lg:w-72 shrink-0 ${showMobileFilters ? 'block overflow-y-auto' : 'hidden'}`}>
          <div className="p-4 lg:p-0 sticky top-24">
            <div className="flex justify-between items-center lg:hidden mb-6">
              <h2 className="text-xl font-black uppercase tracking-tighter">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Quick Summary Panel */}
            <div className="bg-card border rounded-2xl p-5 shadow-sm mb-6 hidden lg:block">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b pb-2 mb-3">Rental Summary</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Duration</span>
                <Badge variant="secondary" className="font-bold">{durationDays} {durationDays === 1 ? 'Day' : 'Days'}</Badge>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Pick-up</span>
                <span>{pickUpDate ? pickUpDate.toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                <span>Drop-off</span>
                <span>{dropOffDate ? dropOffDate.toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-6">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest mb-3">Price per day</h3>
                <div className="px-2">
                  <input 
                    type="range" 
                    min="20" 
                    max="1000" 
                    step="10" 
                    value={maxPriceUSD} 
                    onChange={(e) => setMaxPriceUSD(parseInt(e.target.value))}
                    className="w-full accent-primary" 
                  />
                  <div className="flex justify-between text-xs font-bold text-muted-foreground mt-2">
                    <span>Up to {formatPrice(maxPriceUSD)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-xs font-black uppercase tracking-widest mb-3">Car Type</h3>
                <div className="space-y-2">
                  {['Economy', 'Sedan', 'SUV', 'Luxury', 'Convertible'].map(t => (
                    <label key={t} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${selectedTypes.includes(t) ? 'bg-primary border-primary' : 'border-muted-foreground/30 group-hover:border-primary/50'}`}>
                        {selectedTypes.includes(t) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="text-sm font-semibold">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-xs font-black uppercase tracking-widest mb-3">Seats</h3>
                <div className="flex flex-wrap gap-2">
                  {['2', '4', '5+', '7+'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => toggleSeat(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${selectedSeats.includes(s) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 lg:hidden">
              <Button className="w-full font-black uppercase tracking-widest h-12 rounded-xl" onClick={() => setShowMobileFilters(false)}>Show {filteredCars.length} Cars</Button>
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1">
          {error ? (
            <div className="text-center p-8 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20">
              {error}
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-muted animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center p-16 bg-card rounded-3xl border border-dashed">
              <CarIcon className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">No cars available</h3>
              <p className="text-muted-foreground font-medium">Try adjusting your filters or changing dates to find more options.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredCars.map((car, index) => {
                  const company = getCompany(car.brand);
                  const luggage = getLuggage(car.type);
                  const totalPrice = calculateCarTotalPrice(car.pricePerDay, durationDays);

                  return (
                    <motion.div
                      key={car._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: (index % 5) * 0.05 }}
                      className="bg-card rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row group"
                    >
                      {/* Car Image Area */}
                      <div className="w-full md:w-[280px] h-[200px] md:h-auto relative bg-muted/20 flex flex-col justify-center items-center overflow-hidden shrink-0">
                        <SafeImage 
                          src={getCarImage(car.brand, car.model, car.images?.[0])} 
                          alt={`${car.brand} ${car.model}`} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute top-3 left-3 bg-background/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5 border">
                          <Building2 size={12} className="text-primary"/> {company}
                        </div>
                      </div>

                      {/* Car Details */}
                      <div className="flex-1 p-5 md:p-6 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <Badge variant="outline" className="mb-2 bg-primary/5 text-[9px] font-black uppercase tracking-widest">{car.type}</Badge>
                              <h3 className="text-2xl font-black tracking-tighter uppercase italic leading-none text-foreground">{car.brand} <span className="font-bold not-italic">{car.model}</span></h3>
                            </div>
                            <div className="flex items-center bg-yellow-500/10 text-yellow-600 px-2.5 py-1 rounded-lg border border-yellow-500/20 shrink-0">
                              <Star className="mr-1" size={12} fill="currentColor" />
                              <span className="font-bold text-sm tracking-tight">{car.rating.toFixed(1)}</span>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-foreground/80">
                            <div className="flex items-center gap-2"><Users size={16} className="text-muted-foreground"/> <span className="font-semibold">{car.seats} Seats</span></div>
                            <div className="flex items-center gap-2"><Gauge size={16} className="text-muted-foreground"/> <span className="font-semibold">{car.transmission}</span></div>
                            <div className="flex items-center gap-2"><Briefcase size={16} className="text-muted-foreground"/> <span className="font-semibold">{luggage} Bags</span></div>
                            <div className="flex items-center gap-2"><Droplet size={16} className="text-muted-foreground"/> <span className="font-semibold">{car.fuelType}</span></div>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-t pt-4">
                          <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                            <MapPin size={14} className="text-primary"/> Pick up at Location
                          </div>
                          <div className="text-right flex flex-row md:flex-col justify-between md:justify-end items-center md:items-end gap-2 md:gap-px">
                            <div className="flex flex-col md:items-end">
                              <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-0.5">Total for {durationDays} {durationDays === 1 ? 'day' : 'days'}</span>
                              <div className="text-2xl md:text-3xl font-black tracking-tighter text-primary leading-none">
                                {formatPrice(totalPrice)}
                              </div>
                              <span className="text-xs font-bold text-muted-foreground mt-1">{formatPrice(car.pricePerDay)} / day</span>
                            </div>
                            <Button className="h-12 md:h-10 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] md:mt-2 shadow-lg shadow-primary/20" onClick={() => navigate(`/checkout/car/${car._id}?pickup=${pickUpDate ? pickUpDate.toISOString().split('T')[0] : ''}&dropoff=${dropOffDate ? dropOffDate.toISOString().split('T')[0] : ''}&pickupTime=${pickUpTime || ''}&dropoffTime=${dropOffTime || ''}`, { state: { bookingData: { type: 'car', id: car._id, item: car, durationDays, totalPrice, pickupDate: pickUpDate?.toISOString(), dropoffDate: dropOffDate?.toISOString(), pickupTime: pickUpTime, dropoffTime: dropOffTime } } })}>
                              Select
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

