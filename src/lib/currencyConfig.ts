export type CurrencyCode = 'USD' | 'EGP' | 'EUR' | 'AED';

export const currencyRates: Record<CurrencyCode, number> = {
  USD: 1,
  EGP: 50,
  EUR: 0.92,
  AED: 3.67
};

export const currencySymbols: Record<CurrencyCode, string> = {
  USD: '$',
  EGP: 'EGP ',
  EUR: '€',
  AED: 'AED '
};
