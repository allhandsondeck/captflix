import type { Movie } from '@/types/movie';
import type { Show } from '@/types/movieAsSearchResult';
import type { Ref } from 'vue';

/**
 * Creates a debounced function that delays invoking `func` until after `delay` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * @param func - The function to debounce.
 * @param delay - The number of milliseconds to delay.
 * @param searchTerm - A Vue ref object containing the current search term.
 * @returns The debounced function.
 */
export function debounce(
  func: (...args: any[]) => void,
  delay: number,
  searchTerm: Ref<string>
): (...args: any[]) => void {
  let debounceTimer: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]): void {
    const context = this;
    const currentSearchTerm = args[0];
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (searchTerm.value === currentSearchTerm) {
        func.apply(context, args);
      }
    }, delay);
  };
}

/**
 * Groups movies by genre and sorts them by rating in descending order.
 * Limits the number of movies per genre to 5.
 * @param movies - An array of movies or shows.
 * @returns An object with genres as keys and arrays of movies or shows as values.
 */
export function getGroupedAndSortedMovies(
  movies: (Movie | Show)[]
): Record<string, (Movie | Show)[]> {
  const groupedMovies = groupMoviesByGenre(movies);
  return sortMoviesByRating(groupedMovies);
}

/**
 * Groups movies or shows by their genres.
 * @param movies - An array of movies or shows.
 * @returns An object with genres as keys and arrays of movies or shows as values.
 */
export function groupMoviesByGenre(movies: (Movie | Show)[]): Record<string, (Movie | Show)[]> {
  return movies.reduce<Record<string, (Movie | Show)[]>>((acc, movie) => {
    movie.genres.forEach((genre) => {
      if (!acc[genre]) acc[genre] = [];
      acc[genre].push(movie);
    });
    return acc;
  }, {});
}

/**
 * Sorts movies or shows within each genre by their rating in descending order.
 * Limits the number of movies or shows per genre to 5.
 * @param groupedMovies - An object with genres as keys and arrays of movies or shows as values.
 * @returns The same object with each genre's array sorted by rating in descending order.
 */
export function sortMoviesByRating(
  groupedMovies: Record<string, (Movie | Show)[]>
): Record<string, (Movie | Show)[]> {
  Object.keys(groupedMovies).forEach((genre) => {
    groupedMovies[genre] = groupedMovies[genre]
      .sort((a, b) => {
        const ratingA = a.rating?.average ?? 0;
        const ratingB = b.rating?.average ?? 0;
        return ratingB - ratingA;
      })
      .slice(0, 5);
  });

  return groupedMovies;
}
