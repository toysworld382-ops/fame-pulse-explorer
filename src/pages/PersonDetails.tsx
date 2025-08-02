import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star, Calendar, Users } from "lucide-react";

interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string;
  deathday: string | null;
  place_of_birth: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  movie_credits: Array<{
    id: number;
    title: string;
    character?: string;
    job?: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    media_type: string;
  }>;
  tv_credits: Array<{
    id: number;
    name: string;
    character?: string;
    job?: string;
    poster_path: string | null;
    first_air_date: string;
    vote_average: number;
    media_type: string;
  }>;
}

const PersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState<PersonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        const response = await fetch(`https://dylctqimxhessygpqwze.supabase.co/functions/v1/get-person-details?id=${id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bGN0cWlteGhlc3N5Z3Bxd3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDQ4MjksImV4cCI6MjA2OTUyMDgyOX0.V4gJ4ykUYWZleYobr2O3NhIu36_2AIMcvUU3sBRYxSA`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bGN0cWlteGhlc3N5Z3Bxd3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDQ4MjksImV4cCI6MjA2OTUyMDgyOX0.V4gJ4ykUYWZleYobr2O3NhIu36_2AIMcvUU3sBRYxSA',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch person details');
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        console.error('Error fetching person details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPersonDetails();
    }
  }, [id]);

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
            <h2 className="text-2xl font-bold mb-4">Person not found</h2>
            <Button onClick={() => navigate('/')}>Go Back Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const allCredits = [
    ...details.movie_credits.map(credit => ({ 
      ...credit, 
      title: credit.title, 
      media_type: 'movie',
      date: credit.release_date
    })),
    ...details.tv_credits.map(credit => ({ 
      ...credit, 
      title: credit.name, 
      media_type: 'tv',
      date: credit.first_air_date
    }))
  ].sort((a, b) => {
    const dateA = new Date(a.date || '').getTime();
    const dateB = new Date(b.date || '').getTime();
    return dateB - dateA;
  });

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile */}
          <div className="lg:col-span-1">
            {details.profile_path && (
              <img
                src={details.profile_path}
                alt={details.name}
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
            )}
          </div>

          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{details.name}</h1>
              <p className="text-lg text-primary mb-4">{details.known_for_department}</p>
            </div>

            {/* Basic Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {details.birthday && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Born: {new Date(details.birthday).toLocaleDateString()}</span>
                </div>
              )}
              
              {details.deathday && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Died: {new Date(details.deathday).toLocaleDateString()}</span>
                </div>
              )}
              
              {details.place_of_birth && (
                <div className="text-muted-foreground">
                  Born in: {details.place_of_birth}
                </div>
              )}
            </div>

            {/* Biography */}
            {details.biography && (
              <div>
                <h2 className="text-2xl font-semibold mb-3">Biography</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {details.biography}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Known For / Filmography */}
      {allCredits.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-6">Known For</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allCredits.slice(0, 20).map((credit) => (
              <Card 
                key={`${credit.media_type}-${credit.id}`}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/details/${credit.media_type}/${credit.id}`)}
              >
                <CardContent className="p-0">
                  {credit.poster_path ? (
                    <img
                      src={credit.poster_path}
                      alt={credit.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <div className="text-center p-4">
                        <h3 className="font-medium text-sm">{credit.title}</h3>
                      </div>
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate">{credit.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {credit.character || credit.job}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {credit.date ? new Date(credit.date).getFullYear() : ''}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{credit.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
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

export default PersonDetails;