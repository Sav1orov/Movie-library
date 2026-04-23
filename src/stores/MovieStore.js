import {acceptHMRUpdate, defineStore} from "pinia";
import {ref} from "vue";

export const useMovieStore = defineStore(
    "Movie",
    () => {
        const movies = ref([])
        const topMovies = ref([])
        const searchQuery = ref("")
        const isLoading = ref(false)
        const isError = ref(false)
        const favoriteMovies = ref([])
        const API_KEY = 'e0f175b5-0958-4b57-9103-4a8fb844372e'

        // pages
        const MAX_PAGES = 15;

        const currentTopPage = ref(1)
        const topPagesCount = ref(0)

        const currentSearchPage = ref(1)
        const searchPagesCount = ref(0)

        const isFavorite = (movie) =>
            favoriteMovies.value.some((favoriteMovie) => favoriteMovie.filmId === movie.filmId)

        const toggleFavorites = (movie) => {
            const index = favoriteMovies.value.findIndex(
                (favoriteMovie) => favoriteMovie.filmId === movie.filmId
            )

            if (index === -1) {
                favoriteMovies.value.push(movie)
                return
            }

            favoriteMovies.value.splice(index, 1)
        }

        const fetchedSearchFilms = async (movieName, page = 1) => {
            isError.value = false
            isLoading.value = true
            try{
                const res = await fetch(
                    `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(movieName)}&page=${page}`,
                    {
                        headers: {
                            'X-API-KEY': API_KEY,
                        },
                    }
                )
                if(!res.ok){
                    const text = await res.text()
                    console.error(URL, res.status, text)
                    throw new Error(text)
                }
                    const data = await res.json()

                searchPagesCount.value = data.pagesCount
                searchPagesCount.value = Math.min(data.pagesCount, MAX_PAGES)
                currentSearchPage.value = page

                console.log(data)
                    return movies.value = data.films
            } catch(error) {
                isError.value = true
                console.error(error.message)
                movies.value = []
            } finally {
                isLoading.value = false
            }
        }


        const fetchedTopFilms = async (page = 1) => {
            isError.value = false
            isLoading.value = true

            try{
                const res = await fetch(
                    `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?page=${page}`,
                    {
                        headers: {
                            'X-API-KEY': API_KEY,
                        },
                    }
                )
                if (!res.ok) {
                    const text = await res.text()
                    console.error(URL, res.status, text)
                    throw new Error(text)
                }
                const data = await res.json()
                topPagesCount.value = Math.min(data.pagesCount, MAX_PAGES)
                currentTopPage.value = page

                return topMovies.value = data.films
            } catch(error) {
                isError.value = true
                console.error(error.message)
                topMovies.value = []
            } finally {
                isLoading.value = false
            }
        }

        return {
            toggleFavorites,
            isFavorite,
            searchQuery,
            fetchedSearchFilms,
            fetchedTopFilms,
            topMovies,
            movies,
            isLoading,
            isError,
            currentTopPage,
            topPagesCount,
            currentSearchPage,
            searchPagesCount,
            favoriteMovies,
            API_KEY,
        }
},{
        persist: true,
    })


// Почему то без этого стор обновлялся только после перезапуска сервера npm run dev.
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useMovieStore, import.meta.hot))
}
