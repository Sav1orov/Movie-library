<script setup>
import {computed, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import AppHeader from "../components/AppHeader/AppHeader.vue";
import {useMovieStore} from "../stores/MovieStore.js";

const route = useRoute()
const router = useRouter()
const movieStore = useMovieStore()

const moviePageMovie = ref(null)
const moviePageIsLoading = ref(false)
const moviePageIsError = ref(false)
const moviePageErrorMessage = ref("")

const moviePageFavoriteMovie = computed(() => {
  if (!moviePageMovie.value) {
    return null
  }

  return {
    ...moviePageMovie.value,
    filmId: moviePageMovie.value.filmId ? moviePageMovie.value.filmId : Number(route.params.id),
  }
})

const fetchMoviePageDetails = async (idValue) => {
  const movieId = Number(idValue)

  moviePageIsError.value = false
  moviePageIsLoading.value = true
  moviePageErrorMessage.value = ""

  try {
    const response = await fetch(
      `https://kinopoiskapiunofficial.tech/api/v2.2/films/${movieId}`,
      {
        headers: {
          "X-API-KEY": movieStore.API_KEY,
        },
      }
    )

    if (!response.ok) {
      const responseText = await response.text()
      throw new Error(responseText ? responseText : `HTTP error ${response.status}`)
    }

    moviePageMovie.value = await response.json()
  } catch (error) {
    moviePageMovie.value = null
    moviePageIsError.value = true
    moviePageErrorMessage.value = "Request failed"

    if (error && error.message) {
      try {
        const parsed = JSON.parse(error.message)
        if (parsed && parsed.message) {
          moviePageErrorMessage.value = parsed.message
        } else {
          moviePageErrorMessage.value = error.message
        }
      } catch {
        moviePageErrorMessage.value = error.message
      }
    }
  } finally {
    moviePageIsLoading.value = false
  }
}

watch(
  () => route.params.id,
  (movieId) => fetchMoviePageDetails(movieId),
  {immediate: true}
)

</script>

<template>
  <AppHeader />

  <main class="page movie-page">
    <section class="page__hero movie-page__hero app-motion--fade-up">
      <p class="page__kicker">Movie Details</p>
      <h1 class="page__title">{{ moviePageMovie ? moviePageMovie.nameRu : "Movie card" }}</h1>
      <p class="page__subtitle">
        Full information about selected movie. Use Back to return to previous page.
      </p>
    </section>

    <button class="movie-page__back-button" type="button" @click="router.back()">
      Back
    </button>

    <div v-if="moviePageIsLoading" class="movie-page__state app-motion--fade-up">
      Loading movie details...
    </div>

    <div v-else-if="moviePageIsError" class="movie-page__state movie-page__state--error app-motion--fade-up">
      <h2 class="movie-page__state-title">Could not load movie details</h2>
      <p class="movie-page__state-text">{{ moviePageErrorMessage ? moviePageErrorMessage : "Something went wrong" }}</p>
    </div>

    <article v-else-if="moviePageMovie" class="movie-page__card app-motion--fade-up">
      <div class="movie-page__poster-wrap">
        <img
          class="movie-page__poster"
          :src="moviePageMovie.posterUrl"
          :alt="moviePageMovie.nameRu"
        >
      </div>

      <div class="movie-page__content">
        <div class="movie-page__title-row">
          <h2 class="movie-page__movie-title">{{ moviePageMovie.nameRu }}</h2>
          <button
            v-if="moviePageFavoriteMovie"
            class="movie-page__favorite-button"
            :class="{ 'movie-page__favorite-button--active': movieStore.isFavorite(moviePageFavoriteMovie) }"
            type="button"
            :aria-label="movieStore.isFavorite(moviePageFavoriteMovie)
              ? `Remove ${moviePageMovie.nameRu} from favorites`
              : `Add ${moviePageMovie.nameRu} to favorites`"
            :aria-pressed="movieStore.isFavorite(moviePageFavoriteMovie)"
            @click="movieStore.toggleFavorites(moviePageFavoriteMovie)"
          >
            <svg
              class="movie-page__favorite-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </button>
        </div>

        <p v-if="moviePageMovie.nameOriginal" class="movie-page__movie-original">
          {{ moviePageMovie.nameOriginal }}
        </p>

        <div class="movie-page__meta-list">
          <span class="movie-page__meta-badge">{{ moviePageMovie.year }}</span>
          <span class="movie-page__meta-badge">{{ moviePageMovie.filmLength ? `${moviePageMovie.filmLength} min` : "-" }}</span>
          <span class="movie-page__meta-badge movie-page__meta-badge--rating">KP: {{ moviePageMovie.ratingKinopoisk }}</span>
          <span class="movie-page__meta-badge movie-page__meta-badge--rating">IMDB: {{ moviePageMovie.ratingImdb }}</span>
        </div>

        <div class="movie-page__facts">
          <p class="movie-page__fact">
            <b>Genres:</b>
            {{ moviePageMovie.genres.map((item) => item.genre).filter(Boolean).join(", ") }}
          </p>
          <p class="movie-page__fact">
            <b>Countries:</b>
            {{ moviePageMovie.countries.map((item) => item.country).filter(Boolean).join(", ") }}
          </p>
        </div>

        <p class="movie-page__description">
          {{ moviePageMovie.description }}
        </p>
      </div>
    </article>
  </main>
</template>

<style scoped lang="scss">
.movie-page__hero {
  animation-delay: 90ms;
}

.movie-page__back-button {
  border: 1px solid var(--line-soft);
  background: rgba(255, 255, 255, 0.86);
  color: var(--text-main);
  border-radius: var(--radius-sm);
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 16px;
  transition: transform 220ms ease, background-color 220ms ease, border-color 220ms ease;
}

.movie-page__back-button:hover {
  transform: translateY(-1px);
  background: #ffffff;
  border-color: var(--line-strong);
}

.movie-page__state {
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.82);
  padding: 28px 18px;
  text-align: center;
}

.movie-page__state-title {
  margin: 0;
  font-size: 24px;
}

.movie-page__state-text {
  margin: 8px 0 0;
  color: var(--text-muted);
}

.movie-page__state--error {
  border-color: rgba(220, 38, 38, 0.3);
  background: rgba(220, 38, 38, 0.08);
}

.movie-page__card {
  display: grid;
  grid-template-columns: 330px minmax(0, 1fr);
  gap: 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.94), rgba(247, 250, 249, 0.9));
  box-shadow: var(--shadow-medium);
  overflow: hidden;
}

.movie-page__poster-wrap {
  background: #dbe8e5;
  min-height: 100%;
}

.movie-page__poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.movie-page__content {
  padding: 22px 22px 20px 0;
}

.movie-page__title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.movie-page__movie-title {
  margin: 0;
  font-size: clamp(24px, 4vw, 38px);
  line-height: 1.08;
}

.movie-page__favorite-button {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid var(--line-soft);
  background: rgba(18, 34, 47, 0.08);
  color: #12222f;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    transform 220ms ease,
    background-color 220ms ease,
    border-color 220ms ease,
    color 220ms ease;
}

.movie-page__favorite-button:hover {
  transform: translateY(-1px);
  background: rgba(18, 34, 47, 0.14);
}

.movie-page__favorite-button--active {
  background: rgba(220, 38, 38, 0.88);
  border-color: rgba(255, 219, 219, 0.95);
  color: #ffffff;
}

.movie-page__favorite-icon {
  width: 19px;
  height: 19px;
  fill: transparent;
  stroke: currentColor;
  stroke-width: 1.9;
  transition: fill 220ms ease, stroke 220ms ease;
}

.movie-page__favorite-button--active .movie-page__favorite-icon {
  fill: currentColor;
}

.movie-page__movie-original {
  margin: 8px 0 0;
  font-size: 15px;
  color: var(--text-muted);
}

.movie-page__meta-list {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.movie-page__meta-badge {
  border-radius: 999px;
  border: 1px solid var(--line-soft);
  background: #ffffff;
  color: var(--text-muted);
  padding: 5px 11px;
  font-size: 13px;
  font-weight: 700;
}

.movie-page__meta-badge--rating {
  color: #965008;
  border-color: rgba(217, 119, 6, 0.26);
  background: rgba(217, 119, 6, 0.11);
}

.movie-page__facts {
  margin-top: 14px;
}

.movie-page__fact {
  margin: 6px 0 0;
  color: var(--text-main);
}

.movie-page__description {
  margin: 16px 0 0;
  color: var(--text-muted);
  line-height: 1.6;
}

@media (max-width: 920px) {
  .movie-page__card {
    grid-template-columns: 1fr;
  }

  .movie-page__poster-wrap {
    max-height: 520px;
  }

  .movie-page__content {
    padding: 16px;
  }
}
</style>
