<script setup lang="ts">
import type { MovieDetails } from '@/types/movieDetails';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchMovieDetails } from '@/services/dataService';

const route = useRoute();
const router = useRouter();
const movieId = route.params.id as string;
const movie = ref<MovieDetails | null>(null);

onMounted(async () => {
  try {
    movie.value = await fetchMovieDetails(movieId);
  } catch (error) {
    console.error('Failed to fetch movie details:', error);
  }
});

const goToDashboard = (): void => {
  router.push('/');
};
</script>

<template>
  <button class="back-button" @click="goToDashboard">Back to Dashboard</button>
  <div class="details" v-if="movie">
    <h1>{{ movie.name }}</h1>
    <h2>Genre(s)</h2>
    <p v-for="genre in movie.genres" :key="genre">{{ genre }}</p>
    <h2>Average Runtime</h2>
    <p>{{ movie.averageRuntime }} minutes</p>
    <h2>Average Rating</h2>
    <p>{{ movie.rating.average ?? 'Not available' }}</p>
    <h2>Summary</h2>
    <p v-html="movie.summary"></p>
  </div>
</template>

<style>
.back-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 16px;
  margin: 10px 0;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #0056b3;
}

.details {
  max-width: 1024px;
}
</style>
