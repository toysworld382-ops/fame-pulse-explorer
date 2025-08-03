import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Tv, Filter, Grid, List } from "lucide-react";

const DiscoverSeries = () => {
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const genres = [
    'all', 'drama', 'comedy', 'crime', 'action', 'romance', 
    'thriller', 'sci-fi', 'fantasy', 'documentary'
  ];

  const streamingPlatforms = [
    { name: 'Netflix', color: 'bg-red-600' },
    { name: 'Prime Video', color: 'bg-blue-600' },
    { name: 'Disney+', color: 'bg-blue-800' },
    { name: 'Apple TV+', color: 'bg-gray-800' },
    { name: 'HBO Max', color: 'bg-purple-600' },
    { name: 'Hulu', color: 'bg-green-600' },
    { name: 'Paramount+', color: 'bg-blue-500' },
    { name: 'Peacock', color: 'bg-purple-500' },
    { name: 'Discovery+', color: 'bg-blue-400' },
    { name: 'ESPN+', color: 'bg-red-700' }
  ];

  useEffect(() => {
    fetchSeries();
  }, [selectedGenre]);

  const fetchSeries = async () => {
    setLoading(true);
    try {
      // For now, use trending movies but filter for TV series
      const { data } = await supabase.functions.invoke('get-trending-movies');
      const tvSeries = data?.movies?.filter((item: any) => item.media_type === 'tv') || [];
      setSeries(tvSeries);
    } catch (error) {
      console.error('Error fetching series:', error);
      setSeries([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-background via-primary/10 to-background py-16">
        <div className="container px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover
              <span className="block bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                TV Series
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Binge-watch the best TV series from around the globe. Your next obsession awaits.
            </p>
          </div>
        </div>
      </section>

      {/* Streaming Platforms */}
      <section className="py-8 border-b border-border">
        <div className="container px-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Tv className="w-5 h-5 text-primary" />
            Available on Major Platforms
          </h2>
          <div className="flex flex-wrap gap-3">
            {streamingPlatforms.map((platform) => (
              <Badge 
                key={platform.name}
                className={`${platform.color} text-white hover:scale-105 transition-transform cursor-pointer`}
              >
                {platform.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-6 border-b border-border">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-primary" />
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    variant={selectedGenre === genre ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedGenre(genre)}
                    className="capitalize"
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Series Grid */}
      <section className="py-12">
        <div className="container px-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-muted animate-pulse rounded-lg h-80"></div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {series.map((show) => (
                <MovieCard
                  key={show.id}
                  id={show.id}
                  title={show.title}
                  year={show.year}
                  rating={show.rating}
                  genre={show.genre}
                  image={show.image}
                  language={show.language}
                  media_type={show.media_type}
                  className={viewMode === 'list' ? 'flex-row h-40' : ''}
                />
              ))}
            </div>
          )}
          
          {series.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No TV series found for this genre.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DiscoverSeries;