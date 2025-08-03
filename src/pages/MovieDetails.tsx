import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Play, Star, Calendar, Clock, Globe, Users, Award, X, Volume2, VolumeX, ExternalLink } from "lucide-react";
import { Helmet } from "react-helmet";

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
  recommended?: Array<{
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
  const [isMuted, setIsMuted] = useState(true);
  const [showMoreSimilar, setShowMoreSimilar] = useState(false);
  const [showMoreRecommended, setShowMoreRecommended] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState<string>('');
  const [isPremium, setIsPremium] = useState(false);

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

  const openTrailerModal = (trailerKey: string) => {
    setSelectedTrailer(trailerKey);
    setShowTrailerModal(true);
  };

  const closeTrailerModal = () => {
    setShowTrailerModal(false);
    setSelectedTrailer('');
  };

  const watchOptions = [
    { name: 'Netflix', url: `https://www.netflix.com/search?q=${encodeURIComponent(details?.title || '')}`, icon: '🎬' },
    { name: 'Prime Video', url: `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(details?.title || '')}`, icon: '📺' },
    { name: 'Disney+', url: `https://www.disneyplus.com/search?q=${encodeURIComponent(details?.title || '')}`, icon: '🏰' },
    { name: 'Hulu', url: `https://www.hulu.com/search?q=${encodeURIComponent(details?.title || '')}`, icon: '🌊' },
    { name: 'HBO Max', url: `https://www.hbomax.com/search?q=${encodeURIComponent(details?.title || '')}`, icon: '👑' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{details?.title ? `${details.title} (${new Date(details.release_date).getFullYear()}) - Movie Details` : 'Movie Details'}</title>
        <meta name="description" content={details?.overview || 'Watch movies and TV shows online'} />
        <meta name="keywords" content={`${details?.title}, ${details?.genres?.join(', ')}, movie, watch online, streaming`} />
        <meta property="og:title" content={details?.title} />
        <meta property="og:description" content={details?.overview} />
        <meta property="og:image" content={details?.poster_path} />
        <meta property="og:type" content="video.movie" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={details?.title} />
        <meta name="twitter:description" content={details?.overview} />
        <meta name="twitter:image" content={details?.poster_path} />
      </Helmet>
      
      {/* Advertisement Banner - Only show if not premium */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-primary to-secondary p-4 text-center text-white">
          <p className="text-sm">
            🎬 Enjoy ad-free experience! 
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 bg-white text-primary hover:bg-gray-100"
              onClick={() => setIsPremium(true)}
            >
              Go Premium - $9.99/month
            </Button>
          </p>
        </div>
      )}
      
      <Header />
      
      {/* Hero Section with Auto-playing Trailer */}
      <div className="relative">
        {details.videos.length > 0 ? (
          <div className="h-[60vh] relative bg-black">
            <iframe
              id="hero-trailer"
              src={`https://www.youtube.com/embed/${details.videos[0].key}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${details.videos[0].key}&controls=1&showinfo=0&rel=0&modestbranding=1&enablejsapi=1`}
              className="w-full h-full object-cover"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none transition-opacity duration-300 ${isMuted ? 'opacity-60' : 'opacity-30'}`} />
            
            {/* Unmute Button */}
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className="bg-black/50 hover:bg-black/70 text-white border-white/20"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 mr-2" />
                    Unmute
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Mute
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : details.backdrop_path ? (
          <div 
            className="h-[60vh] bg-cover bg-center relative"
            style={{ backgroundImage: `url(${details.backdrop_path})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          </div>
        ) : null}
        
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
                  <Badge 
                    key={genre} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-primary/20"
                    onClick={() => navigate(`/genre/${encodeURIComponent(genre)}`)}
                  >
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

              {/* Watch Options */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold">Watch Now</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {watchOptions.map((option) => (
                    <Button
                      key={option.name}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => window.open(option.url, '_blank')}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <span className="text-xs">{option.name}</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    Add to Watchlist
                  </Button>
                  <Button variant="outline">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    Favorite
                  </Button>
                </div>
              </div>

              {/* Trailers */}
              {details.videos.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Trailers & Videos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {details.videos.map((video) => (
                      <Card 
                        key={video.id} 
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => openTrailerModal(video.key)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Play className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{video.name}</h3>
                              <p className="text-sm text-muted-foreground">{video.type}</p>
                            </div>
                            <Button size="sm" variant="ghost">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </Button>
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
              <Card 
                key={person.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/person/${person.id}`)}
              >
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Similar {details.media_type === 'tv' ? 'Shows' : 'Movies'}</h2>
            <Button 
              variant="outline" 
              onClick={() => setShowMoreSimilar(!showMoreSimilar)}
            >
              {showMoreSimilar ? 'Show Less' : 'Show More'}
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {(showMoreSimilar ? details.similar : details.similar.slice(0, 12)).map((item) => (
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

      {/* Recommended Movies/Shows */}
      {details.recommended && details.recommended.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Recommended for You</h2>
            <Button 
              variant="outline" 
              onClick={() => setShowMoreRecommended(!showMoreRecommended)}
            >
              {showMoreRecommended ? 'Show Less' : 'Show More'}
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {(showMoreRecommended ? details.recommended : details.recommended.slice(0, 12)).map((item) => (
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

      {/* Trailer Modal */}
      {showTrailerModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-[90vw] h-[90vh] max-w-6xl">
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
              onClick={closeTrailerModal}
            >
              <X className="h-6 w-6" />
              Close
            </Button>
            <iframe
              src={`https://www.youtube.com/embed/${selectedTrailer}?autoplay=1&controls=1&showinfo=0&rel=0&modestbranding=1`}
              className="w-full h-full rounded-lg"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Advertisement Section - Only show if not premium */}
      {!isPremium && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-center text-white">
            <h3 className="text-xl font-bold mb-2">🎬 Movie Streaming Platform</h3>
            <p className="mb-4">Get unlimited access to thousands of movies and shows!</p>
            <Button 
              variant="outline" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => setIsPremium(true)}
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MovieDetails;