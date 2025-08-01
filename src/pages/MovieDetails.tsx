import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Play, Star, Calendar, Clock, Globe, Users, Award } from "lucide-react";

interface MovieDetails {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  genres: string[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language: string;
  production_companies: string[];
  production_countries: string[];
  budget?: number;
  revenue?: number;
  tagline: string;
  homepage: string;
  status: string;
  media_type: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  in_production?: boolean;
  networks?: string[];
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
  crew: Array<{
    id: number;
    name: string;
    job: string;
    profile_path: string | null;
  }>;
  videos: Array<{
    id: string;
    key: string;
    name: string;
    type: string;
  }>;
  similar: Array<{
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    media_type: string;
  }>;
  reviews: Array<{
    id: string;
    author: string;
    content: string;
    rating: number | null;
    created_at: string;
  }>;
}

const MovieDetails = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`https://dylctqimxhessygpqwze.supabase.co/functions/v1/get-movie-details?id=${id}&type=${type || 'movie'}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bGN0cWlteGhlc3N5Z3Bxd3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDQ4MjksImV4cCI6MjA2OTUyMDgyOX0.V4gJ4ykUYWZleYobr2O3NhIu36_2AIMcvUU3sBRYxSA`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bGN0cWlteGhlc3N5Z3Bxd3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDQ4MjksImV4cCI6MjA2OTUyMDgyOX0.V4gJ4ykUYWZleYobr2O3NhIu36_2AIMcvUU3sBRYxSA',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch movie details');
        const data = await response.json();

        setDetails(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id, type]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Movie not found</h2>
            <Button onClick={() => navigate('/')}>Go Back Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Backdrop */}
      <div className="relative">
        {details.backdrop_path && (
          <div 
            className="h-[60vh] bg-cover bg-center relative"
            style={{ backgroundImage: `url(${details.backdrop_path})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          </div>
        )}
        
        <div className="container mx-auto px-4 py-8 relative">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6 text-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="lg:col-span-1">
              {details.poster_path && (
                <img
                  src={details.poster_path}
                  alt={details.title}
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                />
              )}
            </div>

            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{details.title}</h1>
                {details.original_title !== details.title && (
                  <p className="text-xl text-muted-foreground mb-2">
                    Original: {details.original_title}
                  </p>
                )}
                {details.tagline && (
                  <p className="text-lg italic text-primary mb-4">{details.tagline}</p>
                )}
              </div>

              {/* Rating and Basic Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{details.vote_average.toFixed(1)}</span>
                  <span className="text-muted-foreground">({details.vote_count} votes)</span>
                </div>
                
                {details.release_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(details.release_date).getFullYear()}</span>
                  </div>
                )}
                
                {details.runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatRuntime(details.runtime)}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>{details.original_language.toUpperCase()}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {details.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>

              {/* TV Series Info */}
              {details.media_type === 'tv' && (
                <div className="flex flex-wrap gap-4 text-sm">
                  {details.number_of_seasons && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{details.number_of_seasons} Seasons</span>
                    </div>
                  )}
                  {details.number_of_episodes && (
                    <span>{details.number_of_episodes} Episodes</span>
                  )}
                  {details.networks && details.networks.length > 0 && (
                    <span>Networks: {details.networks.join(', ')}</span>
                  )}
                </div>
              )}

              {/* Overview */}
              <div>
                <h2 className="text-2xl font-semibold mb-3">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {details.overview || 'No overview available.'}
                </p>
              </div>

              {/* Trailers */}
              {details.videos.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Trailers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {details.videos.map((video) => (
                      <Card key={video.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Play className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{video.name}</h3>
                              <p className="text-sm text-muted-foreground">{video.type}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {details.cast.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-6">Cast</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {details.cast.map((person) => (
              <Card key={person.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {person.profile_path ? (
                    <img
                      src={person.profile_path}
                      alt={person.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate">{person.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{person.character}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Production Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Budget/Revenue for Movies */}
          {details.media_type === 'movie' && (details.budget || details.revenue) && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Box Office
                </h3>
                <div className="space-y-2">
                  {details.budget && details.budget > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="font-medium">{formatCurrency(details.budget)}</span>
                    </div>
                  )}
                  {details.revenue && details.revenue > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium">{formatCurrency(details.revenue)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Production Companies */}
          {details.production_companies.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Production Companies</h3>
                <div className="space-y-1">
                  {details.production_companies.slice(0, 5).map((company, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      {company}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status and Countries */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">{details.status}</span>
                </div>
                {details.production_countries.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Countries:</span>
                    <span className="font-medium text-right">
                      {details.production_countries.slice(0, 2).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Similar Movies/Shows */}
      {details.similar.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-6">Similar {details.media_type === 'tv' ? 'Shows' : 'Movies'}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {details.similar.map((item) => (
              <Card 
                key={item.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/details/${item.media_type}/${item.id}`)}
              >
                <CardContent className="p-0">
                  {item.poster_path ? (
                    <img
                      src={item.poster_path}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <div className="text-center p-4">
                        <h3 className="font-medium text-sm">{item.title}</h3>
                      </div>
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{item.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {details.reviews.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
          <div className="space-y-6">
            {details.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{review.author}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {review.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{review.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{review.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MovieDetails;