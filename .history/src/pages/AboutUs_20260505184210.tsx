import React from "react";
import { motion } from "framer-motion"; // تأكد من تثبيت framer-motion
import {
  Target,
  Users,
  ShieldCheck,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
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

      {/* The Founder Section (قسم صورتك الشخصية) */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 rounded-[40px] overflow-hidden border-8 border-muted/20 aspect-[4/5]">
                {/* ضع رابط صورتك هنا مكان src */}
                <img
                  src="/public/photo_2025-09-22_16-10-10.jpg"
                  alt="Founder"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0"
                />
              </div>
              {/* زخرفة خلف الصورة */}
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-primary/10 -z-0 rounded-[40px]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-black uppercase tracking-widest text-xs mb-4 inline-block px-4 py-1.5 rounded-full bg-primary/10 italic">
                The Visionary
              </span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-6">
                The Face Behind <br />{" "}
                <span className="text-primary">SkyWay</span>
              </h2>
              <p className="text-muted-foreground text-lg italic leading-relaxed mb-6">
                "The journey began with a simple idea: travel doesn't have to be
                stressful. As a frequent traveler, I felt the gap between
                planning and enjoying myself, and that's how SkyWay was born."
              </p>
              <p className="text-muted-foreground text-lg italic mb-8 font-bold">
                — اسمك هنا، Founder & CEO
              </p>

              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-3 bg-muted rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="#"
                  className="p-3 bg-muted rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="#"
                  className="p-3 bg-muted rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-primary font-black uppercase tracking-widest text-xs mb-4 inline-block px-4 py-1.5 rounded-full bg-primary/10 italic">
                The Problem
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-8">
                Travel planning shouldn't be a chore
              </h2>
              <p className="text-muted-foreground text-lg italic leading-relaxed mb-6">
                Travel planning is confusing, fragmented, and full of hidden
                fees. Travelers spend hours jumping between multiple tabs and
                dealing with opaque booking systems.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Users, label: "Trust", val: "10M+" },
                { icon: Globe, label: "Destinations", val: "500+" },
                { icon: ShieldCheck, label: "Secure", val: "100%" },
                { icon: Target, label: "Accuracy", val: "99.9%" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-8 bg-background rounded-[40px] border border-border/50 text-center hover:shadow-xl transition-all group"
                >
                  <item.icon
                    className="mx-auto mb-4 text-primary group-hover:scale-110 transition-transform"
                    size={32}
                  />
                  <p className="text-3xl font-black italic tracking-tighter">
                    {item.val}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary font-black uppercase tracking-widest text-xs mb-4 inline-block px-4 py-1.5 rounded-full bg-primary/10 italic">
              Our Solution
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-8">
              One Platform. Every Destination.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="p-10 bg-muted/30 rounded-[40px] border border-transparent hover:border-primary/20 transition-all">
                <h3 className="font-black text-xl italic uppercase mb-4 text-primary">
                  Value
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed italic">
                  We provide a seamless experience and generate revenue through
                  strategic partnerships.
                </p>
              </div>
              <div className="p-10 bg-muted/30 rounded-[40px] border border-transparent hover:border-primary/20 transition-all">
                <h3 className="font-black text-xl italic uppercase mb-4 text-primary">
                  Users
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed italic">
                  Whether you're a business traveler or a budget explorer,
                  SkyWay is for you.
                </p>
              </div>
              <div className="p-10 bg-muted/30 rounded-[40px] border border-transparent hover:border-primary/20 transition-all">
                <h3 className="font-black text-xl italic uppercase mb-4 text-primary">
                  Vision
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed italic">
                  To be the world's most trusted travel companion, removing all
                  friction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
