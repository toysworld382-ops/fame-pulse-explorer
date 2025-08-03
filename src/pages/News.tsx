import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, Newspaper, TrendingUp, Filter } from "lucide-react";

const News = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'all', 'bollywood', 'hollywood', 'k-drama', 'tollywood', 'celebrity', 'box-office'
  ];

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke('get-entertainment-news');
      setNews(data?.articles || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      // Mock news data as fallback
      setNews([
        {
          id: 1,
          title: "Shah Rukh Khan's Next Film Creates Record Pre-Booking",
          excerpt: "The upcoming action thriller breaks all previous booking records...",
          category: "Bollywood",
          publishedAt: "2024-01-20",
          image: "/placeholder.svg",
          trending: true
        },
        {
          id: 2,
          title: "Marvel Announces Phase 5 Release Dates",
          excerpt: "Exciting new superhero movies coming to theaters...",
          category: "Hollywood",
          publishedAt: "2024-01-19",
          image: "/placeholder.svg",
          trending: false
        },
        {
          id: 3,
          title: "K-Drama 'Kingdom' Season 3 Confirmed",
          excerpt: "The zombie historical drama returns with new episodes...",
          category: "K-Drama",
          publishedAt: "2024-01-18",
          image: "/placeholder.svg",
          trending: true
        }
      ]);
    }
    setLoading(false);
  };

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(article => article.category?.toLowerCase().includes(selectedCategory));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-background via-primary/10 to-background py-16">
        <div className="container px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Entertainment
              <span className="block bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                News
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest happenings in the world of entertainment
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border">
        <div className="container px-4">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">News Categories</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-12">
        <div className="container px-4">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Trending News</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-muted animate-pulse rounded-lg h-96"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((article) => (
                <Card 
                  key={article.id}
                  className="group cursor-pointer hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card to-card/80 border-border/50 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {article.trending && (
                      <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    <Badge className="absolute bottom-3 left-3 bg-primary/90 text-primary-foreground">
                      {article.category}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>5 min read</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {filteredNews.length === 0 && !loading && (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No news found for this category.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default News;