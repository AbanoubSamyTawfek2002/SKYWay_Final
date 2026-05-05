import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface Journal {
  _id: string;
  title: string;
  summary: string;
  image: string;
  country: string;
  city: string;
  category: string;
  author: string;
  readTime: string;
  createdAt: string;
}

export default function JournalList() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'History', 'Adventure', 'Culture', 'Luxury'];

  const fetchJournals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category);

      const res = await fetch(`/api/journals?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJournals(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, [category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJournals();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 font-serif italic">Travel <span className="text-primary text-stroke">Journal</span></h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Discover extraordinary destinations and get insider tips for your next adventure.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-card p-4 rounded-xl border shadow-sm">
        <form onSubmit={handleSearch} className="flex w-full md:w-1/2 relative">
          <MapPin className="absolute left-3 top-3 text-muted-foreground" size={20} />
          <Input 
            placeholder="Search by destination or title..." 
            className="pl-10 h-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" className="absolute right-1 top-1 h-10 px-6">Search</Button>
        </form>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {categories.map((cat) => (
            <Button 
              key={cat} 
              variant={category === cat ? 'default' : 'outline'}
              onClick={() => setCategory(cat)}
              className="rounded-full whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : journals.length === 0 ? (
        <div className="text-center p-20 border rounded-xl bg-muted/20">
          <h3 className="text-xl font-bold mb-2">No articles found</h3>
          <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {journals.map((journal, index) => (
            <motion.div 
              key={journal._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col bg-card rounded-2xl overflow-hidden border hover:shadow-xl transition-all"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={journal.image} 
                  alt={journal.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-background/90 text-foreground backdrop-blur px-3 py-1 text-xs font-black uppercase tracking-widest">
                    {journal.category}
                  </Badge>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-bold mb-3">
                  <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" /> {journal.city}, {journal.country}</span>
                  <span>•</span>
                  <span>{journal.readTime}</span>
                </div>
                <h3 className="text-2xl font-black mb-3 leading-tight group-hover:text-primary transition-colors font-serif italic">{journal.title}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                  {journal.summary}
                </p>
                <div className="mt-auto flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                      {journal.author.charAt(0)}
                    </div>
                    {journal.author}
                  </div>
                  <Link to={`/journals/${journal._id}`}>
                    <Button variant="ghost" className="uppercase tracking-widest text-xs font-black p-0 h-auto hover:bg-transparent hover:text-primary gap-1">
                      Read More <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
