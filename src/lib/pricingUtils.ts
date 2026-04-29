export const calculateRentalDuration = (pickUpDate?: Date | string, dropOffDate?: Date | string): number => {
  if (!pickUpDate || !dropOffDate) return 1;
  
  const start = new Date(pickUpDate);
  const end = new Date(dropOffDate);
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 1;
};

export const calculateCarTotalPrice = (pricePerDay: number, durationDays: number): number => {
  return durationDays * pricePerDay;
};
