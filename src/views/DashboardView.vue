<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import MovieItem from '@/components/MovieItem.vue';
import { fetchMovies, searchMovies } from '@/services/dataService';
import type { Movie } from '@/types/movie';
import type { Show } from '@/types/movieAsSearchResult';
import { debounce, getGroupedAndSortedMovies } from '@/utils/helpers';

const groupedMovies = ref<Record<string, (Movie | Show)[]> | null>(null);
const searchTerm = ref('');

const debounceSearch = debounce(
  async (query: string) => {
    if (query.trim()) {
      const fetchedMovies = await searchMovies(query);
      setGroupedAndSortedMovies(fetchedMovies);
    }
  },
  500,
  searchTerm
);

watch(searchTerm, (newValue) => {
  const isInputFieldEmpty = !newValue.trim();
  if (isInputFieldEmpty) {
    setMovies();
  } else {
    debounceSearch(newValue);
  }
});

onMounted(async (): Promise<void> => {
  setMovies();
});

function setGroupedAndSortedMovies(fetchedMovies: (Movie | Show)[]): void {
  groupedMovies.value = getGroupedAndSortedMovies(fetchedMovies);
}

async function setMovies(): Promise<void> {
  try {
    const fetchedMovies = await fetchMovies();
    setGroupedAndSortedMovies(fetchedMovies);
  } catch (error) {
    console.error('Failed to fetch movies:', error);
  }
}
</script>

<template>
  <main>
    <input v-model="searchTerm" placeholder="Search movies..." class="search-input" />
    <section v-for="(genreMovies, genre) in groupedMovies" :key="genre">
      <h2 class="genre-title">{{ genre }}</h2>
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
    font-size: 20px;
    padding: 10px 20px;
    width: 20%;
    margin: 20px 0;
  }
}
</style>
