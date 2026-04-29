import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Plane, Hotel, Car, MapPin, Clock, CalendarDays, Users, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import { format } from 'date-fns';

interface BookingTicketProps {
  bookingData: any;
  amount: number;
  transactionId: string;
}

export const BookingTicket = forwardRef<HTMLDivElement, BookingTicketProps>(
  ({ bookingData, amount, transactionId }, ref) => {
    const { formatPrice } = useCurrency();
    const { type, item } = bookingData;
    
    const currentDate = new Date();
    
    const checkInDate = bookingData.createdAt ? new Date(bookingData.createdAt) : new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const checkOutDate = new Date(checkInDate.getTime() + ((bookingData.nights || bookingData.durationDays || 3) * 24 * 60 * 60 * 1000));
    const totalGuests = bookingData.totalGuests || 1;
    const durationDays = bookingData.nights || bookingData.durationDays || 3;
    const roomType = bookingData.rooms?.length > 0 ? `${bookingData.rooms.length} Room${bookingData.rooms.length > 1 ? 's' : ''}` : 'Standard Room';

    const formattedDate = (date: Date | string) => {
      try {
        const d = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(d.getTime())) return 'Invalid Date';
        return format(d, 'dd MMM yyyy, hh:mm a');
      } catch (e) {
        return 'Invalid Date';
      }
    };

    const getAirlineLogo = (airline: string) => {
      const logos: Record<string, string> = {
        'Emirates': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/200px-Emirates_logo.svg.png',
        'EgyptAir': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Egyptair.svg/200px-Egyptair.svg.png',
        'Nile Air': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Nile_Air_logo.svg/200px-Nile_Air_logo.svg.png',
        'FlyDubai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Flydubai_logo.svg/200px-Flydubai_logo.svg.png',
        'Qatar Airways': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Qatar_Airways_logo.svg/200px-Qatar_Airways_logo.svg.png',
        'Saudia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Saudia_logo.svg/200px-Saudia_logo.svg.png'
      };
      return logos[airline] || null;
    };

    const AirlineLogo = ({ airline, logo }: { airline: string, logo?: string }) => {
      const logoSrc = getAirlineLogo(airline) || logo;
      const [error, setError] = React.useState(false);

      if (error || !logoSrc) {
        return (
          <div className="w-full h-full bg-[#2563eb] rounded-lg flex items-center justify-center p-1 text-white font-black italic text-xs text-center leading-tight">
            {airline?.substring(0, 3).toUpperCase() || '✈️'}
          </div>
        );
      }

      return (
        <img 
          src={logoSrc} 
          alt={airline} 
          className="max-w-full max-h-full object-contain"
          onError={() => setError(true)}
        />
      );
    };

    const passengerName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).name : 'Valued Customer';

    const isFlight = type === 'flight' && item;
    const passengersToRender = isFlight && bookingData?.passengers?.length > 0 
      ? bookingData.passengers.map((p: any, i: number) => ({
          ...p,
          name: p.name || bookingData.passengerNames?.[i] || 'Passenger',
          seat: p.seat || ['12A', '12B', '12C', '14A', '14B', '14C'][i % 6],
          ticketNumber: p.ticketNumber || `VANGUARD-${transactionId}-${i}`
        }))
      : [{ name: passengerName, type: 'Adult', seat: '12B'}];

    return (
      <div ref={ref} className="flex flex-col gap-8 w-[800px] bg-transparent text-[#000000] font-sans shrink-0 relative overflow-visible">
          {passengersToRender.map((passengerInfo: any, pIndex: number) => (
            <div 
              key={pIndex} 
              className="w-full bg-[#ffffff] rounded-3xl overflow-hidden relative font-sans shadow-sm"
              style={{
                boxSizing: 'border-box',
                '--background': '#ffffff',
                '--foreground': '#000000',
                /* ... other variables ... */
              } as React.CSSProperties}
            >
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#000000] flex items-center justify-center border-r-[2px] border-dashed border-[#ffffff]/30">
                <span className="text-[#ffffff] whitespace-nowrap -rotate-90 font-black tracking-[0.5em] text-[10px] uppercase opacity-50">BOARDING PASS</span>
              </div>

              <div className="pl-8 flex w-full">
                {/* Left Section */}
                <div className="flex-1 p-8 relative bg-[#ffffff] border-r-2 border-dashed border-[#e2e8f0]">
                  <Plane className="absolute right-10 top-1/2 -translate-y-1/2 w-96 h-96 text-[#f8fafc] opacity-50 pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      <h1 className="text-3xl font-black uppercase tracking-tighter italic">Vanguard.</h1>
                      <div className="flex gap-4 mt-2 text-xs font-bold text-[rgba(0,0,0,0.4)] uppercase tracking-widest">
                        <span>Ref <span className="text-[rgba(0,0,0,0.8)] font-black">{transactionId.substring(0, 8)}</span></span>
                        <span>•</span>
                        <span>Issued <span className="text-[rgba(0,0,0,0.8)] font-black">{formattedDate(new Date())}</span></span>
                      </div>
                    </div>
                    {/* Security Badge */}
                    <div className="flex items-center gap-2 bg-[#f8fafc] px-4 py-2 rounded-lg border border-[#e2e8f0]">
                      <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#2563eb]">Verified Secure</span>
                    </div>
                  </div>

                  {/* Flight/Hotel Specific Content */}
                  {isFlight ? (
                      <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-center bg-[#f8fafc] p-6 rounded-2xl border border-[#e2e8f0]">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-[#ffffff] rounded-xl border border-[#f1f5f9] flex items-center justify-center p-2" style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                              <AirlineLogo airline={item.airline} logo={item.airlineLogo} />
                            </div>
                            <div>
                              <h2 className="text-xl font-black uppercase">{item.airline}</h2>
                              <p className="text-sm font-bold text-[rgba(0,0,0,0.5)]">Flight {item.flightNumber || 'XY123'}</p>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            <p className="text-sm font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-widest mb-1">Passenger</p>
                            <div className="flex justify-end items-center gap-2">
                                <span className="font-bold text-lg uppercase">{passengerInfo.name}</span>
                                <span className="bg-[#e2e8f0] px-2 py-0.5 rounded text-[10px] uppercase font-bold text-[rgba(0,0,0,0.6)]">{passengerInfo.type}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-6 px-4">
                          <div className="text-center w-1/3">
                            <p className="text-5xl font-black uppercase tracking-tighter">{item.from?.substring(0, 3).toUpperCase()}</p>
                            <p className="text-sm font-bold text-[rgba(0,0,0,0.6)] mt-2">{item.from}</p>
                            <p className="text-sm font-black mt-1 text-[#2563eb]">{item.departureTime || '10:00 AM'}</p>
                          </div>
                          
                          <div className="flex-1 flex flex-col items-center px-4 relative">
                            <div className="w-full h-[2px] bg-[#e2e8f0] absolute top-1/2 -translate-y-1/2" />
                            <Plane className="w-8 h-8 text-[#2563eb] relative z-10 bg-[#ffffff] px-1" />
                            <p className="text-xs font-bold text-[rgba(0,0,0,0.4)] uppercase tracking-widest mt-4 relative z-10 bg-[#ffffff] px-2">
                              {item.duration || 'Duration varies'}
                            </p>
                          </div>

                          <div className="text-center w-1/3">
                            <p className="text-5xl font-black uppercase tracking-tighter">{item.to?.substring(0, 3).toUpperCase()}</p>
                            <p className="text-sm font-bold text-[rgba(0,0,0,0.6)] mt-2">{item.to}</p>
                            <p className="text-sm font-black mt-1 text-[#2563eb]">{item.arrivalTime || '02:00 PM'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 bg-[#f8fafc] p-6 rounded-2xl border border-[#e2e8f0]">
                          <div>
                            <p className="text-xs font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-widest">Date</p>
                            <p className="font-black mt-1 text-sm">{formattedDate(checkInDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-widest">Boarding</p>
                            <p className="font-black mt-1 text-[#dc2626]">09:15 AM</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-widest">Gate</p>
                            <p className="font-black mt-1">G42</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-widest">Seat</p>
                            <p className="font-black mt-1">{item.class === 'First' ? '1A' : passengerInfo.seat}</p>
                          </div>
                        </div>
                      </div>
                  ) : (
                    <div className="space-y-6 relative z-10 w-[700px] bg-[#ffffff] p-8 -ml-8 -mt-8 rounded-3xl border border-[#e2e8f0]">
                      {/* HOTEL or CAR content */}
                      {!isFlight && type === 'hotel' && item && (
                        <>
                          <div className="flex gap-6">
                            {item.images && item.images[0] ? (
                              <img src={item.images[0]} alt={item.name} className="w-48 h-48 object-cover rounded-2xl" />
                            ) : (
                              <div className="w-48 h-48 bg-[#e2e8f0] rounded-2xl flex items-center justify-center">
                                <Hotel className="w-12 h-12 text-[#94a3b8]" />
                              </div>
                            )}
                            <div className="flex-1 flex flex-col justify-center">
                              <h2 className="text-3xl font-black uppercase leading-tight">{item.name}</h2>
                              <div className="flex items-center gap-2 text-[rgba(0,0,0,0.6)] mt-2 font-bold">
                                <MapPin size={16} />
                                <span>{item.address || item.city}</span>
                              </div>
                              <div className="flex items-center gap-6 mt-6 border-t border-[rgba(0,0,0,0.1)] pt-4">
                                <div>
                                  <p className="text-xs font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-widest">Total Guests</p>
                                  <p className="text-lg font-black mt-1 flex items-center gap-2"><Users size={16}/> {totalGuests}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-widest">Room Type</p>
                                  <p className="text-lg font-black mt-1">{roomType}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-widest">Pricing</p>
                                  <p className="text-lg font-black mt-1">{formatPrice(amount / durationDays)} <span className="text-sm font-bold text-[rgba(0,0,0,0.5)]">/ {durationDays} Night{durationDays !== 1 ? 's' : ''}</span></p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#f8fafc] p-6 rounded-2xl border border-[#e2e8f0] flex items-center justify-between">
                              <div>
                                <p className="text-xs font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-widest">Check-In</p>
                                <p className="text-lg font-black mt-1">{formattedDate(checkInDate)}</p>
                                <p className="text-sm font-bold text-[#2563eb] mt-1">From 3:00 PM</p>
                              </div>
                            </div>
                            <div className="bg-[#f8fafc] p-6 rounded-2xl border border-[#e2e8f0] flex items-center justify-between">
                              <div>
                                <p className="text-xs font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-widest">Check-Out</p>
                                <p className="text-lg font-black mt-1">{formattedDate(checkOutDate)}</p>
                                <p className="text-sm font-bold text-[#2563eb] mt-1">Until 11:00 AM</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {!isFlight && type === 'car' && item && (
                        <>
                          <div className="flex gap-6 items-center bg-[#f8fafc] p-6 rounded-2xl border border-[#e2e8f0]">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.brand ? `${item.brand} ${item.model}` : 'Car'} className="w-48 h-32 object-cover rounded-xl bg-[#ffffff] p-2" />
                            ) : (
                              <div className="w-48 h-32 bg-[#e2e8f0] rounded-xl flex items-center justify-center">
                                <Car className="w-12 h-12 text-[#94a3b8]" />
                              </div>
                            )}
                            <div>
                              <h2 className="text-3xl font-black uppercase leading-tight">{item.brand ? `${item.brand} ${item.model}` : item.name || 'Car Rental'}</h2>
                              <span className="inline-block bg-[#000000] text-[#ffffff] px-3 py-1 rounded text-xs font-black uppercase tracking-widest mt-2">{item.category}</span>
                              <div className="flex gap-6 mt-4 border-t border-[rgba(0,0,0,0.1)] pt-4">
                                <div>
                                  <p className="text-xs font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-widest">Seats</p>
                                  <p className="font-black mt-1">{item.seats}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-widest">Transmission</p>
                                  <p className="font-black mt-1 uppercase">{item.transmission || 'Auto'}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-widest">Pricing</p>
                                  <p className="font-black mt-1 uppercase">{formatPrice(amount / durationDays)} <span className="text-xs font-bold text-[rgba(0,0,0,0.5)]">/ {durationDays} Day{durationDays !== 1 ? 's' : ''}</span></p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="border border-[#e2e8f0] p-5 rounded-xl">
                              <div className="flex items-center gap-2 text-[#2563eb] font-black uppercase tracking-widest mb-3">
                                <MapPin size={16} /> Pickup
                              </div>
                              <p className="font-bold text-lg">
                                {typeof item.location === 'string' 
                                  ? item.location 
                                  : (item.location?.name || (item.location?.lat ? `${item.location.lat}, ${item.location.lng}` : 'Airport Terminal 1'))
                                }
                              </p>
                              <p className="text-[rgba(0,0,0,0.6)] font-bold text-sm mt-1">{formattedDate(checkInDate)}</p>
                            </div>
                            <div className="border border-[#e2e8f0] p-5 rounded-xl">
                              <div className="flex items-center gap-2 text-[#2563eb] font-black uppercase tracking-widest mb-3">
                                <MapPin size={16} /> Drop-off
                              </div>
                              <p className="font-bold text-lg">
                                {typeof item.location === 'string' 
                                  ? item.location 
                                  : (item.location?.name || (item.location?.lat ? `${item.location.lat}, ${item.location.lng}` : 'Airport Terminal 1'))
                                }
                              </p>
                              <p className="text-[rgba(0,0,0,0.6)] font-bold text-sm mt-1">{formattedDate(checkOutDate)}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Section (Stub & QR) */}
                <div className="w-64 bg-[#f8fafc] p-8 flex flex-col justify-between relative">
                  {/* Perforated border circles overlay */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 overflow-hidden -translate-x-1/2 flex flex-col justify-around py-4 opacity-30">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-3 h-3 rounded-full bg-[#f1f5f9]" />
                    ))}
                  </div>

                  <div>
                    <h3 className="font-black text-xl tracking-tighter uppercase italic">{isFlight ? item?.to?.substring(0, 3) || 'DEST' : 'TICKET'}</h3>
                    <p className="text-sm font-bold text-[rgba(0,0,0,0.5)] bg-[#ffffff] px-2 py-1 inline-block rounded mt-2">{passengerInfo.name}</p>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center py-6">
                    <div className="bg-[#ffffff] p-3 rounded-2xl shadow-sm border border-[#e2e8f0]">
                      <QRCodeSVG 
                        value={`https://skyway.com/verify/${passengerInfo.ticketNumber || `VANGUARD-${transactionId}-${pIndex}`}`} 
                        size={120}
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"Q"}
                      />
                    </div>
                    <p className="text-[10px] font-mono text-[rgba(0,0,0,0.4)] mt-3 tracking-widest">{passengerInfo.ticketNumber || `${transactionId}-${pIndex}`}</p>
                  </div>
                  
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[rgba(0,0,0,0.4)] text-center">Vanguard Priority Pass</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Footer / Summary (for non-flight) */}
          {!isFlight && (
            <div className="mt-8 pt-8 border-t-2 border-[rgba(0,0,0,0.1)] flex justify-between items-end relative z-10 w-full bg-[#ffffff] p-8 rounded-3xl shadow-sm">
              <div className="flex items-center gap-6">
                <div className="p-2 bg-[#ffffff] border-2 border-[#e2e8f0] rounded-xl">
                  <QRCodeSVG value={`https://skyway.com/verify/${transactionId}`} size={80} level="H" />
                </div>
                <div>
                  <p className="text-xl font-black italic">Thank you for choosing SkyWay.</p>
                  <p className="text-sm font-bold text-[rgba(0,0,0,0.5)] mt-1">Customer Support: +1 (800) SKY-9999</p>
                  <p className="text-sm font-bold text-[rgba(0,0,0,0.5)]">support@skyway.com</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-widest">Total Price Paid</p>
                <p className="text-4xl font-black text-[#2563eb] italic">{formatPrice(amount)}</p>
                <div className="flex items-center justify-end gap-1 text-[#16a34a] mt-2">
                  <CheckCircle2 size={16} className="fill-[#dcfce3]" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#15803d]">Payment Confirmed</span>
                </div>
              </div>
            </div>
          )}

        </div>
      );
    }
  );
  
  BookingTicket.displayName = 'BookingTicket';
