import { CurrencyCode, currencyRates, currencySymbols } from './currencyConfig';

/**
 * Converts a base USD price to the target currency.
 * Applies any domain-specific conversions (like converting cents to dollars).
 * 
 * @param priceInUSD The price in USD or cents (depends on entity).
 * @param currency The target currency string.
 * @param isFlight Boolean to check if the entity is a flight (which stores price in cents).
 * @returns Formatted price string with the currency symbol.
 */
export const convertAndFormatPrice = (
  priceInUSD: number, 
  currency: CurrencyCode, 
  isFlight: boolean = false
): string => {
  // Flights are stored in cents, so we divide by 100 first
  const basePriceUSD = isFlight ? Math.round(priceInUSD / 100) : priceInUSD;
  const converted = basePriceUSD * currencyRates[currency];
  const symbol = currencySymbols[currency];
  
  const formattedValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(converted);

  return `${symbol}${formattedValue}`;
};
