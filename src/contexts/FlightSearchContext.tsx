import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TripType = 'One Way' | 'Round Trip';
export type CabinClass = 'Economy' | 'Business' | 'First Class';

interface FlightSearchState {
  tripType: TripType;
  setTripType: (type: TripType) => void;
  from: string;
  setFrom: (from: string) => void;
  to: string;
  setTo: (to: string) => void;
  departureDate: Date | null;
  setDepartureDate: (date: Date | null) => void;
  returnDate: Date | null;
  setReturnDate: (date: Date | null) => void;
  adults: number;
  setAdults: (num: number) => void;
  children: number;
  setChildren: (num: number) => void;
  infants: number;
  setInfants: (num: number) => void;
  cabinClass: CabinClass;
  setCabinClass: (c: CabinClass) => void;
}

const FlightSearchContext = createContext<FlightSearchState | undefined>(undefined);

export function FlightSearchProvider({ children: childrenProp }: { children: ReactNode }) {
  const [tripType, setTripType] = useState<TripType>('One Way');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(new Date(Date.now() + 86400000 * 7));
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState<CabinClass>('Economy');

  return (
    <FlightSearchContext.Provider
      value={{
        tripType, setTripType,
        from, setFrom,
        to, setTo,
        departureDate, setDepartureDate,
        returnDate, setReturnDate,
        adults, setAdults,
        children, setChildren,
        infants, setInfants,
        cabinClass, setCabinClass
      }}
    >
      {childrenProp}
    </FlightSearchContext.Provider>
  );
}

export function useFlightSearch() {
  const context = useContext(FlightSearchContext);
  if (!context) {
    throw new Error('useFlightSearch must be used within a FlightSearchProvider');
  }
  return context;
}
