<script setup>
import {computed} from "vue";
import {useMovieStore} from "../../stores/MovieStore.js";
import {storeToRefs} from "pinia";

const movieStore = useMovieStore()

const props = defineProps({
  movies: {type: Array, required: true},
  currentPage: {type: Number, required: false},
  pagesCount: {type: Number, required: false},
})

const {isLoading, isError} = storeToRefs(movieStore);

const emit = defineEmits(["page-change"])

const hasPagination = computed(
  () =>
    Number.isFinite(props.currentPage) &&
    Number.isFinite(props.pagesCount) &&
    props.pagesCount > 1
)


</script>

<template>
  <section class="movie-catalog">
    <div v-if="hasPagination" class="movie-catalog__pagination app-motion--fade-up">
      <button
        class="movie-catalog__pagination-button"
        :disabled="currentPage <= 1"
        @click="emit('page-change', currentPage - 1)"
      >
        Prev
      </button>

      <div class="movie-catalog__pagination-list">
        <button
          v-for="page in pagesCount"
          :key="page"
          class="movie-catalog__pagination-button"
          :class="{ 'movie-catalog__pagination-button--active': page === currentPage }"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="emit('page-change', page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        class="movie-catalog__pagination-button"
        :disabled="currentPage >= pagesCount"
        @click="emit('page-change', currentPage + 1)"
      >
        Next
      </button>
    </div>

    <div v-if="!isError">
      <div v-if="isLoading" class="movie-catalog__state app-motion--fade-up">
        Loading movies...
      </div>

      <div v-else-if="!movies.length" class="movie-catalog__state app-motion--fade-up">
        Nothing found yet.
      </div>

      <div v-else class="movie-catalog__grid">
        <article
          v-for="(movie, index) in movies"
          :key="movie.filmId"
          class="movie-catalog__card"
          :style="{ '--movie-catalog-delay': `${index * 35}ms` }"
        >
          <RouterLink
            v-if="movie.filmId"
            class="movie-catalog__details-link"
            :to="{ name: 'movie', params: { id: movie.filmId } }"
            :aria-label="`Open details for ${movie.nameRu}`"
          >
            <svg
              class="movie-catalog__details-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M12 5C6.8 5 3.2 8.1 1.4 12c1.8 3.9 5.4 7 10.6 7s8.8-3.1 10.6-7C20.8 8.1 17.2 5 12 5zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2.2A1.8 1.8 0 1 0 12 10a1.8 1.8 0 0 0 0 3.8z"
              />
            </svg>
          </RouterLink>

          <button
            class="movie-catalog__favorite-button"
            :class="{ 'movie-catalog__favorite-button--active': movieStore.isFavorite(movie) }"
            type="button"
            :aria-label="movieStore.isFavorite(movie)
              ? `Remove ${movie.nameRu} from favorites`
              : `Add ${movie.nameRu} to favorites`"
            :aria-pressed="movieStore.isFavorite(movie)"
            @click.stop="movieStore.toggleFavorites(movie)"
          >
            <svg
              class="movie-catalog__favorite-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </button>

          <div class="movie-catalog__poster-wrap">
            <img
              :src="movie.posterUrl"
              :alt="movie.nameRu"
              class="movie-catalog__poster"
            >
          </div>

          <div class="movie-catalog__content">
            <h2 class="movie-catalog__title">{{ movie.nameRu }}</h2>

            <div class="movie-catalog__badges">
              <span class="movie-catalog__badge">{{ movie.year }}</span>
              <span v-if="movie.filmLength" class="movie-catalog__badge">{{ movie.filmLength }} min</span>
              <span class="movie-catalog__badge movie-catalog__badge--rating">Rating: {{ movie.rating }}</span>
            </div>

            <p class="movie-catalog__description">
              {{ movie.description }}
            </p>

            <div class="movie-catalog__footer">
              <span class="movie-catalog__votes">
                Votes: {{ movie.ratingVoteCount.toLocaleString('ru-RU') }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div v-else class="movie-catalog__state movie-catalog__state--error app-motion--fade-up">
      Server error while loading movies.
    </div>
  </section>
</template>

<style scoped lang="scss" src="./AppCatalog.scss"></style>
