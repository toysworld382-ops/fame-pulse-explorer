import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const newsApiKey = Deno.env.get('NEWS_API_KEY');
    
    if (!newsApiKey) {
      throw new Error('News API key not configured');
    }

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=entertainment OR movie OR celebrity OR bollywood OR hollywood&sortBy=publishedAt&pageSize=6&apiKey=${newsApiKey}`
    );

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform News API data to match our NewsSection component
    const transformedNews = data.articles.map((article: any) => ({
      title: article.title,
      excerpt: article.description || 'Read more to discover the latest entertainment news...',
      image: article.urlToImage || '/placeholder.svg',
      category: 'Entertainment',
      timeAgo: new Date(article.publishedAt).toLocaleDateString(),
      isBreaking: Math.random() > 0.7, // Random breaking news indicator
      url: article.url
    }));

    return new Response(JSON.stringify({ news: transformedNews }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching entertainment news:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});