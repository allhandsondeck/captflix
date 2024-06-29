<script setup lang="ts">
import { defineProps } from 'vue';
import type { Movie } from '@/types/movie';
import type { Show } from '@/types/movieAsSearchResult';

defineProps<{
  movie: Movie | Show;
}>();
</script>

<template>
  <div
    class="movie-item"
    :style="{ backgroundImage: movie.image ? 'url(' + movie.image.medium + ')' : '' }"
  >
    <img v-if="movie.image" :src="movie.image.medium" alt="movie poster" />
    <div class="content">
      <h3>{{ movie.name }}</h3>
    </div>
  </div>
</template>

<style scoped>
.movie-item {
  position: relative;
  width: 150px;
  height: 200px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px; /* Rounded corners */
  overflow: hidden; /* Ensures nothing spills outside the border-radius */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease; /* Smooth transition for shadow as well */
}

.movie-item img {
  width: 100%; /* Ensure the image spans the full width of its container */
  height: 100%; /* Ensure the image spans the full height of its container */
  object-fit: contain; /* This will make sure the image is contained within the bounds of its container */
  position: absolute; /* Position the image absolutely within its parent container */
  top: 0;
  left: 0;
}

.movie-item:hover {
  transform: scale(1.05); /* Slightly reduced scale for subtlety */
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2); /* Enhanced shadow on hover for a "lifting" effect */
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  transition: opacity 0.3s ease;
}

@media (min-width: 1024px) {
  .movie-item {
    width: 250px;
    height: 350px;
  }
}
</style>
