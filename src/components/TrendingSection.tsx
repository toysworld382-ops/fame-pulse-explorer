import { MovieCard } from "./MovieCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp } from "lucide-react";
import trendingMovies from "@/assets/trending-movies.jpg";

export const TrendingSection = () => {
  // Mock data - in real app this would come from API
  const trendingMovies_data = [
    {
      title: "Spider-Man: No Way Home",
      year: "2021",
      rating: 8.4,
      genre: "Action",
      image: trendingMovies,
      language: "English"
    },
    {
      title: "Avengers: Endgame",
      year: "2019", 
      rating: 8.4,
      genre: "Action",
      image: trendingMovies,
      language: "English"
    },
    {
      title: "Parasite",
      year: "2019",
      rating: 8.6,
      genre: "Thriller",
      image: trendingMovies,
      language: "Korean"
    },
    {
      title: "RRR",
      year: "2022",
      rating: 8.8,
      genre: "Action",
      image: trendingMovies,
      language: "Telugu"
    },
    {
      title: "Dangal",
      year: "2016",
      rating: 8.4,
      genre: "Drama",
      image: trendingMovies,
      language: "Hindi"
    },
    {
      title: "Squid Game",
      year: "2021",
      rating: 8.0,
      genre: "Thriller",
      image: trendingMovies,
      language: "Korean"
    }
  ];

  return (
    <section className="py-12 px-4">
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
          {trendingMovies_data.map((movie, index) => (
            <MovieCard
              key={index}
              title={movie.title}
              year={movie.year}
              rating={movie.rating}
              genre={movie.genre}
              image={movie.image}
              language={movie.language}
            />
          ))}
        </div>
      </div>
    </section>
  );
};