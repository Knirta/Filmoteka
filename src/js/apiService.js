const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = 'c27b75f2098a52933ae8847a9b55ad4e';

export default class MoviesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchPopularMovies() {
    const searchParams = new URLSearchParams({
      api_key: API_KEY,
      page: this.page,
    });

    const url = `${BASE_URL}movie/popular?${searchParams}`;

    return fetch(url).then(response => response.json());
  }

  fetchGenresList() {
    const searchParams = new URLSearchParams({
      api_key: API_KEY,
    });

    const url = `${BASE_URL}/genre/movie/list?${searchParams}`;

    return fetch(url).then(response => response.json());
  }

  // fetchMoviesBySearchQuery
  fetchMovies() {
    const searchParams = new URLSearchParams({
      api_key: API_KEY,
      query: this.searchQuery,
      page: this.page,
    });

    return fetch(`${BASE_URL}search/movie?${searchParams}`).then(response => response.json());
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  setPage(value) {
    this.page = value;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
