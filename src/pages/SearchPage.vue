<script setup>
import {computed, watch} from "vue";
import {storeToRefs} from "pinia";
import {useRoute} from "vue-router";
import AppHeader from "../components/AppHeader/AppHeader.vue";
import AppCatalog from "../components/AppCatalog/AppCatalog.vue";
import {useMovieStore} from "../stores/MovieStore.js";

const movieStore = useMovieStore()
const route = useRoute()
const {currentSearchPage, searchPagesCount} = storeToRefs(movieStore);

const activeQuery = computed(() => String(route.query.q ? route.query.q : "").trim())

watch(
  activeQuery,
  (query) => {
    if (!query) {
      movieStore.movies = []
      return
    }

    movieStore.fetchedSearchFilms(query, 1)
  },
  {immediate: true}
)

function onPageChange(page) {
  if (!activeQuery.value) {
    return
  }

  movieStore.fetchedSearchFilms(activeQuery.value, page)
}
</script>

<template>
  <AppHeader />

  <main class="page search-page">
    <section class="page__hero search-page__hero app-motion--fade-up">
      <p class="page__kicker">Search Results</p>
      <h1 class="page__title">
        {{ activeQuery ? `"${activeQuery}"` : "Type a movie name" }}
      </h1>
      <p class="page__subtitle">
        {{ activeQuery ? "Browse matching movies and open details in one click." : "Use the search field in the header to start." }}
      </p>
    </section>

    <AppCatalog
      :movies="movieStore.movies"
      :current-page="currentSearchPage"
      :pages-count="searchPagesCount"
      @page-change="onPageChange($event)"
    />
  </main>
</template>

<style scoped lang="scss">
.search-page__hero {
  animation-delay: 90ms;
}
</style>
