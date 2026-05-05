import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  targetType: "flight" | "hotel";
  targetId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewSectionProps {
  targetType: "flight" | "hotel";
  targetId: string;
  onReviewAdded?: (avgRating: number, reviewCount: number) => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  targetType,
  targetId,
  onReviewAdded,
}) => {
  const { t } = useTranslation();
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews();
    if (user && token) {
      checkCanReview();
    }
  }, [targetId, user, token]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews/${targetType}/${targetId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkCanReview = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const bookings = await res.json();
        const completedBooking = bookings.find(
          (b: any) =>
            b.type === targetType &&
            (targetType === "flight"
              ? b.flightId?._id === targetId
              : b.hotelId?._id === targetId) &&
            b.status === "completed",
        );

        // Also check if already reviewed
        const alreadyReviewed = reviews.some((r) => r.userId._id === user?.id);

        setCanReview(!!completedBooking && !alreadyReviewed);
      }
    } catch (err) {
      console.error("Error checking review eligibility:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetType,
          targetId,
          ...reviewForm,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReviews((prev) => [data, ...prev]);
        setReviewForm({ rating: 5, comment: "" });
        setShowForm(false);
        setCanReview(false);

        if (onReviewAdded) {
          const allReviews = [data, ...reviews];
          const avgRating =
            allReviews.reduce((acc, curr) => acc + curr.rating, 0) /
            allReviews.length;
          onReviewAdded(avgRating, allReviews.length);
        }
      } else {
        setError(data.message || "Failed to submit review");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const updatedReviews = reviews.filter((r) => r._id !== reviewId);
        setReviews(updatedReviews);

        if (onReviewAdded) {
          const avgRating =
            updatedReviews.length > 0
              ? updatedReviews.reduce((acc, curr) => acc + curr.rating, 0) /
                updatedReviews.length
              : 0;
          onReviewAdded(avgRating, updatedReviews.length);
        }

        // Re-check if user can review now
        setCanReview(true);
      }
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 opacity-50 italic">
        Loading feedback...
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter">
          {targetType === "hotel" ? "Guest Reviews" : "Passenger Feedback"}
        </h3>
        {canReview && !showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="rounded-full gap-2 px-6"
          >
            <MessageSquare size={16} /> Write Review
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="rounded-[30px] bg-muted/10 border-dashed overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-black uppercase tracking-tighter text-xl italic">
                Post your review
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-xl text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-4 items-center">
                <span className="text-sm font-black uppercase tracking-widest italic opacity-60">
                  Your Rating
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewForm((f) => ({ ...f, rating: star }))
                      }
                      className={`p-1 transition-all hover:scale-110 ${reviewForm.rating >= star ? "text-primary" : "text-muted-foreground opacity-30"}`}
                    >
                      <Star
                        size={24}
                        fill={
                          reviewForm.rating >= star ? "currentColor" : "none"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                placeholder={
                  targetType === "hotel"
                    ? "How was your stay?"
                    : "How was your flight?"
                }
                className="min-h-[120px] rounded-2xl p-6 bg-background/50 border-none italic text-lg shadow-inner"
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((f) => ({ ...f, comment: e.target.value }))
                }
                required
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="px-10 h-12 rounded-full font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                >
                  {submitting ? "Sharing..." : "Post Review"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {reviews.length === 0 ? (
          <div className="p-12 text-center bg-muted/5 rounded-[30px] border-2 border-dashed border-muted/20">
            <MessageSquare className="mx-auto mb-4 opacity-20" size={48} />
            <p className="italic text-muted-foreground">
              No reviews yet for this {targetType}.
            </p>
          </div>
        ) : (
          reviews.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="p-6 sm:p-8 bg-muted/10 rounded-[30px] border border-border/50 hover:border-primary/20 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary border border-primary/20">
                    {review.userId?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h5 className="font-black uppercase tracking-tighter text-lg leading-none mb-1">
                      {review.userId?.name || "Verified User"}
                    </h5>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest italic">
                      {new Date(review.createdAt).toLocaleDateString(
                        undefined,
                        { dateStyle: "long" },
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < review.rating ? "currentColor" : "none"}
                        className={i >= review.rating ? "opacity-20" : ""}
                      />
                    ))}
                  </div>
                  {(user?.id === review.userId?._id ||
                    user?.role === "admin") && (
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Review"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-base sm:text-lg italic leading-relaxed text-muted-foreground font-medium">
                "{review.comment}"
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
