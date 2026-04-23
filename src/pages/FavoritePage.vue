<script setup>
import {computed} from "vue";
import {storeToRefs} from "pinia";
import AppHeader from "../components/AppHeader/AppHeader.vue";
import AppCatalog from "../components/AppCatalog/AppCatalog.vue";
import {useMovieStore} from "../stores/MovieStore.js";

const movieStore = useMovieStore()
const {favoriteMovies} = storeToRefs(movieStore);

const favoritesCountLabel = computed(() => {
  const count = favoriteMovies.value.length
  return `${count} movie${count === 1 ? "" : "s"} saved`
})
</script>

<template>
  <AppHeader />

  <main class="page favorites-page">
    <section class="page__hero favorites-page__hero app-motion--fade-up">
      <p class="page__kicker">Your Collection</p>
      <h1 class="page__title">Favorites</h1>
      <p class="page__subtitle">
        {{ favoritesCountLabel }}. Click the heart again to remove a movie.
      </p>
    </section>

    <AppCatalog :movies="favoriteMovies" />
  </main>
</template>

<style scoped lang="scss">
.favorites-page__hero {
  animation-delay: 100ms;
}
</style>
