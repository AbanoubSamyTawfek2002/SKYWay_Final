import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plane, Hotel, Calendar, Users, MapPin, Search, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '../contexts/CurrencyContext';
import { AutocompleteInput } from '../components/AutocompleteInput';
import { TimeSelect } from '../components/TimeSelect';
import { DatePicker } from '../components/DatePicker';
import { FlightSearchBox } from '../components/FlightSearchBox';
import { HotelSearchBox } from '../components/HotelSearchBox';

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

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  
  // Cars state
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [sameAsPickup, setSameAsPickup] = useState(true);
  const [pickupDate, setPickupDate] = useState<Date | undefined>();
  const [pickupTime, setPickupTime] = useState('10:00');
  const [dropoffDate, setDropoffDate] = useState<Date | undefined>();
  const [dropoffTime, setDropoffTime] = useState('10:00');

  const handleSearch = (type: 'hotels' | 'cars') => {
    const params = new URLSearchParams();
    if (type === 'hotels') {
      if (from) params.append('from', from);
      if (to) params.append('to', to);
    } else if (type === 'cars') {
      if (!pickupLocation || !pickupDate || !dropoffDate) return; // Basic validation
      
      const pickupTimeStr = pickupTime || '10:00';
      const dropoffTimeStr = dropoffTime || '10:00';
      
      // format to string: YYYY-MM-DD
      const pDateStr = pickupDate.toISOString().split('T')[0];
      const dDateStr = dropoffDate.toISOString().split('T')[0];

      const start = new Date(`${pDateStr}T${pickupTimeStr}`);
      const end = new Date(`${dDateStr}T${dropoffTimeStr}`);
      if (end <= start) {
        alert("Drop-off must be after pickup time");
        return;
      }
      
      params.append('location', pickupLocation);
      params.append('pickupDate', pDateStr);
      params.append('pickupTime', pickupTimeStr);
      params.append('dropoffDate', dDateStr);
      params.append('dropoffTime', dropoffTimeStr);
    }
    navigate(`/${type}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20 pb-12 md:pt-28">
        <div className="absolute inset-0 z-0 scale-110">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109ce05?auto=format&fit=crop&w=1920&q=80" 
            alt="Travel Hero" 
            className="w-full h-full object-cover brightness-100 dark:brightness-75 motion-safe:animate-[pulse_10s_ease-in-out_infinite]"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-background dark:from-black/60 dark:via-transparent dark:to-background" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-8 text-center flex flex-col items-center justify-center mt-[-2rem]">
          {/* Background Decorative Text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none select-none overflow-hidden -mt-20">
            <h1 className="text-[120px] md:text-[200px] lg:text-[250px] font-black opacity-[0.03] dark:opacity-10 text-black dark:text-white uppercase tracking-tighter italic leading-none whitespace-nowrap">
              SKYWAY
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center relative z-20"
          >
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#111] dark:text-white uppercase tracking-tighter mb-4 sm:mb-6 leading-tight drop-shadow-sm dark:drop-shadow-2xl italic break-words w-full max-w-4xl">
              Fly Higher with SkyWay
            </h2>
            <p className="text-[rgba(0,0,0,0.7)] dark:text-white/90 text-sm sm:text-base md:text-xl lg:text-2xl font-bold mb-8 sm:mb-12 max-w-2xl mx-auto drop-shadow-sm dark:drop-shadow-md italic">
              Redefining global exploration with premium selection and intelligent travel concierge.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-6xl mx-auto"
          >
            <Card className="border-none backdrop-blur-3xl bg-background/60 shadow-[0_48px_80px_-12px_rgba(0,0,0,0.4)] dark:shadow-[0_48px_80px_-12px_rgba(0,0,0,0.8)] rounded-[20px] sm:rounded-[40px] overflow-visible">
              <CardContent className="p-4 sm:p-6 md:p-10">
                <Tabs defaultValue="flights" className="w-full">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <TabsList className="bg-muted/50 p-1 h-12 sm:h-14 rounded-full overflow-x-auto no-scrollbar max-w-full">
                      <TabsTrigger value="flights" className="rounded-full px-4 sm:px-8 h-full gap-2 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg whitespace-nowrap">
                        <Plane size={16} className="sm:size-[18px]" /> <span className="font-bold uppercase tracking-widest text-[10px] sm:text-xs text-nowrap">{t('flights')}</span>
                      </TabsTrigger>
                      <TabsTrigger value="hotels" className="rounded-full px-4 sm:px-8 h-full gap-2 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg whitespace-nowrap">
                        <Hotel size={16} className="sm:size-[18px]" /> <span className="font-bold uppercase tracking-widest text-[10px] sm:text-xs text-nowrap">{t('hotels')}</span>
                      </TabsTrigger>
                      <TabsTrigger value="cars" className="rounded-full px-4 sm:px-8 h-full gap-2 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg whitespace-nowrap">
                        <Car size={16} className="sm:size-[18px]" /> <span className="font-bold uppercase tracking-widest text-[10px] sm:text-xs text-nowrap">Cars</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="flights" className="mt-0 focus-visible:outline-none data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:slide-in-from-bottom-2 duration-500">
                    <FlightSearchBox />
                  </TabsContent>

                  <TabsContent value="hotels" className="mt-0 focus-visible:outline-none data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:slide-in-from-bottom-2 duration-500">
                    <HotelSearchBox />
                  </TabsContent>

                  <TabsContent value="cars" className="mt-0 focus-visible:outline-none data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 gap-4 p-1 sm:p-2">
                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="w-full">
                            <label className="text-[10px] font-bold uppercase text-muted-foreground ml-2 mb-1 block">Pick-up Location</label>
                            <AutocompleteInput 
                              placeholder="City or Airport" 
                              value={pickupLocation} 
                              onChange={setPickupLocation} 
                              options={AIRPORT_OPTIONS} 
                            />
                          </div>
                          {!sameAsPickup && (
                            <div className="w-full">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground ml-2 mb-1 block">Return Location</label>
                              <AutocompleteInput 
                                placeholder="City or Airport" 
                                value={returnLocation} 
                                onChange={setReturnLocation} 
                                options={AIRPORT_OPTIONS} 
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <input 
                            type="checkbox" 
                            id="sameReturn" 
                            checked={sameAsPickup} 
                            onChange={(e) => setSameAsPickup(e.target.checked)} 
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                          />
                          <label htmlFor="sameReturn" className="text-sm font-semibold cursor-pointer">Return car to the same location</label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/50 pt-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold uppercase text-muted-foreground ml-2 mb-1 block">Pick-up Date</label>
                            <DatePicker 
                              date={pickupDate}
                              setDate={setPickupDate}
                              minDate={new Date()}
                              placeholder="Select date"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold uppercase text-muted-foreground ml-2 mb-1 block">Time</label>
                            <TimeSelect value={pickupTime} onChange={setPickupTime} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold uppercase text-muted-foreground ml-2 mb-1 block">Drop-off Date</label>
                            <DatePicker 
                              date={dropoffDate}
                              setDate={setDropoffDate}
                              minDate={pickupDate || new Date()}
                              placeholder="Select date"
                              disabled={!pickupDate}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold uppercase text-muted-foreground ml-2 mb-1 block">Time</label>
                            <TimeSelect value={dropoffTime} onChange={setDropoffTime} />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end p-2 mt-2">
                      <Button 
                        className={`w-full md:w-auto px-12 h-16 rounded-2xl text-lg font-bold uppercase tracking-widest shadow-xl shadow-primary/20 transition-all ${
                          !pickupLocation || !pickupDate || !dropoffDate 
                            ? 'opacity-50 cursor-not-allowed bg-muted-foreground' 
                            : 'hover:shadow-primary/40 hover:-translate-y-1'
                        }`} 
                        onClick={() => handleSearch('cars')}
                      >
                        <Search className="mr-2" size={20} /> Search Cars
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-20 sm:py-32 bg-background overflow-hidden px-4 sm:px-6 md:px-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-8">
            <div className="max-w-xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] mb-4 italic">World Collection</span>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase mb-4 leading-none italic">Popular Destinations</h2>
              <p className="text-muted-foreground text-base sm:text-lg italic">Explore our hand-picked selection of the world's most breathtaking places.</p>
            </div>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto h-14 sm:h-auto font-black uppercase tracking-widest text-[10px] sm:text-xs border-2 rounded-full hover:bg-primary hover:text-white transition-all transform hover:scale-105"
              onClick={() => navigate('/destinations')}
            >
              Explore All
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { city: "Paris", country: "France", price: 450, img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80" },
              { city: "Tokyo", country: "Japan", price: 820, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80" },
              { city: "Dubai", country: "UAE", price: 610, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80" },
              { city: "New York", country: "USA", price: 550, img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80" }
            ].map((dest, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                onClick={() => navigate(`/destinations/${dest.city}`, { state: { image: dest.img, description: "" } })}
                className="group relative overflow-hidden rounded-[40px] shadow-2xl aspect-[4/6] cursor-pointer"
              >
                <img 
                  src={dest.img} 
                  alt={dest.city} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-10 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">{dest.country}</span>
                  <h3 className="text-4xl font-black mb-2 tracking-tighter uppercase italic">{dest.city}</h3>
                  <div className="flex items-center justify-between overflow-hidden">
                    <p className="text-white/60 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all delay-200 duration-500 translate-y-4 group-hover:translate-y-0">From <span className="text-white text-lg">{formatPrice(dest.price)}</span></p>
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all delay-300 scale-0 group-hover:scale-100">
                      <Search size={16} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
