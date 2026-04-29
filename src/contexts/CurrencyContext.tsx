import React, { createContext, useContext, useState } from 'react';
import { CurrencyCode, currencyRates } from '../lib/currencyConfig';
import { convertAndFormatPrice } from '../lib/currencyUtils';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (priceInUSD: number) => string;
  rates: Record<CurrencyCode, number>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('skyway_currency');
    return (saved as CurrencyCode) || 'USD';
  });

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('skyway_currency', code);
  };

  const formatPrice = (priceInUSD: number) => {
    return convertAndFormatPrice(priceInUSD, currency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, rates: currencyRates }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};

