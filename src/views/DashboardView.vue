<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import MovieItem from '../components/MovieItem.vue';
import { fetchMovies, searchMovies } from '../services/dataService';
import type { Movie } from '@/types/movie';
import type { Show } from '@/types/movieAsSearchResult';

const groupedMovies = ref<(Movie | Show)[] | null>(null);
const searchTerm = ref('');

// Ensure debounce function is correctly implemented
function debounce(func: Function, delay: number): Function {
  let debounceTimer: any;
  return function (this: any, ...args: any[]): void {
    const context = this;
    const currentSearchTerm = args[0]; // Capture the current searchTerm
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (searchTerm.value === currentSearchTerm) {
        // Check if searchTerm has changed
        func.apply(context, args);
      }
    }, delay);
  };
}

const debounceSearch = debounce(async (query: string) => {
  if (query.trim()) {
    const fetchedMovies = await searchMovies(query);
    groupAndSortMovies(fetchedMovies);
  }
}, 500);

// Watch for changes in searchTerm and call debounceSearch
watch(searchTerm, (newValue) => {
  if (!newValue.trim()) {
    getGroupedAndSortedMovies();
  } else {
    debounceSearch(newValue);
  }
});

onMounted(async () => {
  getGroupedAndSortedMovies();
});

async function getGroupedAndSortedMovies() {
  try {
    const fetchedMovies = await fetchMovies();
    groupAndSortMovies(fetchedMovies);
  } catch (error) {
    console.error('Failed to fetch movies:', error);
  }
}

function groupAndSortMovies(movies: Movie[] | Show[]) {
  const tempGroupedMovies = movies.reduce(
    (acc: Record<string, (Movie | Show)[]>, movie: Movie | Show) => {
      movie.genres.forEach((genre) => {
        if (!acc[genre]) {
          acc[genre] = [];
        }
        if (acc[genre].length < 5) {
          acc[genre].push(movie);
        }
      });
      return acc;
    },
    {}
  );

  // Sort movies within each genre by rating.average, handling missing values
  Object.keys(tempGroupedMovies).forEach((genre) => {
    tempGroupedMovies[genre] = tempGroupedMovies[genre].sort((a, b) => {
      const ratingA = a.rating?.average ?? 0; // Treat missing average as 0
      const ratingB = b.rating?.average ?? 0; // Treat missing average as 0
      return ratingB - ratingA; // For descending order, swap ratingA and ratingB for ascending
    });
  });

  groupedMovies.value = tempGroupedMovies;
}
</script>

<template>
  <main>
    <input v-model="searchTerm" placeholder="Search movies..." class="search-input" />
    <section v-for="(genreMovies, genre) in groupedMovies" :key="genre">
      <h2 class="genre-title">{{ genre }}</h2>
      <!-- Add class here -->
      <div class="movies-container">
        <router-link
          class="movie-card"
          v-for="movie in genreMovies"
          :key="movie.id"
          :to="{ name: 'movie-details', params: { id: movie.id } }"
        >
          <MovieItem :movie="movie" />
        </router-link>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.movies-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.movie-card {
  margin: 20px;
}
.genre-title {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
}

@media (min-width: 1024px) {
  .movie-card {
    margin: 40px;
  }
  .search-input {
    font-size: 20px; /* Increase font size */
    padding: 10px 20px; /* Increase padding */
    width: 20%; /* Adjust width as needed */
    margin: 20px 0; /* Optional: add some margin around the input for better spacing */
  }
}
</style>
