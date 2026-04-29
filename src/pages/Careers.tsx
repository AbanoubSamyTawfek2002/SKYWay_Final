import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Heart, Rocket, Coffee, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Careers() {
  const values = [
    { icon: Sparkles, title: "Innovation", desc: "We push the boundaries of what's possible in travel tech." },
    { icon: Zap, title: "Speed", desc: "We move fast, iterate quickly, and deploy constantly." },
    { icon: Heart, title: "Empathy", desc: "We build for humans, with a deep understanding of their needs." },
    { icon: Rocket, title: "Ambition", desc: "We aim for the stars and build the ladder to get there." }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=80" alt="Careers" className="w-full h-full object-cover brightness-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter italic leading-none drop-shadow-2xl italic">Join the Fleet</motion.h1>
          <p className="text-white/80 text-xl font-medium mt-6 italic">Building the future of exploration. Are you ready?</p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4 inline-block italic">Our Culture</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-8 italic">Better together.</h2>
            <p className="text-muted-foreground text-xl italic max-w-3xl mx-auto">We're a team of designers, engineers, and visionaries united by a love for travel and a hunger for excellence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className="p-10 bg-muted/20 rounded-[40px] border border-border/50 text-center hover:bg-primary/5 transition-colors group">
                <v.icon className="mx-auto mb-6 text-primary group-hover:scale-125 transition-transform" size={40} />
                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">{v.title}</h3>
                <p className="text-muted-foreground text-sm italic">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-border pb-8">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic italic">Open Positions</h2>
            <Badge variant="outline" className="font-bold border-primary text-primary italic">12 Roles Available</Badge>
          </div>

          <div className="space-y-4">
            {[
              { role: "Senior Full Stack Engineer", team: "Engineering", type: "Remote" },
              { role: "Product Designer", team: "Design", type: "London / Hybrid" },
              { role: "Travel Content Strategist", team: "Marketing", type: "New York / Hybrid" },
              { role: "Lead Data Scientist", team: "AI & Data", type: "Remote" },
              { role: "Customer Success Concierge", team: "Operations", type: "Dubai" }
            ].map((p, i) => (
              <div key={i} className="group p-10 bg-background rounded-[40px] border border-border shadow-xl hover:border-primary transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">{p.role}</h3>
                  <div className="flex gap-4 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{p.team}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">•</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{p.type}</span>
                  </div>
                </div>
                <Button className="rounded-full px-10 h-14 font-black uppercase tracking-widest text-xs italic group-hover:scale-105 transition-transform">Apply Now</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="p-16 bg-primary rounded-[60px] text-white">
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-8 italic">Don't see a fit?</h3>
            <p className="text-xl mb-12 opacity-80 max-w-2xl mx-auto italic">We're always looking for talented rebels. Send us your resume and tell us why you should be part of SkyWay.</p>
            <Button variant="outline" className="bg-white text-primary hover:bg-white/90 border-none rounded-full h-16 px-12 font-black uppercase tracking-widest text-sm italic">General Application</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
