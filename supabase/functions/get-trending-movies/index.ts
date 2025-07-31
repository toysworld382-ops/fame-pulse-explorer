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
    const tmdbApiKey = Deno.env.get('TMDB_API_KEY');
    
    if (!tmdbApiKey) {
      throw new Error('TMDB API key not configured');
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${tmdbApiKey}`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform TMDB data to match our MovieCard component props
    const transformedMovies = data.results.slice(0, 6).map((item: any) => ({
      title: item.title || item.name,
      year: new Date(item.release_date || item.first_air_date || '').getFullYear().toString(),
      rating: item.vote_average,
      genre: item.media_type === 'movie' ? 'Movie' : 'TV Series',
      image: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      language: item.original_language.toUpperCase()
    }));

    return new Response(JSON.stringify({ movies: transformedMovies }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});