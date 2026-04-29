import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Eye, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Safety() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-background py-24 border-b">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4 inline-block italic">Our Priority</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none mb-6">Safety & Security</h1>
          <p className="text-muted-foreground text-xl italic max-w-2xl mx-auto">We go above and beyond to protect your journeys and your data.</p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-12 bg-muted/20 rounded-[40px] border border-border/50">
              <ShieldCheck className="text-primary mb-8" size={48} />
              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-6">SkyWay Shield</h2>
              <p className="text-muted-foreground text-lg italic leading-relaxed mb-6">
                Every booking on SkyWay is automatically covered by our Platinum Shield. This includes comprehensive travel insurance, emergency medical assistance, and 24/7 localized support regardless of your time zone.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 font-bold italic"><CheckCircle2 className="text-primary" size={18} /> Emergency Medical Coverage</li>
                <li className="flex items-center gap-3 font-bold italic"><CheckCircle2 className="text-primary" size={18} /> Luggage Loss Protection</li>
                <li className="flex items-center gap-3 font-bold italic"><CheckCircle2 className="text-primary" size={18} /> Flight Delay Compensation</li>
              </ul>
            </div>

            <div className="p-12 bg-muted/20 rounded-[40px] border border-border/50">
              <Lock className="text-primary mb-8" size={48} />
              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-6">Data Fortification</h2>
              <p className="text-muted-foreground text-lg italic leading-relaxed mb-6">
                Your personal and financial information is fortified with elite-level encryption. We use military-grade 256-bit SSL protocols to ensure your transactions and details are invisible to unauthorized parties.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 font-bold italic"><CheckCircle2 className="text-primary" size={18} /> End-to-End Encryption</li>
                <li className="flex items-center gap-3 font-bold italic"><CheckCircle2 className="text-primary" size={18} /> Biometric Authentication Options</li>
                <li className="flex items-center gap-3 font-bold italic"><CheckCircle2 className="text-primary" size={18} /> GDPR & PCI Compliance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AlertTriangle className="mx-auto mb-8 animate-pulse text-white" size={64} />
            <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-8 italic">Travel Verified</h2>
            <p className="text-xl italic leading-relaxed mb-12 opacity-80">
              Our "Travel Verified" checkmark ensures that every hotel and airline on our platform has passed a rigorous 50-point safety and service quality inspection. We don't just book your stays; we certify their excellence.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex flex-col items-center">
                <p className="text-4xl font-black italic tracking-tighter">5,000+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Inspected Properties</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-4xl font-black italic tracking-tighter">24/7</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Human Support</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-4xl font-black italic tracking-tighter">100%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Payment Bonded</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
