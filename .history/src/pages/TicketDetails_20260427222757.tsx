import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plane, Hotel, Car, MapPin, Calendar, CheckCircle2, Download, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

// Reusing PDF generation from component
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BookingTicket } from '../components/BookingTicket';

export default function TicketDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { formatPrice } = useCurrency();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBooking(data);
        } else {
          console.error('Failed to fetch booking');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (bookingId && token) {
      fetchBooking();
    }
  }, [bookingId, token]);

  const handleDownloadPDF = async () => {
    if (!ticketRef.current || !booking) return;
    try {
      setDownloading(true);
      const element = ticketRef.current;
      element.style.display = 'block';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '-9999px';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (doc) => {
          // Replace unsupported oklch colors with standard hex to prevent html2canvas CSS parser from crashing
          const styles = doc.querySelectorAll('style');
          styles.forEach(style => {
            if (style.innerHTML.includes('oklch')) {
               style.innerHTML = style.innerHTML.replace(/oklch\([^)]+\)/g, '#000000');
            }
          });
          const iframeWindow = doc.defaultView;
          if (iframeWindow) {
            const origGetComputedStyle = iframeWindow.getComputedStyle;
            iframeWindow.getComputedStyle = function(el, pseudoElt) {
              const style = origGetComputedStyle(el, pseudoElt);
              return new Proxy(style, {
                get(target, prop, receiver) {
                  if (prop === 'getPropertyValue') {
                    return function(propName: string) {
                      const val = target.getPropertyValue(propName);
                      if (val && typeof val === 'string' && val.includes('oklch')) {
                        if (propName.includes('color')) return '#000000';
                        return 'transparent';
                      }
                      return val;
                    }
                  }
                  const val = Reflect.get(target, prop, receiver);
                  if (typeof val === 'string' && val.includes('oklch')) {
                    if (typeof prop === 'string' && prop.toLowerCase().includes('color')) return '#000000';
                    return 'transparent';
                  }
                  return val;
                }
              });
            };
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`skyway-ticket-${booking.type}-${booking.bookingReference || booking._id}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
    } finally {
      setDownloading(false);
      if (ticketRef.current) {
        ticketRef.current.style.display = 'none';
      }
    }
  };

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

  const AirlineLogo = ({ airline, logo, className }: { airline: string, logo?: string, className?: string }) => {
    const logoSrc = getAirlineLogo(airline) || logo;
    const [error, setError] = useState(false);

    if (error || !logoSrc) {
      return (
        <div className={`rounded-2xl bg-white/20 flex items-center justify-center font-black italic p-2 ${className}`}>
          {airline?.substring(0, 3).toUpperCase() || '✈️'}
        </div>
      );
    }

    return (
      <div className={`rounded-2xl bg-white/20 flex items-center justify-center p-2 ${className}`}>
        <img 
          src={logoSrc} 
          alt={airline} 
          className="max-w-full max-h-full object-contain filter invert"
          onError={() => setError(true)}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center min-h-[70vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-[70vh]">
        <h1 className="text-3xl font-black uppercase tracking-widest italic text-destructive">Booking Not Found</h1>
        <Button onClick={() => navigate('/my-bookings')} className="mt-8 rounded-xl font-bold uppercase tracking-widest h-14 px-8">
          Go back to My Bookings
        </Button>
      </div>
    );
  }

  const { type } = booking;
  const item = booking.flightId || booking.hotelId || booking.carId;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hidden element for PDF generation */}
      <div style={{ display: 'none' }}>
         <BookingTicket 
            ref={ticketRef} 
            bookingData={{ ...booking, item, passengerNames: booking.passengers?.map((p:any) => p.name) }} 
            amount={booking.totalAmount} 
            transactionId={booking.bookingReference || booking._id} 
         />
      </div>

      <div className="flex flex-col items-center max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700 fade-in zoom-in-95">
        <div className="flex justify-between w-full items-end border-b border-border/50 pb-6">
          <div>
            <span className="inline-flex bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Official E-Ticket</span>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Your Ticket Details</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/my-bookings')} className="rounded-xl font-bold uppercase tracking-widest h-12 shadow-sm border-2">
              Back
            </Button>
            <Button onClick={handleDownloadPDF} disabled={downloading} className="rounded-xl font-black uppercase tracking-widest h-12 shadow-xl hover:shadow-primary/20 bg-black text-white hover:bg-black/80">
              {downloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              {downloading ? 'Preparing...' : 'Download PDF'}
            </Button>
          </div>
        </div>

        {type === 'flight' && item && booking.passengers?.length > 0 ? (
          <div className="w-full flex gap-8 flex-col">
            {booking.passengers.map((passenger: any, pIndex: number) => (
              <Card key={pIndex} className="w-full border-none shadow-2xl bg-background/50 backdrop-blur rounded-[40px] overflow-hidden">
                <div className="bg-primary p-8 flex justify-between items-center text-primary-foreground">
                  <div className="flex items-center gap-4">
                    <AirlineLogo airline={item.airline} logo={item.airlineLogo} className="w-16 h-16 text-2xl" />
                    <div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">{item.airline}</h2>
                      <p className="text-sm font-bold opacity-80 mt-1 uppercase tracking-widest">Flight {item.flightNumber || 'XY123'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Ticket {pIndex + 1}</p>
                    <QRCodeSVG value={`https://skyway.com/verify/${passenger.ticketNumber || booking.bookingReference}`} size={64} className="bg-white p-1 rounded-lg" />
                  </div>
                </div>

                <div className="p-10 space-y-8">
                  <div className="flex justify-between items-center text-center">
                    <div className="w-1/3 text-left">
                      <p className="text-5xl font-black uppercase tracking-tighter italic leading-none text-primary">{item.from?.substring(0, 3).toUpperCase()}</p>
                      <p className="text-lg font-bold text-muted-foreground mt-2">{item.from}</p>
                      <p className="text-sm font-black mt-2">{formattedDate(item.departureTime || '10:00 AM')}</p>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center px-4 relative">
                      <div className="w-full h-px border-t-2 border-dashed border-border absolute top-1/2 -translate-y-1/2" />
                      <Plane className="w-8 h-8 text-primary relative z-10 bg-background px-1" />
                      <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mt-4 relative z-10 bg-background px-2">
                         {item.duration || 'Duration varies'}
                      </p>
                    </div>
                    
                    <div className="w-1/3 text-right">
                      <p className="text-5xl font-black uppercase tracking-tighter italic leading-none text-primary">{item.to?.substring(0, 3).toUpperCase()}</p>
                      <p className="text-lg font-bold text-muted-foreground mt-2">{item.to}</p>
                      <p className="text-sm font-black mt-2">{formattedDate(item.arrivalTime || '02:00 PM')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Passenger</p>
                      <p className="font-black text-lg truncate" title={passenger.name}>{passenger.name}</p>
                    </div>
                    <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Boarding</p>
                      <p className="font-black text-lg text-red-500">09:15 AM</p>
                    </div>
                    <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Gate</p>
                      <p className="font-black text-lg">G42</p>
                    </div>
                    <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Seat</p>
                      <p className="font-black text-lg">{passenger.seat}</p>
                    </div>
                  </div>

                  <div className="bg-red-50 text-red-600 p-5 rounded-2xl border border-red-100 flex items-start gap-4">
                    <div className="bg-red-100 p-2 rounded-full"><Info size={20} className="text-red-600" /></div>
                    <div>
                      <p className="font-black uppercase tracking-widest text-sm mb-1">Important Notice</p>
                      <p className="text-sm font-semibold text-red-800">Please arrive at the airport at least 4 hours before departure. Identification is required at boarding.</p>
                    </div>
                  </div>
                </div>
                
                {/* Footer for single ticket */}
                <div className="bg-muted/50 p-10 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Ticket Number</p>
                      <p className="font-mono font-black text-lg tracking-widest">{passenger.ticketNumber}</p>
                   </div>
                   <div className="text-center md:text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Booking Ref</p>
                      <p className="font-mono font-black text-lg tracking-widest text-primary">{booking.bookingReference || booking._id}</p>
                   </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="w-full border-none shadow-2xl bg-background/50 backdrop-blur rounded-[40px] overflow-hidden">
            {type === 'flight' && item && (
              <div>
                <div className="bg-primary p-8 flex justify-between items-center text-primary-foreground">
                  <div className="flex items-center gap-4">
                    <AirlineLogo airline={item.airline} logo={item.airlineLogo} className="w-16 h-16 text-2xl" />
                    <div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">{item.airline}</h2>
                      <p className="text-sm font-bold opacity-80 mt-1 uppercase tracking-widest">Flight {item.flightNumber || 'XY123'}</p>
                    </div>
                  </div>
                  <QRCodeSVG value={`https://skyway.com/verify/${booking.bookingReference || booking._id}`} size={64} className="bg-white p-1 rounded-lg" />
                </div>

                <div className="p-10 space-y-8">
                  <div className="flex justify-between items-center text-center">
                    <div className="w-1/3 text-left">
                      <p className="text-5xl font-black uppercase tracking-tighter italic leading-none text-primary">{item.from?.substring(0, 3).toUpperCase()}</p>
                      <p className="text-lg font-bold text-muted-foreground mt-2">{item.from}</p>
                      <p className="text-sm font-black mt-2">{formattedDate(item.departureTime || '10:00 AM')}</p>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center px-4 relative">
                      <div className="w-full h-px border-t-2 border-dashed border-border absolute top-1/2 -translate-y-1/2" />
                      <Plane className="w-8 h-8 text-primary relative z-10 bg-background px-1" />
                      <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mt-4 relative z-10 bg-background px-2">
                         {item.duration || 'Duration varies'}
                      </p>
                    </div>
                    
                    <div className="w-1/3 text-right">
                      <p className="text-5xl font-black uppercase tracking-tighter italic leading-none text-primary">{item.to?.substring(0, 3).toUpperCase()}</p>
                      <p className="text-lg font-bold text-muted-foreground mt-2">{item.to}</p>
                      <p className="text-sm font-black mt-2">{formattedDate(item.arrivalTime || '02:00 PM')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Date</p>
                      <p className="font-black text-sm">{formattedDate(booking.createdAt)}</p>
                    </div>
                    <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Boarding</p>
                      <p className="font-black text-lg text-red-500">09:15 AM</p>
                    </div>
                    <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Gate</p>
                      <p className="font-black text-lg">G42</p>
                    </div>
                    <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Seat</p>
                      <p className="font-black text-lg">{item.class === 'First' ? '1A' : '12B'}</p>
                    </div>
                  </div>

                  <div className="bg-red-50 text-red-600 p-5 rounded-2xl border border-red-100 flex items-start gap-4">
                    <div className="bg-red-100 p-2 rounded-full"><Info size={20} className="text-red-600" /></div>
                    <div>
                      <p className="font-black uppercase tracking-widest text-sm mb-1">Important Notice</p>
                      <p className="text-sm font-semibold text-red-800">Please arrive at the airport at least 4 hours before departure. Identification is required at boarding.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {type === 'hotel' && item && (
            <div>
              <div className="bg-primary p-8 flex justify-between items-center text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <img src={item.images?.[0]} alt="Hotel" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Hotel size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">{item.name}</h2>
                    <p className="text-sm font-bold opacity-80 mt-1 flex items-center gap-2"><MapPin size={14}/> {item.city}, {item.country}</p>
                  </div>
                </div>
                <QRCodeSVG value={`https://skyway.com/verify/${booking.bookingReference || booking._id}`} size={64} className="bg-white p-1 rounded-lg relative z-10" />
              </div>

              <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-muted/30 p-6 rounded-3xl border border-border/50 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4"><Calendar className="text-primary w-5 h-5"/></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Check-in</p>
                    <p className="font-black text-xl tracking-tighter italic">{formattedDate(booking.createdAt)}</p>
                    <p className="text-sm text-primary font-bold">From 3:00 PM</p>
                  </div>
                  <div className="bg-muted/30 p-6 rounded-3xl border border-border/50 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4"><Calendar className="text-primary w-5 h-5"/></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Check-out</p>
                    <p className="font-black text-xl tracking-tighter italic">{formattedDate(new Date(new Date(booking.createdAt).getTime() + (booking.nights || 1) * 24 * 60 * 60 * 1000))}</p>
                    <p className="text-sm text-primary font-bold">Until 11:00 AM</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/20 p-5 rounded-2xl border border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Guests</p>
                    <p className="font-black text-lg">{booking.totalGuests || 1} Guest{(booking.totalGuests || 1) > 1 ? 's' : ''}</p>
                  </div>
                  <div className="bg-muted/20 p-5 rounded-2xl border border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Nights</p>
                    <p className="font-black text-lg">{booking.nights || 1}</p>
                  </div>
                  <div className="bg-muted/20 p-5 rounded-2xl border border-border/50 col-span-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Room Type</p>
                    <p className="font-black text-lg">{booking.rooms?.length > 0 ? `${booking.rooms.length} Room${booking.rooms.length > 1 ? 's' : ''}` : 'Standard Room'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {type === 'car' && item && (
            <div>
              <div className="bg-primary p-8 flex justify-between items-center text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <img src={item.imageUrl} alt="Car" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Car size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">{item.name}</h2>
                    <p className="text-sm font-bold opacity-80 mt-1 uppercase tracking-widest">{item.category}</p>
                  </div>
                </div>
                <QRCodeSVG value={`https://skyway.com/verify/${booking.bookingReference || booking._id}`} size={64} className="bg-white p-1 rounded-lg relative z-10" />
              </div>

              <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-muted/30 p-6 rounded-3xl border border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 flex flex-center gap-2"><MapPin size={14}/> Pick-up</p>
                    <p className="font-black text-xl italic mb-1">
                      {typeof item.location === 'string' 
                        ? item.location 
                        : (item.location?.name || (item.location?.lat ? `${item.location.lat}, ${item.location.lng}` : 'Airport Terminal 1'))
                      }
                    </p>
                    <p className="text-sm font-bold text-muted-foreground">{formattedDate(booking.createdAt)}</p>
                  </div>
                  <div className="bg-muted/30 p-6 rounded-3xl border border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 flex flex-center gap-2"><MapPin size={14}/> Drop-off</p>
                    <p className="font-black text-xl italic mb-1">
                      {typeof item.location === 'string' 
                        ? item.location 
                        : (item.location?.name || (item.location?.lat ? `${item.location.lat}, ${item.location.lng}` : 'Airport Terminal 1'))
                      }
                    </p>
                    <p className="text-sm font-bold text-muted-foreground">{formattedDate(new Date(new Date(booking.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000))}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted/20 p-5 rounded-2xl border border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Seats</p>
                    <p className="font-black text-lg">{item.seats}</p>
                  </div>
                  <div className="bg-muted/20 p-5 rounded-2xl border border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Transmission</p>
                    <p className="font-black text-lg capitalize">{item.transmission || 'Automatic'}</p>
                  </div>
                  <div className="bg-muted/20 p-5 rounded-2xl border border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Duration</p>
                    <p className="font-black text-lg">3 Days</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Common Footer for all types */}
          <div className="bg-muted/50 p-10 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Booking Serial Number</p>
                <p className="font-mono font-black text-lg tracking-widest">{booking.bookingReference || booking._id}</p>
             </div>
             <div className="text-center md:text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Paid</p>
                <p className="font-black text-4xl italic text-primary">{formatPrice(booking.totalAmount)}</p>
                <div className="flex items-center justify-center md:justify-end gap-1 text-green-600 mt-2">
                  <CheckCircle2 size={16} className="fill-green-100" />
                  <span className="text-xs font-black uppercase tracking-widest">Payment Confirmed</span>
                </div>
             </div>
          </div>
        </Card>
        )}
      </div>
    </div>
  );
}
