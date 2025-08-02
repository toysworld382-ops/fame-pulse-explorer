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
    const movieId = url.searchParams.get('id');
    const mediaType = url.searchParams.get('type') || 'movie';

    if (!movieId) {
      throw new Error('Movie ID is required');
    }

    // Fetch main details with all cast and recommended movies
    const detailsResponse = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${movieId}?api_key=${tmdbApiKey}&append_to_response=credits,videos,similar,recommendations,reviews`
    );

    if (!detailsResponse.ok) {
      throw new Error(`TMDB API error: ${detailsResponse.status}`);
    }

    const details = await detailsResponse.json();
    
    // Transform the data
    const transformedDetails = {
      id: details.id,
      title: details.title || details.name,
      original_title: details.original_title || details.original_name,
      overview: details.overview,
      poster_path: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : null,
      backdrop_path: details.backdrop_path ? `https://image.tmdb.org/t/p/original${details.backdrop_path}` : null,
      release_date: details.release_date || details.first_air_date,
      runtime: details.runtime || details.episode_run_time?.[0],
      genres: details.genres?.map((g: any) => g.name) || [],
      vote_average: details.vote_average,
      vote_count: details.vote_count,
      popularity: details.popularity,
      original_language: details.original_language,
      production_companies: details.production_companies?.map((pc: any) => pc.name) || [],
      production_countries: details.production_countries?.map((pc: any) => pc.name) || [],
      budget: details.budget,
      revenue: details.revenue,
      tagline: details.tagline,
      homepage: details.homepage,
      status: details.status,
      media_type: mediaType,
      
      // TV Series specific
      number_of_seasons: details.number_of_seasons,
      number_of_episodes: details.number_of_episodes,
      in_production: details.in_production,
      networks: details.networks?.map((n: any) => n.name) || [],
      
      // Cast and Crew (show all cast members)
      cast: details.credits?.cast?.map((person: any) => ({
        id: person.id,
        name: person.name,
        character: person.character,
        profile_path: person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : null,
      })) || [],
      
      crew: details.credits?.crew?.filter((person: any) => 
        ['Director', 'Producer', 'Writer', 'Creator'].includes(person.job)
      ).slice(0, 10).map((person: any) => ({
        id: person.id,
        name: person.name,
        job: person.job,
        profile_path: person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : null,
      })) || [],
      
      // Videos (trailers, etc.)
      videos: details.videos?.results?.filter((video: any) => 
        video.site === 'YouTube' && video.type === 'Trailer'
      ).slice(0, 3).map((video: any) => ({
        id: video.id,
        key: video.key,
        name: video.name,
        type: video.type,
      })) || [],
      
      // Similar movies/shows
      similar: details.similar?.results?.slice(0, 6).map((item: any) => ({
        id: item.id,
        title: item.title || item.name,
        poster_path: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : null,
        release_date: item.release_date || item.first_air_date,
        vote_average: item.vote_average,
        media_type: mediaType,
      })) || [],
      
      // Recommended movies/shows
      recommended: details.recommendations?.results?.slice(0, 6).map((item: any) => ({
        id: item.id,
        title: item.title || item.name,
        poster_path: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : null,
        release_date: item.release_date || item.first_air_date,
        vote_average: item.vote_average,
        media_type: mediaType,
      })) || [],
      
      // Reviews
      reviews: details.reviews?.results?.slice(0, 3).map((review: any) => ({
        id: review.id,
        author: review.author,
        content: review.content.substring(0, 500) + (review.content.length > 500 ? '...' : ''),
        rating: review.author_details?.rating,
        created_at: review.created_at,
      })) || [],
    };

    return new Response(JSON.stringify(transformedDetails), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching movie details:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});