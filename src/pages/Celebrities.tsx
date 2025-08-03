import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Star, Users, Film, Tv, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Celebrities = () => {
  const [celebrities, setCelebrities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const navigate = useNavigate();

  const industries = [
    'all', 'bollywood', 'hollywood', 'k-drama', 'tollywood'
  ];

  useEffect(() => {
    fetchCelebrities();
  }, [selectedIndustry]);

  const fetchCelebrities = async () => {
    setLoading(true);
    try {
      // Mock celebrity data for now
      const mockCelebrities = [
        { id: 1, name: "Shah Rukh Khan", industry: "Bollywood", image: "/placeholder.svg", rating: 9.2, movies: 80 },
        { id: 2, name: "Leonardo DiCaprio", industry: "Hollywood", image: "/placeholder.svg", rating: 9.0, movies: 35 },
        { id: 3, name: "Lee Min-ho", industry: "K-Drama", image: "/placeholder.svg", rating: 8.8, movies: 25 },
        { id: 4, name: "Prabhas", industry: "Tollywood", image: "/placeholder.svg", rating: 8.9, movies: 22 },
        { id: 5, name: "Priyanka Chopra", industry: "Bollywood", image: "/placeholder.svg", rating: 8.7, movies: 65 },
        { id: 6, name: "Emma Stone", industry: "Hollywood", image: "/placeholder.svg", rating: 8.6, movies: 28 },
      ];
      
      const filtered = selectedIndustry === 'all' 
        ? mockCelebrities 
        : mockCelebrities.filter(cel => cel.industry.toLowerCase().includes(selectedIndustry));
      
      setCelebrities(filtered);
    } catch (error) {
      console.error('Error fetching celebrities:', error);
      setCelebrities([]);
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
              Meet Your
              <span className="block bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Favorite Stars
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the biggest names in entertainment across all industries
            </p>
          </div>
        </div>
      </section>

      {/* Industry Filter */}
      <section className="py-8 border-b border-border">
        <div className="container px-4">
          <div className="flex items-center gap-4 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Browse by Industry</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {industries.map((industry) => (
              <Button
                key={industry}
                variant={selectedIndustry === industry ? "default" : "outline"}
                onClick={() => setSelectedIndustry(industry)}
                className="capitalize"
              >
                {industry}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Celebrities Grid */}
      <section className="py-12">
        <div className="container px-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-muted animate-pulse rounded-lg h-96"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {celebrities.map((celebrity) => (
                <Card 
                  key={celebrity.id}
                  className="group cursor-pointer hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-card/80 border-border/50"
                  onClick={() => navigate(`/person/${celebrity.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={celebrity.image}
                        alt={celebrity.name}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground">
                        {celebrity.industry}
                      </Badge>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-2 text-white">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{celebrity.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                        {celebrity.name}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Film className="w-4 h-4" />
                          <span>{celebrity.movies} works</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>Celebrity</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {celebrities.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No celebrities found for this industry.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Celebrities;