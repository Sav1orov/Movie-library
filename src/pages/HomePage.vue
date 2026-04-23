<script setup>
import {onMounted} from "vue";
import {storeToRefs} from "pinia";
import AppHeader from "../components/AppHeader/AppHeader.vue";
import AppCatalog from "../components/AppCatalog/AppCatalog.vue";
import {useMovieStore} from "../stores/MovieStore.js";

const movieStore = useMovieStore()
const {currentTopPage, topPagesCount} = storeToRefs(movieStore);

onMounted(() => {
  movieStore.fetchedTopFilms(1)
})

function onPageChange(pageNumber) {
  movieStore.fetchedTopFilms(pageNumber)
}
</script>

<template>
  <AppHeader />

  <main class="page home-page">
    <section class="page__hero home-page__hero app-motion--fade-up">
      <p class="page__kicker">Now Trending</p>
      <h1 class="page__title">Top Movies</h1>
      <p class="page__subtitle">
        Fresh ranking from Kinopoisk collection. Use the eye icon for details and the heart icon for your favorites.
      </p>
    </section>

    <AppCatalog
      :movies="movieStore.topMovies"
      :current-page="currentTopPage"
      :pages-count="topPagesCount"
      @page-change="onPageChange($event)"
    />
  </main>
</template>

<style scoped lang="scss">
.home-page__hero {
  animation-delay: 80ms;
}
</style>
