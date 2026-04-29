import React from 'react';
import { motion } from 'motion/react';
import { Newspaper, Tv, Mic, Download, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Press() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4 inline-block italic">Newsroom</span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none mb-6 italic">Press Room</h1>
          <p className="text-muted-foreground text-xl italic max-w-2xl mx-auto">The latest updates, official statements, and media resources from SkyWay.</p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic italic">Latest Stories</h2>
              {[
                { date: "May 12, 2026", title: "SkyWay Raises $200M to Revolutionize AI-Driven Travel Assistance", type: "Press Release" },
                { date: "April 28, 2026", title: "Announcing Exclusive Partnership with 500+ Luxury Boutique Hotels", type: "Announcement" },
                { date: "April 15, 2026", title: "SkyWay Named 'Innovator of the Year' at Global Travel Summit", type: "Award" },
                { date: "March 30, 2026", title: "How SkyWay is Reducing Carbon Footprints for Frequent Flyers", type: "Sustainability" }
              ].map((p, i) => (
                <div key={i} className="group p-10 bg-muted/20 rounded-[40px] border border-border shadow-2xl hover:border-primary transition-all cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{p.type}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{p.date}</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors leading-tight">{p.title}</h3>
                  <div className="mt-8 flex justify-end">
                    <Button variant="link" className="text-primary font-bold uppercase tracking-widest text-xs italic p-0">Read More <ExternalLink size={14} className="ml-2" /></Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-12">
              <div className="p-10 bg-background rounded-[40px] shadow-2xl border border-border sticky top-32">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-8 italic">Media Resources</h3>
                <div className="space-y-6">
                  {[
                    { icon: Download, label: "Brand Kit (Logos, Icons)", color: "bg-blue-500" },
                    { icon: Download, label: "Official Press Photos", color: "bg-purple-500" },
                    { icon: Download, label: "Company Fact Sheet", color: "bg-orange-500" },
                    { icon: Newspaper, label: "Executive Bios", color: "bg-green-500" }
                  ].map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl hover:bg-muted transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${r.color} text-white flex items-center justify-center`}><r.icon size={16} /></div>
                        <span className="text-xs font-bold uppercase tracking-widest">{r.label}</span>
                      </div>
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 pt-8 border-t border-border">
                  <h4 className="text-sm font-black uppercase italic tracking-widest mb-4">Media Inquiries</h4>
                  <p className="text-xs text-muted-foreground italic mb-4">For interview requests or additional information, contact our PR team:</p>
                  <p className="font-bold text-primary">press@skyway.travel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
