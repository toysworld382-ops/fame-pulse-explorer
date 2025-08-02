import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
}

const GenreDetails = () => {
  const { genre } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenreMovies = async () => {
      try {
        const response = await fetch(`https://dylctqimxhessygpqwze.supabase.co/functions/v1/get-genre-movies?genre=${encodeURIComponent(genre || '')}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bGN0cWlteGhlc3N5Z3Bxd3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDQ4MjksImV4cCI6MjA2OTUyMDgyOX0.V4gJ4ykUYWZleYobr2O3NhIu36_2AIMcvUU3sBRYxSA`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bGN0cWlteGhlc3N5Z3Bxd3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDQ4MjksImV4cCI6MjA2OTUyMDgyOX0.V4gJ4ykUYWZleYobr2O3NhIu36_2AIMcvUU3sBRYxSA',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch genre movies');
        const data = await response.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error('Error fetching genre movies:', error);
      } finally {
        setLoading(false);
      }
    };

    if (genre) {
      fetchGenreMovies();
    }
  }, [genre]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading movies...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 text-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-4xl font-bold mb-8">{genre} Movies</h1>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <Card 
                key={movie.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/details/movie/${movie.id}`)}
              >
                <CardContent className="p-0">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <div className="text-center p-4">
                        <h3 className="font-medium text-sm">{movie.title}</h3>
                      </div>
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate">{movie.title}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : ''}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{movie.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl text-muted-foreground">No movies found for this genre</h2>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default GenreDetails;