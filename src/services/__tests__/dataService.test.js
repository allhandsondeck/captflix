import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchMovies, fetchMovieDetails, searchMovies } from '../dataService';

// eslint-disable-next-line no-undef
global.fetch = vi.fn();

describe('dataService', () => {
  beforeEach(() => {
    // Arrange: Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('fetchMovies should return a list of movies on success', async () => {
    // Arrange
    const mockMovies = [
      { id: 1, name: 'Movie 1' },
      { id: 2, name: 'Movie 2' }
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovies
    });

    // Act
    const movies = await fetchMovies();

    // Assert
    expect(movies).toEqual(mockMovies);
    expect(fetch).toHaveBeenCalledWith('http://api.tvmaze.com/shows?page=1');
  });

  it('fetchMovieDetails should return movie details on success', async () => {
    // Arrange
    const mockMovieDetails = { id: '1', name: 'Movie 1', summary: 'Summary of Movie 1' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovieDetails
    });

    // Act
    const movieDetails = await fetchMovieDetails('1');

    // Assert
    expect(movieDetails).toEqual(mockMovieDetails);
    expect(fetch).toHaveBeenCalledWith('http://api.tvmaze.com/shows/1');
  });

  it('searchMovies should return a list of shows on success', async () => {
    // Arrange
    const mockSearchResults = [{ show: { id: 1, name: 'Movie 1' } }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSearchResults
    });

    // Act
    const shows = await searchMovies('example query');

    // Assert
    expect(shows).toEqual(mockSearchResults.map((result) => result.show));
    expect(fetch).toHaveBeenCalledWith('http://api.tvmaze.com/search/shows?q=example%20query');
  });

  it('fetchMovies should throw an error on failure', async () => {
    // Arrange
    fetch.mockResolvedValueOnce({
      ok: false
    });

    // Act & Assert
    await expect(fetchMovies()).rejects.toThrow('Network response was not ok');
  });
});
