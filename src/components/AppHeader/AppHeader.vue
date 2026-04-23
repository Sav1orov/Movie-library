<script setup>
import {ref} from "vue";
import {useMovieStore} from "../../stores/MovieStore.js";
import {useRoute, useRouter} from "vue-router";

const movieStore = useMovieStore()
const router = useRouter()
const route = useRoute()
const searchErrorText = ref("")

function onSearchSubmit() {
  const query = movieStore.searchQuery.trim()

  if (!query) {
    searchErrorText.value = "Введите название фильма"
    return
  }

  searchErrorText.value = ""
  router.push(`/search?q=${encodeURIComponent(query)}`)
  movieStore.searchQuery = ''
}

function onSearchInput() {
  if (movieStore.searchQuery.trim()) {
    searchErrorText.value = ""
  }
}
</script>

<template>
  <header class="header-bar">
    <div class="header-bar__container app-motion--fade-up">
      <RouterLink class="header-bar__brand app-motion--float" :to="{ name: 'home' }" aria-label="MoviesHub home">
        <span class="header-bar__brand-mark">MH</span>
        <span class="header-bar__brand-text">MoviesHub</span>
      </RouterLink>

      <nav class="header-bar__nav" aria-label="Main navigation">
        <RouterLink
          class="header-bar__nav-link"
          :class="{ 'header-bar__nav-link--active': route.name === 'home' }"
          :to="{ name: 'home' }"
        >
          Top
        </RouterLink>
        <RouterLink
          class="header-bar__nav-link"
          :class="{ 'header-bar__nav-link--active': route.name === 'favorites' }"
          :to="{ name: 'favorites' }"
        >
          Favorites
        </RouterLink>
      </nav>

      <form @submit.prevent="onSearchSubmit" class="header-bar__search" role="search">
        <label class="header-bar__search-label" for="movie-search">Search films</label>
        <input
          id="movie-search"
          v-model="movieStore.searchQuery"
          class="header-bar__search-input"
          :class="{ 'header-bar__search-input--error': searchErrorText }"
          type="search"
          placeholder="Find a movie..."
          autocomplete="off"
          @input="onSearchInput"
        >
        <button class="header-bar__search-button" type="submit">
          Search
        </button>
        <p v-if="searchErrorText" class="header-bar__search-error">
          {{ searchErrorText }}
        </p>
      </form>
    </div>
  </header>
</template>

<style scoped lang="scss" src="./AppHeader.scss"></style>
