import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import FavoritePage from "../pages/FavoritePage.vue";
import SearchPage from "../pages/SearchPage.vue";
import MovieDetailsPage from "../pages/MovieDetailsPage.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
        },
        {
            path: '/favorites',
            name: 'favorites',
            component: FavoritePage,
        },
        {
            path: '/search',
            name: 'search',
            component: SearchPage,
        },
        {
            path: '/movie/:id',
            name: 'movie',
            component: MovieDetailsPage,
        },
    ],
})

export default router
