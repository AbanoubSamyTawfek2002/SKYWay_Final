import React from 'react';
import { motion } from 'motion/react';
import { Search, Mail, MessageCircle, Phone, SearchCheck, CreditCard, LifeBuoy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function HelpCenter() {
  const categories = [
    { icon: CreditCard, title: "Payments & Refunds", desc: "Issues with billing, refunds, and promo codes." },
    { icon: SearchCheck, title: "Booking Experience", desc: "How to manage, cancel or change your reservations." },
    { icon: LifeBuoy, title: "Safety & Security", desc: "How we protect your data and ensure safe travel." },
    { icon: Mail, title: "Contact Support", desc: "Get in touch with our expert travel concierge." }
  ];

  const [contactForm, setContactForm] = React.useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        setSuccess(true);
        setContactForm({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary pt-32 pb-48 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none mb-8">How can we help?</h1>
            <div className="max-w-2xl mx-auto relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={24} />
              <Input 
                placeholder="Search articles, issues, and guides..." 
                className="h-20 pl-16 rounded-[40px] border-none text-foreground text-lg font-medium shadow-2xl focus-visible:ring-offset-4 focus-visible:ring-primary/50" 
              />
              <Button className="absolute right-3 top-1/2 -translate-y-1/2 h-14 px-8 rounded-full font-black uppercase tracking-widest text-xs shadow-xl">Search</Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background -mt-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-background rounded-[40px] shadow-2xl border border-border/50 hover:border-primary/50 transition-colors group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <cat.icon size={32} />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4 leading-none">{cat.title}</h3>
                <p className="text-muted-foreground text-sm italic">{cat.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Frequently Asked Questions</h2>
              {[
                { q: "How do I cancel my booking?", a: "You can cancel your booking through the 'My Bookings' section in your account. Refund eligibility depends on the specific airline or hotel policy mentioned during checkout." },
                { q: "Can I change my flight dates?", a: "Most airlines allow date changes with a fee. Contact our support team or use the automated 'Reschedule' button in your booking details." },
                { q: "What should I do if my flight is delayed?", a: "SkyWay provides real-time alerts. If a delay exceeds 3 hours, you may be eligible for compensation under SkyWay Platinum Shield." }
              ].map((faq, i) => (
                <div key={i} className="border-b border-border pb-8 last:border-0 hover:pl-4 transition-all group">
                  <h4 className="text-xl font-black uppercase italic tracking-tighter mb-4 group-hover:text-primary transition-colors">{faq.q}</h4>
                  <p className="text-muted-foreground leading-relaxed italic">{faq.a}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-8">
              <div className="p-10 bg-primary/5 rounded-[40px] border border-primary/20">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-6">Need more help?</h3>
                {success ? (
                  <div className="p-8 bg-green-500/10 border border-green-500/20 rounded-[30px] text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white">
                      <SearchCheck size={32} />
                    </div>
                    <h4 className="text-xl font-black uppercase italic tracking-tighter">Ticket Received!</h4>
                    <p className="text-sm text-green-700 font-medium italic">Our travel concierge will contact you within 2-4 hours.</p>
                    <Button variant="outline" className="w-full mt-4" onClick={() => setSuccess(false)}>Send another message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <Input 
                      placeholder="Your Name" 
                      className="h-12 rounded-2xl" 
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                    />
                    <Input 
                      type="email"
                      placeholder="Your Email" 
                      className="h-12 rounded-2xl" 
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                    />
                    <Input 
                      placeholder="Subject" 
                      className="h-12 rounded-2xl" 
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    />
                    <textarea 
                      placeholder="How can we help?" 
                      className="w-full min-h-[120px] p-4 rounded-2xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground italic text-sm"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      required
                    />
                    <Button type="submit" className="w-full h-14 rounded-full font-black uppercase tracking-widest text-xs italic" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : 'Submit Support Ticket'}
                    </Button>
                  </form>
                )}
                
                <div className="mt-12 space-y-6 pt-8 border-t border-primary/10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white"><Phone size={18} /></div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Emergency Support</p>
                      <p className="font-bold">+1 (800) SKY-WAY</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white"><MessageCircle size={18} /></div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Live Chat</p>
                      <p className="font-bold">Available 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
