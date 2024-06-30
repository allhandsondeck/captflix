import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import {
  debounce,
  getGroupedAndSortedMovies,
  groupMoviesByGenre,
  sortMoviesByRating
} from '../helpers';
import { ref } from 'vue';

describe('debounce function', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should delay the function call by the specified delay', () => {
    // Arrange
    const func = vi.fn();
    const delay = 200;
    const searchTerm = ref('');
    const debouncedFunc = debounce(func, delay, searchTerm);

    // Act
    searchTerm.value = 'test';
    debouncedFunc('test');
    vi.advanceTimersByTime(199);

    // Assert
    expect(func).not.toHaveBeenCalled();

    // Act
    vi.advanceTimersByTime(1);

    // Assert
    expect(func).toHaveBeenCalled();
  });

  it('should not call the function if the searchTerm has changed', () => {
    // Arrange
    const func = vi.fn();
    const delay = 200;
    const searchTerm = ref('');
    const debouncedFunc = debounce(func, delay, searchTerm);

    // Act
    searchTerm.value = 'test';
    debouncedFunc('test');
    searchTerm.value = 'changed';
    vi.advanceTimersByTime(200);

    // Assert
    expect(func).not.toHaveBeenCalled();
  });

  it('should call the function with the correct context and arguments', () => {
    // Arrange
    const func = vi.fn();
    const delay = 200;
    const searchTerm = ref('');
    const context = { some: 'context' };
    const debouncedFunc = debounce(func, delay, searchTerm).bind(context);

    // Act
    searchTerm.value = 'test';
    debouncedFunc('test');
    vi.advanceTimersByTime(200);

    // Assert
    expect(func).toHaveBeenCalledWith('test');
    expect(func.mock.instances[0]).toBe(context);
  });

  it('should only call the function once if invoked multiple times within the delay', () => {
    // Arrange
    const func = vi.fn();
    const delay = 200;
    const searchTerm = ref('');
    const debouncedFunc = debounce(func, delay, searchTerm);

    // Act
    searchTerm.value = 'test';
    debouncedFunc('test');
    vi.advanceTimersByTime(100);
    debouncedFunc('test');
    vi.advanceTimersByTime(100);
    debouncedFunc('test');
    vi.advanceTimersByTime(200);

    // Assert
    expect(func).toHaveBeenCalledTimes(1);
  });
});

describe('getGroupedAndSortedMovies function', () => {
  it('should group movies by genres', () => {
    // Arrange
    const movies = [
      { name: 'Movie A', genres: ['Action'], rating: { average: 8 } },
      { name: 'Movie B', genres: ['Action'], rating: { average: 7 } },
      { name: 'Movie C', genres: ['Drama'], rating: { average: 9 } },
      { name: 'Show A', genres: ['Drama'], rating: { average: 8 } }
    ];

    // Act
    const result = getGroupedAndSortedMovies(movies);

    // Assert
    expect(result).toHaveProperty('Action');
    expect(result).toHaveProperty('Drama');
    expect(result['Action']).toHaveLength(2);
    expect(result['Drama']).toHaveLength(2);
  });

  it('should sort movies by rating in descending order within each genres', () => {
    // Arrange
    const movies = [
      { name: 'Movie A', genres: ['Action'], rating: { average: 7 } },
      { name: 'Movie B', genres: ['Action'], rating: { average: 9 } },
      { name: 'Movie C', genres: ['Action'], rating: { average: 8 } }
    ];

    // Act
    const result = getGroupedAndSortedMovies(movies);

    // Assert
    expect(result['Action'][0].name).toBe('Movie B');
    expect(result['Action'][1].name).toBe('Movie C');
    expect(result['Action'][2].name).toBe('Movie A');
  });

  it('should limit the number of movies per genres to 5', () => {
    // Arrange
    const movies = [
      { name: 'Movie A', genres: ['Action'], rating: { average: 7 } },
      { name: 'Movie B', genres: ['Action'], rating: { average: 9 } },
      { name: 'Movie C', genres: ['Action'], rating: { average: 8 } },
      { name: 'Movie D', genres: ['Action'], rating: { average: 6 } },
      { name: 'Movie E', genres: ['Action'], rating: { average: 5 } },
      { name: 'Movie F', genres: ['Action'], rating: { average: 4 } }
    ];

    // Act
    const result = getGroupedAndSortedMovies(movies);

    // Assert
    expect(result['Action']).toHaveLength(5);
  });

  it('should handle empty input', () => {
    // Arrange
    const movies = [];

    // Act
    const result = getGroupedAndSortedMovies(movies);

    // Assert
    expect(result).toEqual({});
  });

  it('should handle input with no genress', () => {
    // Arrange
    const movies = [
      { name: 'Movie A', genres: [], rating: { average: 7 } },
      { name: 'Movie B', genres: [], rating: { average: 9 } }
    ];

    // Act
    const result = getGroupedAndSortedMovies(movies);

    // Assert
    expect(result).toEqual({});
  });

  it('should handle movies with multiple genress', () => {
    // Arrange
    const movies = [
      { name: 'Movie A', genres: ['Action', 'Drama'], rating: { average: 7 } },
      { name: 'Movie B', genres: ['Action', 'Thriller'], rating: { average: 9 } },
      { name: 'Movie C', genres: ['Drama'], rating: { average: 8 } },
      { name: 'Show A', genres: ['Thriller'], rating: { average: 8 } }
    ];

    // Act
    const result = getGroupedAndSortedMovies(movies);

    // Assert
    expect(result).toHaveProperty('Action');
    expect(result).toHaveProperty('Drama');
    expect(result).toHaveProperty('Thriller');
    expect(result['Action']).toHaveLength(2);
    expect(result['Drama']).toHaveLength(2);
    expect(result['Thriller']).toHaveLength(2);
  });
});

describe('groupMoviesByGenre function', () => {
  it('should correctly group movies by their genres', () => {
    // Arrange
    const movies = [
      { id: 1, name: 'Movie 1', genres: ['Action', 'Comedy'] },
      { id: 2, name: 'Movie 2', genres: ['Comedy'] },
      { id: 3, name: 'Movie 3', genres: ['Action', 'Drama'] }
    ];

    const expectedGrouping = {
      Action: [
        { id: 1, name: 'Movie 1', genres: ['Action', 'Comedy'] },
        { id: 3, name: 'Movie 3', genres: ['Action', 'Drama'] }
      ],
      Comedy: [
        { id: 1, name: 'Movie 1', genres: ['Action', 'Comedy'] },
        { id: 2, name: 'Movie 2', genres: ['Comedy'] }
      ],
      Drama: [{ id: 3, name: 'Movie 3', genres: ['Action', 'Drama'] }]
    };

    // Act
    const result = groupMoviesByGenre(movies);

    // Assert
    expect(result).toEqual(expectedGrouping);
  });

  it('should group movies by genre', () => {
    // Arrange
    const movies = [
      { name: 'Movie A', genres: ['Action'], rating: { average: 8 } },
      { name: 'Movie B', genres: ['Action'], rating: { average: 7 } },
      { name: 'Movie C', genres: ['Drama'], rating: { average: 9 } },
      { name: 'Show A', genres: ['Drama'], rating: { average: 8 } }
    ];

    // Act
    const result = groupMoviesByGenre(movies);

    // Assert
    expect(result).toHaveProperty('Action');
    expect(result).toHaveProperty('Drama');
    expect(result['Action']).toHaveLength(2);
    expect(result['Drama']).toHaveLength(2);
  });

  it('should handle empty input', () => {
    // Arrange
    const movies = [];

    // Act
    const result = groupMoviesByGenre(movies);

    // Assert
    expect(result).toEqual({});
  });

  it('should handle input with no genres', () => {
    // Arrange
    const movies = [
      { name: 'Movie A', genres: [], rating: { average: 7 } },
      { name: 'Movie B', genres: [], rating: { average: 9 } }
    ];

    // Act
    const result = groupMoviesByGenre(movies);

    // Assert
    expect(result).toEqual({});
  });

  it('should handle movies with multiple genres', () => {
    // Arrange
    const movies = [
      { name: 'Movie A', genres: ['Action', 'Drama'], rating: { average: 7 } },
      { name: 'Movie B', genres: ['Action', 'Thriller'], rating: { average: 9 } },
      { name: 'Movie C', genres: ['Drama'], rating: { average: 8 } },
      { name: 'Show A', genres: ['Thriller'], rating: { average: 8 } }
    ];

    // Act
    const result = groupMoviesByGenre(movies);

    // Assert
    expect(result).toHaveProperty('Action');
    expect(result).toHaveProperty('Drama');
    expect(result).toHaveProperty('Thriller');
    expect(result['Action']).toHaveLength(2);
    expect(result['Drama']).toHaveLength(2);
    expect(result['Thriller']).toHaveLength(2);
  });
});

describe('sortMoviesByRating function', () => {
  it('should correctly sort movies by their rating in descending order', () => {
    // Arrange
    const groupedMovies = {
      Action: [
        { id: 1, name: 'Movie 1', genress: ['Action', 'Comedy'], rating: { average: 2.4 } },
        { id: 3, name: 'Movie 3', genress: ['Action', 'Drama'], rating: { average: 8.2 } }
      ],
      Comedy: [
        { id: 1, name: 'Movie 1', genress: ['Action', 'Comedy'], rating: { average: 8.2 } },
        { id: 1, name: 'Movie 2', genress: ['Action', 'Comedy'], rating: { average: null } },
        { id: 2, name: 'Movie 3', genress: ['Comedy'], rating: { average: 5.3 } }
      ],
      Drama: [{ id: 3, name: 'Movie 3', genress: ['Action', 'Drama'], rating: { average: 8.2 } }]
    };
    const groupedAndSortedMovies = {
      Action: [
        { id: 3, name: 'Movie 3', genress: ['Action', 'Drama'], rating: { average: 8.2 } },
        { id: 1, name: 'Movie 1', genress: ['Action', 'Comedy'], rating: { average: 2.4 } }
      ],
      Comedy: [
        { id: 1, name: 'Movie 1', genress: ['Action', 'Comedy'], rating: { average: 8.2 } },
        { id: 2, name: 'Movie 3', genress: ['Comedy'], rating: { average: 5.3 } },
        { id: 1, name: 'Movie 2', genress: ['Action', 'Comedy'], rating: { average: null } }
      ],
      Drama: [{ id: 3, name: 'Movie 3', genress: ['Action', 'Drama'], rating: { average: 8.2 } }]
    };

    // Act
    const result = sortMoviesByRating(groupedMovies);

    // Assert
    expect(result).toEqual(groupedAndSortedMovies);
  });

  it('should sort movies by rating in descending order within each genre', () => {
    // Arrange
    const groupedMovies = {
      Action: [
        { name: 'Movie A', genres: ['Action'], rating: { average: 7 } },
        { name: 'Movie B', genres: ['Action'], rating: { average: 9 } },
        { name: 'Movie C', genres: ['Action'], rating: { average: 8 } }
      ]
    };

    // Act
    const result = sortMoviesByRating(groupedMovies);

    // Assert
    expect(result['Action'][0].name).toBe('Movie B');
    expect(result['Action'][1].name).toBe('Movie C');
    expect(result['Action'][2].name).toBe('Movie A');
  });

  it('should limit the number of movies per genre to 5', () => {
    // Arrange
    const groupedMovies = {
      Action: [
        { name: 'Movie A', genres: ['Action'], rating: { average: 7 } },
        { name: 'Movie B', genres: ['Action'], rating: { average: 9 } },
        { name: 'Movie C', genres: ['Action'], rating: { average: 8 } },
        { name: 'Movie D', genres: ['Action'], rating: { average: 6 } },
        { name: 'Movie E', genres: ['Action'], rating: { average: 5 } },
        { name: 'Movie F', genres: ['Action'], rating: { average: 4 } }
      ]
    };

    // Act
    const result = sortMoviesByRating(groupedMovies);

    // Assert
    expect(result['Action']).toHaveLength(5);
  });

  it('should handle empty input', () => {
    // Arrange
    const groupedMovies = {};

    // Act
    const result = sortMoviesByRating(groupedMovies);

    // Assert
    expect(result).toEqual({});
  });

  it('should handle genres with no movies', () => {
    // Arrange
    const groupedMovies = {
      Action: [],
      Drama: []
    };

    // Act
    const result = sortMoviesByRating(groupedMovies);

    // Assert
    expect(result).toEqual({
      Action: [],
      Drama: []
    });
  });

  it('should handle movies with no rating', () => {
    // Arrange
    const groupedMovies = {
      Action: [
        { name: 'Movie A', genres: ['Action'], rating: { average: 7 } },
        { name: 'Movie B', genres: ['Action'], rating: null },
        { name: 'Movie C', genres: ['Action'], rating: { average: 8 } }
      ]
    };

    // Act
    const result = sortMoviesByRating(groupedMovies);

    // Assert
    expect(result['Action'][0].name).toBe('Movie C');
    expect(result['Action'][1].name).toBe('Movie A');
    expect(result['Action'][2].name).toBe('Movie B');
  });
});
