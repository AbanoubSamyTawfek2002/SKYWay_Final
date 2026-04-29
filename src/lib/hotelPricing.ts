export function calculateHotelPrice({
  basePrice,
  nights = 1,
  rooms = [],
  category = 'standard'
}: {
  basePrice: number;
  nights?: number;
  rooms?: any[];
  category?: string;
}) {
  const EXTRA_ADULT_RATE = 0.25;   // Each extra adult = +25% of base
  const CHILD_RATE = 0.70;         // Each child = 70% of base
  const TAX_RATE = 0.15;           // 15% tax

  let totalPerNight = 0;
  let breakdown = {
    basePrice: 0,
    extraGuestsPrice: 0,
    taxes: 0,
    roomsCount: 0,
    totalGuests: 0,
    subtotal: 0
  };

  // If no rooms are provided, assume 1 room with 1 adult
  const activeRooms = rooms.length > 0 ? rooms : [{ adults: 1, children: 0 }];

  activeRooms.forEach((room) => {
    const adults = room.adults || 1;
    const children = room.children || 0;
    
    breakdown.roomsCount += 1;
    breakdown.totalGuests += (adults + children);

    let roomCost = basePrice; // 1st adult included in basePrice
    
    // Calculate extra adults cost
    if (adults > 1) {
      const extraAdultsCost = (adults - 1) * (basePrice * EXTRA_ADULT_RATE);
      roomCost += extraAdultsCost;
      breakdown.extraGuestsPrice += extraAdultsCost * nights;
    }

    // Calculate children cost
    if (children > 0) {
      const childrenCost = children * (basePrice * CHILD_RATE);
      roomCost += childrenCost;
      breakdown.extraGuestsPrice += childrenCost * nights;
    }

    totalPerNight += roomCost;
    breakdown.basePrice += basePrice * nights;
  });

  const subtotal = totalPerNight * nights;
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + tax;

  breakdown.subtotal = subtotal;
  breakdown.taxes = tax;

  return {
    totalPerNight,
    subtotal,
    tax,
    grandTotal,
    breakdown
  };
}
