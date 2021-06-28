import getRefs from './get-refs';
import MovieApiService from './apiService';
import libraryMovieCardTpl from '../templates/library-movie-card.hbs';
import { getLibraryMovies } from './fireBase-dataBase.js';

const movieApiService = new MovieApiService();
const refs = getRefs();

async function renderLibraryMovies(filterName = 'watched') {
  const isLibraryPage = refs.myLibrary.classList.contains(
    'site-nav__button--active',
  );
  if (!isLibraryPage) {
    return;
  }
  const isNotifyHidden = refs.notify.classList.contains('visually-hidden');
  if (!isNotifyHidden) {
    refs.notify.classList.add('visually-hidden');
  }
  getLibraryMovies(filterName).then(allWatchedMoviesIds => {
    if (!allWatchedMoviesIds || allWatchedMoviesIds.length === 0) {
      refs.moviesList.innerHTML = '';
      refs.divPagination.innerHTML = '';
      refs.notify.classList.remove('visually-hidden');
      refs.notify.textContent = `There are no ${filterName} films yet :(`;
      return;
    }

    const watchedMoviesIds = getMoviesIdsByMediaQuery(allWatchedMoviesIds, 0);

    const watchedMovies = getWatchedMovies(watchedMoviesIds);

    watchedMovies.then(watchedMovies => {
      renderMovies(watchedMovies);
    });
    // renderMovies(watchedMovies);
  });
}

async function getWatchedMovies(watchedMoviesIds) {
  console.log(watchedMoviesIds);
  const watchedMovies = await Promise.all(
    watchedMoviesIds.map(
      async id => await movieApiService.fetchFullInfoOfMovie(id),
    ),
  );
  // console.log(watchedMovies);
  return watchedMovies;
}

function getDataFromLocalStorage(itemName) {
  return JSON.parse(localStorage.getItem(itemName));
}

function getMoviesIdsByMediaQuery(moviesIds, startIndex) {
  const mobileMediaQuery = window.matchMedia('(max-width: 767px)');
  const tabletMediaQuery = window.matchMedia(
    '(min-width: 768px) and (max-width: 1023px)',
  );
  const desktopMediaQuery = window.matchMedia('(min-width: 1024px)');

  if (mobileMediaQuery.matches) {
    return moviesIds.slice(startIndex, 4);
  }

  if (tabletMediaQuery.matches) {
    return moviesIds.slice(startIndex, 8);
  }

  if (desktopMediaQuery.matches) {
    return moviesIds.slice(startIndex, 9);
  }
}

function renderMovies(movies) {
  movies.map(transformMovieObjectFields);
  const watchedMoviesMarkup = libraryMovieCardTpl(movies);
  refs.moviesList.innerHTML = watchedMoviesMarkup;
}

function transformMovieObjectFields(movie) {
  movie.placeholder = !movie.poster_path ? true : false;

  let genresList = [];
  movie.genres.map(genre => {
    genresList.push(genre.name);
  });
  movie.genres = genresList.join(', ');

  movie.release_date = null ? '' : movie.release_date.slice(0, 4);
  movie.vote_average = movie.vote_average.toFixed(1);
}

export { renderLibraryMovies };