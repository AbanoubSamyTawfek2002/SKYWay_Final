import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function BlogList() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs');
        if (!res.ok) {
          setBlogs([]);
          return;
        }
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return (
    <div className="container mx-auto p-20 text-center flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="font-bold italic uppercase tracking-widest text-xs">Fetching Journal Entries...</p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4 inline-block italic">The SkyWay Journal</span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none mb-6">Travel Stories</h1>
          <p className="text-muted-foreground text-xl italic max-w-2xl mx-auto">Expert tips, destination guides, and stories to inspire your next great adventure.</p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {blogs.map((blog, i) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
                onClick={() => navigate(`/blog/${blog.slug}`)}
              >
                <Card className="overflow-hidden border-none shadow-2xl bg-muted/20 rounded-[40px] h-full flex flex-col">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <CardContent className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag size={12} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">{blog.category}</span>
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4 leading-tight group-hover:text-primary transition-colors">{blog.title}</h2>
                    <p className="text-muted-foreground text-sm italic line-clamp-3 mb-8">{blog.content}</p>
                    
                    <div className="mt-auto pt-8 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase italic">
                        <Calendar size={14} />
                        <span>{new Date(blog.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
