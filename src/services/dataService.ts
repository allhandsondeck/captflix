import type { Movie } from '@/types/movie';
import type { Show } from '@/types/movieAsSearchResult';
import type { MovieDetails } from '@/types/movieDetails';

const TVMAZE_API_URL = 'http://api.tvmaze.com';

export async function fetchMovies(): Promise<Movie[]> {
  const response = await fetch(`${TVMAZE_API_URL}/shows?page=1`);
  if (!response.ok) handleError();
  return response.json();
}

export async function fetchMovieDetails(id: string): Promise<MovieDetails> {
  const response = await fetch(`${TVMAZE_API_URL}/shows/${id}`);
  if (!response.ok) handleError();
  return response.json();
}

export async function searchMovies(query: string): Promise<Show[]> {
  const response = await fetch(`${TVMAZE_API_URL}/search/shows?q=${encodeURIComponent(query)}`);
  if (!response.ok) handleError();
  const searchResults = await response.json();

  return searchResults.map((result: { show: Movie }) => result.show);
}

function handleError(): void {
  throw new Error('Network response was not ok');
  // Potential logging to a centralised logging service
}
