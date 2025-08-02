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
    const personId = url.searchParams.get('id');

    if (!personId) {
      throw new Error('Person ID is required');
    }

    // Fetch person details with credits
    const detailsResponse = await fetch(
      `https://api.themoviedb.org/3/person/${personId}?api_key=${tmdbApiKey}&append_to_response=movie_credits,tv_credits`
    );

    if (!detailsResponse.ok) {
      throw new Error(`TMDB API error: ${detailsResponse.status}`);
    }

    const details = await detailsResponse.json();
    
    // Transform the data
    const transformedDetails = {
      id: details.id,
      name: details.name,
      biography: details.biography,
      birthday: details.birthday,
      deathday: details.deathday,
      place_of_birth: details.place_of_birth,
      profile_path: details.profile_path ? `https://image.tmdb.org/t/p/w500${details.profile_path}` : null,
      known_for_department: details.known_for_department,
      popularity: details.popularity,
      
      // Movie credits
      movie_credits: details.movie_credits?.cast?.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        character: movie.character,
        poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        media_type: 'movie',
      })) || [],
      
      // TV credits
      tv_credits: details.tv_credits?.cast?.map((show: any) => ({
        id: show.id,
        name: show.name,
        character: show.character,
        poster_path: show.poster_path ? `https://image.tmdb.org/t/p/w300${show.poster_path}` : null,
        first_air_date: show.first_air_date,
        vote_average: show.vote_average,
        media_type: 'tv',
      })) || [],
    };

    return new Response(JSON.stringify(transformedDetails), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching person details:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});