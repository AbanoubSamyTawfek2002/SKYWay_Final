import React from 'react';
import { motion } from 'motion/react';
import { Target, Users, ShieldCheck, Globe } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80" 
            alt="About Hero" 
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-background" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none drop-shadow-2xl"
          >
            Our Story
          </motion.h1>
          <p className="text-white/80 text-xl mt-6 max-w-2xl mx-auto italic">
            Redefining the way the world travels, one journey at a time.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-primary font-black uppercase tracking-widest text-xs mb-4 inline-block px-4 py-1.5 rounded-full bg-primary/10 italic">The Problem</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-8">Travel planning shouldn't be a chore</h2>
              <p className="text-muted-foreground text-lg italic leading-relaxed mb-6">
                Travel planning is confusing, fragmented, and full of hidden fees. Travelers spend hours jumping between multiple tabs, comparing prices that change by the minute, and dealing with opaque booking systems.
              </p>
              <p className="text-muted-foreground text-lg italic leading-relaxed">
                We saw the frustration and decided to build something better. A platform built for travelers, by travelers.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Users, label: "Trust", val: "10M+" },
                { icon: Globe, label: "Destinations", val: "500+" },
                { icon: ShieldCheck, label: "Secure", val: "100%" },
                { icon: Target, label: "Accuracy", val: "99.9%" }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-muted/30 rounded-[40px] border border-border/50 text-center hover:bg-primary/5 transition-colors">
                  <item.icon className="mx-auto mb-4 text-primary" size={32} />
                  <p className="text-3xl font-black italic tracking-tighter">{item.val}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary font-black uppercase tracking-widest text-xs mb-4 inline-block px-4 py-1.5 rounded-full bg-primary/10 italic">Our Solution</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-8">One Platform. Every Destination.</h2>
            <p className="text-muted-foreground text-xl italic leading-relaxed mb-12">
              Our platform simplifies booking flights and hotels in one place. We use cutting-edge technology and direct partnerships to provide a seamless experience, transparent pricing, and AI-powered assistance that makes planning as enjoyable as the trip itself.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="p-10 bg-background rounded-[40px] shadow-xl">
                <h3 className="font-black text-xl italic uppercase mb-4">Business Value</h3>
                <p className="text-muted-foreground text-sm leading-relaxed italic">We provide a seamless experience and generate revenue through strategic partnerships, ensuring sustainable growth while keeping prices competitive for our users.</p>
              </div>
              <div className="p-10 bg-background rounded-[40px] shadow-xl">
                <h3 className="font-black text-xl italic uppercase mb-4">Target Users</h3>
                <p className="text-muted-foreground text-sm leading-relaxed italic">Whether you're a frequent business traveler, a budget explorer, or an airline looking for better distribution, SkyWay is built for you.</p>
              </div>
              <div className="p-10 bg-background rounded-[40px] shadow-xl">
                <h3 className="font-black text-xl italic uppercase mb-4">Our Vision</h3>
                <p className="text-muted-foreground text-sm leading-relaxed italic">To be the world's most trusted travel companion, removing all friction between dreaming about a trip and experiencing it.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
