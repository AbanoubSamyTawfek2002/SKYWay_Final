import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

export const TravelerReviews = ({ flight }: { flight: any }) => {
  const reviews = flight?.reviews || [];
  
  if (!reviews.length) return null;

  const totalRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
  const avgRating = (totalRating / reviews.length).toFixed(1);

  return (
    <div className="mt-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-3xl font-black uppercase italic tracking-tighter">Traveler Reviews</h3>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center text-primary">
              <Star size={20} fill="currentColor" />
              <span className="ml-1.5 font-black text-xl italic leading-none">{avgRating}</span>
            </div>
            <span className="text-muted-foreground text-xs font-black uppercase tracking-widest italic opacity-60">
              {reviews.length} reviews
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review: any, idx: number) => (
          <div key={idx} className="p-6 bg-muted/20 rounded-[30px] border border-border/50">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-lg italic uppercase shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <h4 className="font-black italic uppercase tracking-tighter flex items-center gap-2">
                    {review.username}
                    {review.verified && (
                      <span className="flex items-center gap-1 text-[9px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full tracking-widest">
                        <ShieldCheck size={10} /> Verified Traveler
                      </span>
                    )}
                  </h4>
                  <span className="text-[10px] text-muted-foreground font-medium italic">
                    {review.date}
                  </span>
                </div>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < review.rating ? "text-primary" : "text-muted-foreground/30"} 
                    fill={i < review.rating ? "currentColor" : "none"} 
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              "{review.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
