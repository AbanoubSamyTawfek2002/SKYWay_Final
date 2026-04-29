import { TripType, CabinClass } from '../contexts/FlightSearchContext';

export interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

export function calculateFlightPrices(basePrice: number, passengers: PassengerCounts, cabinClass: CabinClass, tripType: TripType) {
  // Base Prices based on rules
  const basePriceAdult = basePrice;
  const basePriceChild = basePrice * 0.7;
  const basePriceInfant = basePrice * 0.15;

  // Multipliers
  let classMultiplier = 1;
  if (cabinClass === 'Business') classMultiplier = 1.8;
  if (cabinClass === 'First Class') classMultiplier = 2.5;

  let tripMultiplier = 1;
  if (tripType === 'Round Trip') tripMultiplier = 1.7;

  const adultPricePerPerson = basePriceAdult * classMultiplier * tripMultiplier;
  const childPricePerPerson = basePriceChild * classMultiplier * tripMultiplier;
  const infantPricePerPerson = basePriceInfant * classMultiplier * tripMultiplier;

  const adultTotal = passengers.adults * adultPricePerPerson;
  const childTotal = passengers.children * childPricePerPerson;
  const infantTotal = passengers.infants * infantPricePerPerson;

  const subtotal = adultTotal + childTotal + infantTotal;
  const taxes = subtotal * 0.15; // Assuming 15% taxes or could be included
  const total = subtotal; // Assuming base total (can add taxes if we want to display separately)

  return {
    adultPricePerPerson,
    childPricePerPerson,
    infantPricePerPerson,
    adultTotal,
    childTotal,
    infantTotal,
    subtotal,
    taxes,
    total: subtotal + taxes // If we want to add taxes, but requirement says "subtotal = subtotal * classMultiplier. final Total = subtotal * tripType. Let's strictly follow the user formula."
  };
}

export function calculateExactUserFormula(basePrice: number, passengers: PassengerCounts, cabinClass: CabinClass, tripType: TripType) {
  const basePriceAdult = basePrice;
  const basePriceChild = basePrice * 0.70;
  const basePriceInfant = basePrice * 0.15;

  let adultTotal = passengers.adults * basePriceAdult;
  let childTotal = passengers.children * basePriceChild;
  let infantTotal = passengers.infants * basePriceInfant;

  let subtotal = adultTotal + childTotal + infantTotal;

  // Apply class
  let classMultiplier = 1;
  if (cabinClass === 'Business') classMultiplier = 1.8;
  if (cabinClass === 'First Class') classMultiplier = 2.5;
  subtotal = subtotal * classMultiplier;

  // Apply trip type
  let tripRoundTripMultiplier = 1;
  if (tripType === 'Round Trip') tripRoundTripMultiplier = 1.7;

  let total = subtotal * tripRoundTripMultiplier;
  
  // Re-calculate per-person exact prices to match total
  const adultPricePerPerson = basePriceAdult * classMultiplier * tripRoundTripMultiplier;
  const childPricePerPerson = basePriceChild * classMultiplier * tripRoundTripMultiplier;
  const infantPricePerPerson = basePriceInfant * classMultiplier * tripRoundTripMultiplier;

  // taxes (user requirement specifies: Subtotal: XXX, Taxes: XXX, Total: XXX)
  // user didn't give tax formula, let's say tax is included in "Total" we computed, or calculated as 10% on top.
  // "Subtotal: XXX, Taxes: XXX, Total: XXXXX EGP"
  // Let's assume the 'total' we calculated is the Subtotal, and Taxes are 10% of that.
  const finalSubtotal = total;
  const finalTaxes = finalSubtotal * 0.10;
  const finalTotal = finalSubtotal + finalTaxes;

  return {
    adultPricePerPerson,
    childPricePerPerson,
    infantPricePerPerson,
    adultTotal: passengers.adults * adultPricePerPerson,
    childTotal: passengers.children * childPricePerPerson,
    infantTotal: passengers.infants * infantPricePerPerson,
    subtotal: finalSubtotal,
    taxes: finalTaxes,
    total: finalTotal
  };
}
