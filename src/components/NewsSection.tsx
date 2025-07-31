import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ChevronRight, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface NewsItem {
  title: string;
  excerpt: string;
  image: string;
  category: string;
  timeAgo: string;
  isBreaking: boolean;
  url?: string;
}

export const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-entertainment-news');
        
        if (error) {
          console.error('Error fetching news:', error);
          return;
        }
        
        setNews(data.news || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="container">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-accent to-primary">
              <Newspaper className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Latest News</h2>
              <p className="text-muted-foreground">Stay updated with entertainment industry</p>
            </div>
          </div>
          <Button variant="outline" className="group">
            All News
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="bg-muted h-48"></div>
                <div className="p-6">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              </Card>
            ))
          ) : (
            news.map((article, index) => (
              <Card key={index} className="group overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--shadow-card)] hover:scale-105">
                {/* Article Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-xs font-medium text-primary-foreground">{article.category}</span>
                  </div>

                  {/* Breaking News Badge */}
                  {article.isBreaking && (
                    <div className="absolute top-3 right-3 bg-destructive/90 backdrop-blur-sm rounded-full px-3 py-1 animate-pulse">
                      <span className="text-xs font-medium text-destructive-foreground">BREAKING</span>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {article.timeAgo}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-primary-glow"
                      onClick={() => article.url && window.open(article.url, '_blank')}
                    >
                      Read More
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};