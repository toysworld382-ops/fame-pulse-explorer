import { Play, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroCinema from "@/assets/hero-cinema.jpg";

export const Hero = () => {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroCinema})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 text-left max-w-2xl">
        <div className="space-y-6 animate-slide-in">
          <div className="inline-flex items-center space-x-2 bg-primary/20 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/30">
            <Star className="w-4 h-4 text-primary" fill="currentColor" />
            <span className="text-sm font-medium text-primary">Trending Now</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Discover Your
            <span className="block bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Next Obsession
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-lg">
            Explore movies, series, and celebrities from Bollywood, Hollywood, K-Drama, and beyond. 
            Get personalized recommendations powered by your taste.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="hero" 
              size="lg" 
              className="group"
              onClick={() => {
                document.querySelector('section:nth-of-type(2)')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Start Exploring
            </Button>
            <Button 
              variant="glass" 
              size="lg"
              onClick={() => {
                alert('Watchlist feature coming soon!');
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Watchlist
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-40 left-20 w-32 h-32 bg-primary-glow/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
    </section>
  );
};