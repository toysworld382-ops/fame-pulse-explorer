import { Play, Plus, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SubscriptionModal } from "./SubscriptionModal";
import heroCinema from "@/assets/hero-cinema.jpg";

export const Hero = () => {
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);

  return (
    <>
      <SubscriptionModal open={subscriptionOpen} onOpenChange={setSubscriptionOpen} />
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        {/* Fallback background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroCinema})` }}
        />
        
        {/* Video Background - Replace with actual trailer when available */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          autoPlay
          muted
          loop
          playsInline
          poster={heroCinema}
        >
          <source src="/placeholder-trailer.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 text-left max-w-4xl">
        <div className="space-y-8 animate-slide-in">
          <div className="inline-flex items-center space-x-2 bg-primary/20 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/30">
            <Star className="w-4 h-4 text-primary" fill="currentColor" />
            <span className="text-sm font-medium text-primary">Now Playing: Latest Blockbusters</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Discover Your
            <span className="block bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Next Obsession
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Explore movies, series, and celebrities from Bollywood, Hollywood, K-Drama, and beyond. 
            Get personalized recommendations powered by your taste.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="hero" 
              size="lg" 
              className="group w-full sm:w-auto"
              onClick={() => {
                document.querySelector('[data-section="trending"]')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Start Exploring
            </Button>
            <Button 
              variant="premium" 
              size="lg"
              className="w-full sm:w-auto group"
              onClick={() => setSubscriptionOpen(true)}
            >
              <Crown className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Go Premium
            </Button>
          </div>
          
          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 hover:bg-card/80 transition-colors">
              <h3 className="font-semibold text-primary mb-2">No Ads Experience</h3>
              <p className="text-sm text-muted-foreground">Enjoy uninterrupted entertainment</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 hover:bg-card/80 transition-colors">
              <h3 className="font-semibold text-primary mb-2">HD Quality</h3>
              <p className="text-sm text-muted-foreground">Crystal clear viewing experience</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 hover:bg-card/80 transition-colors">
              <h3 className="font-semibold text-primary mb-2">All Platforms</h3>
              <p className="text-sm text-muted-foreground">Netflix, Prime, Disney+ and more</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float hidden lg:block" />
      <div className="absolute bottom-40 left-20 w-32 h-32 bg-primary-glow/20 rounded-full blur-2xl animate-float hidden lg:block" style={{ animationDelay: '1s' }} />
    </section>
    </>
  );
};