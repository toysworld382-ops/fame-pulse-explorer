import { Search, Star, Menu, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubscriptionModal } from "./SubscriptionModal";

export const Header = () => {
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <SubscriptionModal open={subscriptionOpen} onOpenChange={setSubscriptionOpen} />
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-primary-glow">
            <Star className="w-6 h-6 text-primary-foreground" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            FAME
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search movies, series, celebrities..."
              className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="text-foreground hover:text-primary"
            onClick={() => navigate('/')}
          >
            Home
          </Button>
          <Button 
            variant="ghost" 
            className="text-foreground hover:text-primary"
            onClick={() => navigate('/discover/movies')}
          >
            Movies
          </Button>
          <Button 
            variant="ghost" 
            className="text-foreground hover:text-primary"
            onClick={() => navigate('/discover/series')}
          >
            Series
          </Button>
          <Button 
            variant="ghost" 
            className="text-foreground hover:text-primary"
            onClick={() => navigate('/celebrities')}
          >
            Celebrities
          </Button>
          <Button 
            variant="ghost" 
            className="text-foreground hover:text-primary"
            onClick={() => navigate('/news')}
          >
            News
          </Button>
          <Button 
            variant="premium" 
            size="sm"
            onClick={() => setSubscriptionOpen(true)}
            className="group"
          >
            <Crown className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
            Premium
          </Button>
        </nav>

        {/* Mobile Menu */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => alert('Mobile menu coming soon!')}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </header>
    </>
  );
};