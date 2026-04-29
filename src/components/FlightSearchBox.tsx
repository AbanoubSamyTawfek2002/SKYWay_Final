import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search, Users, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlightSearch } from '../contexts/FlightSearchContext';

export const FLIGHT_CITIES = [
  // Domestic
  { name: 'Cairo', lat: 30.0444, lng: 31.2357 },
  { name: 'Alexandria', lat: 31.2001, lng: 29.9187 },
  { name: 'Luxor', lat: 25.6872, lng: 32.6396 },
  { name: 'Aswan', lat: 24.0889, lng: 32.8998 },
  { name: 'Sharm El Sheikh', lat: 27.9158, lng: 34.3299 },
  { name: 'Hurghada', lat: 27.2579, lng: 33.8116 },
  // International
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'Istanbul', lat: 41.0082, lng: 28.9784 },
  { name: 'Frankfurt', lat: 50.1109, lng: 8.6821 }
];

export function FlightSearchBox() {
  const navigate = useNavigate();
  const {
    tripType, setTripType,
    from, setFrom,
    to, setTo,
    adults, setAdults,
    children, setChildren,
    infants, setInfants,
    cabinClass, setCabinClass
  } = useFlightSearch();
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    setShowPassengerDropdown(false);
    navigate(`/flights?${params.toString()}`);
  };

  return (
    <div className="bg-card p-4 sm:p-6 rounded-3xl shadow-sm border flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
        <div className="flex items-center bg-muted/50 p-1 rounded-xl">
          <Button
            variant={tripType === 'One Way' ? 'default' : 'ghost'}
            size="sm"
            className={`rounded-lg text-xs font-bold ${tripType === 'One Way' ? 'shadow-sm' : ''}`}
            onClick={() => setTripType('One Way')}
          >
            One Way
          </Button>
          <Button
            variant={tripType === 'Round Trip' ? 'default' : 'ghost'}
            size="sm"
            className={`rounded-lg text-xs font-bold ${tripType === 'Round Trip' ? 'shadow-sm' : ''}`}
            onClick={() => setTripType('Round Trip')}
          >
            Round Trip
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-xl text-xs font-bold"
              onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
            >
              <Users className="w-4 h-4 mr-2" />
              {adults + children + infants} Passenger{(adults + children + infants) > 1 ? 's' : ''}
              <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
            </Button>
            {showPassengerDropdown && (
              <div className="absolute top-12 right-0 w-64 bg-card border rounded-2xl shadow-xl z-50 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">Adults</p>
                    <p className="text-[10px] text-muted-foreground">Age 14+</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="w-8 h-8 rounded-full p-0" onClick={() => setAdults(Math.max(1, adults - 1))}>-</Button>
                    <span className="font-bold text-sm">{adults}</span>
                    <Button variant="outline" size="sm" className="w-8 h-8 rounded-full p-0" onClick={() => setAdults(adults + 1)}>+</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">Children</p>
                    <p className="text-[10px] text-muted-foreground">Age 2-13</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="w-8 h-8 rounded-full p-0" onClick={() => setChildren(Math.max(0, children - 1))}>-</Button>
                    <span className="font-bold text-sm">{children}</span>
                    <Button variant="outline" size="sm" className="w-8 h-8 rounded-full p-0" onClick={() => setChildren(children + 1)}>+</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">Infants</p>
                    <p className="text-[10px] text-muted-foreground">Under 2</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="w-8 h-8 rounded-full p-0" onClick={() => setInfants(Math.max(0, infants - 1))}>-</Button>
                    <span className="font-bold text-sm">{infants}</span>
                    <Button variant="outline" size="sm" className="w-8 h-8 rounded-full p-0" onClick={() => setInfants(infants + 1)}>+</Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <select 
            value={cabinClass} 
            onChange={(e) => setCabinClass(e.target.value as any)}
            className="bg-transparent border border-input rounded-xl px-4 py-2 text-xs font-bold outline-none hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <option value="Economy">Economy</option>
            <option value="Business">Business</option>
            <option value="First Class">First Class</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="relative md:col-span-3">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            list="egypt-cities"
            className="w-full bg-background border rounded-xl pl-10 pr-4 py-3 font-bold outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>
        
        <div className="relative md:col-span-3">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            list="egypt-cities"
            className="w-full bg-background border rounded-xl pl-10 pr-4 py-3 font-bold outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>

        <datalist id="egypt-cities">
          {FLIGHT_CITIES.map(c => <option key={c.name} value={c.name} />)}
        </datalist>

        <div className={`grid gap-4 ${tripType === 'Round Trip' ? 'grid-cols-2 md:col-span-4' : 'grid-cols-1 md:col-span-4'}`}>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="date"
              className="w-full bg-background border rounded-xl pl-10 pr-4 py-3 font-bold outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
          {tripType === 'Round Trip' && (
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="date"
                className="w-full bg-background border rounded-xl pl-10 pr-4 py-3 font-bold outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
          )}
        </div>

        <Button 
          onClick={handleSearch}
          className="h-12 w-full md:col-span-2 rounded-xl font-black uppercase tracking-widest text-[11px]"
        >
          <Search className="w-4 h-4 mr-2" /> Search
        </Button>
      </div>
    </div>
  );
}
