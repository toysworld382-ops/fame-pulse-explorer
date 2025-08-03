import { Star, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  id?: number;
  title: string;
  year: string;
  rating: number;
  genre: string;
  image: string;
  language: string;
  isLarge?: boolean;
  media_type?: string;
  className?: string;
}

export const MovieCard = ({ id, title, year, rating, genre, image, language, isLarge = false, media_type, className }: MovieCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (id) {
      const mediaType = media_type || (genre === 'TV Series' ? 'tv' : 'movie');
      navigate(`/details/${mediaType}/${id}`);
    }
  };
  return (
    <Card 
      className={`group relative overflow-hidden bg-gradient-to-b from-card to-card/80 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--shadow-card)] hover:scale-105 cursor-pointer ${isLarge ? 'aspect-[2/3] h-80' : 'aspect-[2/3] h-64'} ${className || ''}`}
      onClick={handleCardClick}
    >
      {/* Movie Poster */}
      <div className="relative h-full overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
          <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
          <span className="text-xs font-medium text-white">{rating}</span>
        </div>

        {/* Language Badge */}
        <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-xs font-medium text-primary-foreground">{language}</span>
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-2">
            <Button 
              variant="hero" 
              size="sm"
              onClick={() => alert(`Playing ${title}...`)}
            >
              <Play className="w-4 h-4" />
            </Button>
            <Button 
              variant="glass" 
              size="sm"
              onClick={() => alert(`Added ${title} to watchlist!`)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Movie Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-semibold text-white mb-1 line-clamp-1">{title}</h3>
          <div className="flex items-center justify-between text-sm text-white/80">
            <span>{year}</span>
            <span>{genre}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};