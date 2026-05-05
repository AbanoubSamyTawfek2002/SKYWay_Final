import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`);
        if (!res.ok) {
          setBlog(null);
          return;
        }
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) return (
    <div className="container mx-auto p-20 text-center flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!blog) return <div className="container mx-auto p-20 text-center">Post not found.</div>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Article Header */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover brightness-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>
        <div className="container relative z-10 mx-auto px-4 pb-12">
          <Button variant="ghost" className="text-white hover:text-primary mb-8 gap-2 font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/blog')}>
            <ArrowLeft size={16} /> Back to Journal
          </Button>
          <div className="max-w-4xl">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4 inline-block italic px-4 py-1.5 rounded-full bg-primary/10 backdrop-blur-md">{blog.category}</span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-none mb-8"
            >
              {blog.title}
            </motion.h1>
            <div className="flex items-center gap-8 text-white/70 font-bold uppercase italic text-sm">
              <div className="flex items-center gap-2">
                <User size={16} className="text-primary" />
                <span>By {blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                <span>{new Date(blog.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-xl dark:prose-invert italic text-muted-foreground leading-relaxed space-y-8">
              <p className="text-2xl text-foreground font-medium border-l-4 border-primary pl-8 py-2">
                {blog.content.substring(0, 150)}...
              </p>
              <p>{blog.content}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              
              <div className="p-12 bg-muted/30 rounded-[40px] border border-border/50 text-center my-16">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Enjoyed this story?</h3>
                <p className="mb-8">Share it with your fellow travelers and start planning your next journey together.</p>
                <div className="flex justify-center gap-4">
                  <Button className="rounded-full px-8 gap-2 font-black uppercase tracking-widest text-xs italic">
                    <Share2 size={16} /> Share Post
                  </Button>
                </div>
              </div>
              
              <p>Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
