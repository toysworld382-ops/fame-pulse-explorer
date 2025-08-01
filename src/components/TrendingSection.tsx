import { MovieCard } from "./MovieCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  year: string;
  rating: number;
  genre: string;
  image: string;
  language: string;
  media_type: string;
}

export const TrendingSection = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-trending-movies');
        
        if (error) {
          console.error('Error fetching trending movies:', error);
          return;
        }
        
        setMovies(data.movies || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  return (
    <section className="py-12 px-4" data-section="trending">
      <div className="container">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-primary-glow">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Trending Now</h2>
              <p className="text-muted-foreground">What everyone's watching this week</p>
            </div>
          </div>
          <Button variant="outline" className="group">
            View All
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted rounded-lg aspect-[2/3] mb-2"></div>
                <div className="h-4 bg-muted rounded mb-1"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))
          ) : (
            movies.map((movie, index) => (
              <MovieCard
                key={index}
                id={movie.id}
                title={movie.title}
                year={movie.year}
                rating={movie.rating}
                genre={movie.genre}
                image={movie.image}
                language={movie.language}
                media_type={movie.media_type}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};