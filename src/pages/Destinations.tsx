import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../contexts/CurrencyContext';

const destinations = [
  { city: "Paris", country: "France", region: "Europe", price: 450, img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80", description: "The City of Light, synonymous with art, fashion, and sophisticated gastronomy." },
  { city: "Tokyo", country: "Japan", region: "Asia", price: 820, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80", description: "A high-tech metropolis where neon skyscrapers meet tranquil historic temples." },
  { city: "Dubai", country: "UAE", region: "Middle East", price: 610, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80", description: "Ultramodern architecture and a luxury shopping scene in the heart of the desert." },
  { city: "New York", country: "USA", region: "North America", price: 550, img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80", description: "The epicenter of culture, finance, and media, known as the city that never sleeps." },
  { city: "London", country: "UK", region: "Europe", price: 480, img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80", description: "A historic capital blending centuries of heritage with a vibrant modern lifestyle." },
  { city: "Singapore", country: "Singapore", region: "Asia", price: 750, img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80", description: "A tropical garden city-state famous for its cleanliness and efficient greenery." },
  { city: "Rome", country: "Italy", region: "Europe", price: 420, img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80", description: "The Eternal City, home to iconic landmarks from the Roman Empire to the Vatican." },
  { city: "Sydney", country: "Australia", region: "Oceania", price: 950, img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80", description: "A coastal powerhouse known for its Opera House and spectacular Harbour Bridge." }
];

export default function Destinations() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full pointer-events-none select-none opacity-5">
           <h1 className="text-[150px] md:text-[300px] font-black uppercase tracking-tighter italic leading-none whitespace-nowrap text-center">
             EXPLORE
           </h1>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 md:px-10 relative z-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="mb-8 rounded-full font-bold uppercase tracking-widest text-[10px] gap-2 hover:bg-primary/5 italic"
          >
            <ArrowLeft size={16} /> Back to Home
          </Button>
          
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] mb-6 italic">Curation 2026</span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6 leading-none italic break-words">
              World <br className="hidden md:block" /> Destinations
            </h1>
            <p className="text-muted-foreground text-xl italic max-w-2xl">
              From historic capitals to modern metropolises, discover the most breathtaking places across the globe.
            </p>
          </div>
        </div>
      </section>

      {/* Hero Grid */}
      <section className="pb-32 px-4 sm:px-6 md:px-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {destinations.map((dest, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group flex flex-col h-full"
              >
                <div 
                  onClick={() => navigate(`/destinations/${dest.city}`, { state: { image: dest.img, description: dest.description } })}
                  className="relative aspect-[4/5] overflow-hidden rounded-[30px] mb-6 cursor-pointer shadow-2xl transition-transform duration-500 hover:-translate-y-2"
                >
                  <img 
                    src={dest.img} 
                    alt={dest.city} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute top-6 left-6">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                      {dest.region}
                    </span>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 mb-1">{dest.country}</p>
                    <h3 className="text-3xl font-black tracking-tighter uppercase italic">{dest.city}</h3>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col px-2">
                  <p className="text-muted-foreground text-sm italic mb-6 line-clamp-2">
                    {dest.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">Starting at</p>
                      <p className="text-2xl font-black italic tracking-tighter">{formatPrice(dest.price)}</p>
                    </div>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="rounded-full w-12 h-12 border-primary/20 hover:bg-primary hover:text-white transition-all transform group-hover:rotate-45"
                      onClick={() => navigate(`/destinations/${dest.city}`, { state: { image: dest.img, description: dest.description } })}
                    >
                      <ArrowRight size={20} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8 italic">Ready for your adventure?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-16 px-10 rounded-full font-black uppercase tracking-widest gap-2 shadow-xl shadow-primary/20" onClick={() => navigate('/flights')}>
              Search Flights <Search size={20} />
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-10 rounded-full font-black uppercase tracking-widest border-2" onClick={() => navigate('/hotels')}>
              Find Hotels
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
