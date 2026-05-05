import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  MapPin,
  ArrowLeft,
  Clock,
  User,
  CalendarDays,
  Ticket,
  AlertTriangle,
  Lightbulb,
  Map,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function JournalDetails() {
  const { id } = useParams();
  const [journal, setJournal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/journals/${id}`,
        );
        if (res.ok) {
          const data = await res.json();
          setJournal(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJournal();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center p-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  if (!journal)
    return (
      <div className="p-32 text-center text-2xl font-bold bg-muted/20">
        Article not found
      </div>
    );

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full bg-black">
        <img
          src={journal.image}
          alt={journal.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <Link
              to="/journals"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 font-medium text-sm transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Journal
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-primary hover:bg-primary text-primary-foreground uppercase tracking-widest px-3 py-1 font-black">
                {journal.category}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/10 text-white hover:bg-white/20 backdrop-blur uppercase tracking-widest px-3 py-1 font-black flex items-center gap-1"
              >
                <MapPin size={12} /> {journal.city}, {journal.country}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight font-serif italic max-w-4xl">
              {journal.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/40 flex items-center justify-center text-white font-bold">
                  {journal.author.charAt(0)}
                </div>
                {journal.author}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} /> {journal.readTime}
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays size={16} />{" "}
                {new Date(journal.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <p className="text-xl md:text-2xl font-serif leading-relaxed text-muted-foreground italic mb-10 border-l-4 border-primary pl-6">
                {journal.summary}
              </p>

              <div className="text-lg leading-loose mb-12">
                {journal.content
                  .split("\n")
                  .map((paragraph: string, i: number) => (
                    <p key={i} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
              </div>

              {/* Sections */}
              <div className="space-y-12">
                {journal.history && (
                  <section>
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                      <Clock className="text-primary" /> A Brief History
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {journal.history}
                    </p>
                  </section>
                )}

                {journal.whyFamous && (
                  <section>
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                      <Map className="text-primary" /> Why It's Famous
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {journal.whyFamous}
                    </p>
                  </section>
                )}

                {journal.localCulture && (
                  <section>
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                      <User className="text-primary" /> Local Culture
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed bg-muted/20 p-6 rounded-xl border-l-4 border-l-muted-foreground">
                      {journal.localCulture}
                    </p>
                  </section>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar / Info Box */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border rounded-2xl p-6 shadow-sm sticky top-24"
            >
              <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b pb-4">
                Essential Info
              </h3>

              <div className="space-y-6">
                {journal.bestTime && (
                  <div>
                    <h4 className="font-bold flex items-center gap-2 mb-2">
                      <CalendarDays size={18} className="text-primary" /> Best
                      Time to Visit
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {journal.bestTime}
                    </p>
                  </div>
                )}
                {journal.ticketPrices && (
                  <div>
                    <h4 className="font-bold flex items-center gap-2 mb-2">
                      <Ticket size={18} className="text-primary" /> Tickets &
                      Pricing
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {journal.ticketPrices}
                    </p>
                  </div>
                )}
                {journal.travelTips?.length > 0 && (
                  <div>
                    <h4 className="font-bold flex items-center gap-2 mb-2">
                      <Lightbulb size={18} className="text-yellow-500" /> Travel
                      Tips
                    </h4>
                    <ul className="space-y-2">
                      {journal.travelTips.map((tip: string, i: number) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-primary font-bold">•</span>{" "}
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {journal.safetyTips?.length > 0 && (
                  <div>
                    <h4 className="font-bold flex items-center gap-2 mb-2 text-destructive">
                      <AlertTriangle size={18} /> Safety Tips
                    </h4>
                    <ul className="space-y-2">
                      {journal.safetyTips.map((tip: string, i: number) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-destructive font-bold">•</span>{" "}
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {journal.nearbyAttractions?.length > 0 && (
                  <div>
                    <h4 className="font-bold flex items-center gap-2 mb-2">
                      <MapPin size={18} className="text-primary" /> Nearby
                      Attractions
                    </h4>
                    <div className="space-y-3">
                      {journal.nearbyAttractions.map((attr: any, i: number) => (
                        <div
                          key={i}
                          className="bg-muted/30 p-3 rounded-lg border"
                        >
                          <p className="font-bold text-sm">{attr.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {attr.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
