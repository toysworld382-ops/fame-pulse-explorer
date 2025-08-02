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

    const url = new URL(req.url);
    const genre = url.searchParams.get('genre');

    if (!genre) {
      throw new Error('Genre is required');
    }

    // First, get genre list to find the genre ID
    const genresResponse = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbApiKey}`
    );

    if (!genresResponse.ok) {
      throw new Error(`TMDB API error: ${genresResponse.status}`);
    }

    const genresData = await genresResponse.json();
    const genreObj = genresData.genres.find((g: any) => 
      g.name.toLowerCase() === genre.toLowerCase()
    );

    if (!genreObj) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch movies by genre
    const moviesResponse = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&with_genres=${genreObj.id}&sort_by=popularity.desc&page=1`
    );

    if (!moviesResponse.ok) {
      throw new Error(`TMDB API error: ${moviesResponse.status}`);
    }

    const moviesData = await moviesResponse.json();

    return new Response(JSON.stringify(moviesData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching genre movies:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});