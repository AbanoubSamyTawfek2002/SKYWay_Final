import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Loader2, Plane, Hotel, Car, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrency } from '../contexts/CurrencyContext';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { BookingTicket } from '../components/BookingTicket';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  const [verifying, setVerifying] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const { bookingData, amount, transactionId } = location.state || {};

  useEffect(() => {
    const t = setTimeout(() => {
      setVerifying(false);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  const handleDownloadPDF = async () => {
    if (!ticketRef.current || !bookingData || downloading) return;
    try {
      setDownloading(true);
      // Ensure the ticket is briefly visible but positioned offscreen
      const element = ticketRef.current;
      element.style.display = 'block';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '-9999px';

      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
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
      element.dataset.img = imgData; // Store for preview
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`skyway-booking-${bookingData.type}-${transactionId}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
    } finally {
      setDownloading(false);
    }
  };

  if (!location.state) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h1 className="text-3xl font-black uppercase tracking-widest italic text-destructive">Invalid Access</h1>
        <p className="text-muted-foreground font-semibold mt-4">No booking information provided.</p>
        <Button onClick={() => navigate('/')} className="mt-8 rounded-xl font-bold uppercase tracking-widest h-14 px-8">
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[70vh] text-center">
      {verifying ? (
        <div className="flex flex-col items-center gap-6">
           <Loader2 className="w-16 h-16 animate-spin text-primary" />
           <h1 className="text-3xl font-black uppercase tracking-widest italic">Verifying Payment...</h1>
           <p className="text-muted-foreground font-semibold">Please do not close this window.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 animate-in slide-in-from-bottom-4 duration-700 fade-in zoom-in-95">
           <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center">
             <CheckCircle2 className="w-12 h-12 text-green-500" />
           </div>
           <h1 className="text-5xl font-black uppercase tracking-tighter italic">Paid Successfully!</h1>
           <p className="text-muted-foreground max-w-md font-semibold mb-4">Your payment has been successfully processed. An email receipt and itinerary have been sent to your inbox.</p>
           
           <div className="bg-muted/30 p-8 rounded-[30px] border border-border/50 w-full max-w-lg text-left mb-4 space-y-6">
              <div className="flex justify-between items-center border-b border-border/50 pb-4">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Booking Details</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  {bookingData?.type === 'flight' && <Plane size={12} />}
                  {bookingData?.type === 'hotel' && <Hotel size={12} />}
                  {bookingData?.type === 'car' && <Car size={12} />}
                  {bookingData?.type}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                 <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Total Price</span>
                 <span className="text-2xl font-black italic">{formatPrice(amount)}</span>
              </div>

              <div className="flex justify-between items-center">
                 <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Payment Date</span>
                 <span className="text-sm font-bold">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              <div className="flex justify-between items-center">
                 <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Transaction ID</span>
                 <span className="text-xs font-mono font-bold">{transactionId}</span>
              </div>
           </div>

             <div className="flex flex-col sm:flex-row gap-4 mt-2">
                 <Button 
                   onClick={() => navigate(`/booking/${location.state?.createdBooking?._id}`)}
                   className="rounded-xl font-black uppercase tracking-widest h-14 px-8 shadow-xl hover:shadow-primary/20 bg-muted hover:bg-muted/80 text-foreground"
                 >
                   Preview Ticket
                 </Button>
                 <Button 
                    onClick={handleDownloadPDF} 
                    disabled={downloading}
                    className="rounded-xl font-black uppercase tracking-widest h-14 px-8 shadow-xl hover:shadow-primary/20 bg-black text-white hover:bg-black/80"
                 >
                   {downloading ? (
                     <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                   ) : (
                     <Download className="w-5 h-5 mr-3" />
                   )}
                   {downloading ? 'Generating PDF...' : 'Download PDF Ticket'}
                 </Button>
              </div>
              <div className="flex gap-4 mt-4">
                  <Button onClick={() => navigate('/my-bookings')} className="rounded-xl font-bold uppercase tracking-widest h-14 px-8 shadow-xl hover:shadow-primary/20">
                    View My Bookings
                  </Button>
                  <Button onClick={() => navigate('/')} variant="outline" className="rounded-xl font-bold uppercase tracking-widest h-14 px-8 border-2 border-primary/20 hover:bg-primary/5 text-primary">
                    Back to Home
                  </Button>
              </div>
        </div>
      )}
      
      {/* Hidden PDF content */}
      {!verifying && bookingData && (
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', zIndex: -9999 }}>
          <BookingTicket 
             ref={ticketRef} 
             bookingData={{...bookingData, passengers: location.state?.createdBooking?.passengers || bookingData.passengers}} 
             amount={amount} 
             transactionId={transactionId} 
          />
        </div>
      )}
    </div>
  );
}
