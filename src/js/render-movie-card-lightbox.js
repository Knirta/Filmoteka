import '../sass/components/basic-lightbox';
import * as basicLightbox from 'basiclightbox';
import MoviesApiService from '../js/apiService.js';
import getRefs from '../js/get-refs';
import movieCardLightboxTpl from '../templates/movie-card-lightbox.hbs';

const refs = getRefs();
const moviesApiService = new MoviesApiService();

refs.moviesList.addEventListener('click', onMovieCardClick);

async function onMovieCardClick(e) {
  const currentMovieCard = e.target;
  // console.log(currentMovieCard.nodeName);

  if (currentMovieCard.nodeName !== 'IMG') {
    return;
  }

  getFullInfoOfMovie(currentMovieCard).then(fullInfo => {
    renderMovieCardLightbox(fullInfo);
  });
}

async function getFullInfoOfMovie(currentMovieCard) {
  const currentMovieCardId = currentMovieCard.dataset.id;
  const fullInfoOfMovie = await moviesApiService.fetchFullInfoOfMovie(currentMovieCardId);
  return fullInfoOfMovie;
}

function renderMovieCardLightbox(fullInfo) {
  const movieGenres = fullInfo.genres
    .map(genre => {
      return genre.name;
    })
    .join(' / ');

  const moviePopularity = fullInfo.popularity.toFixed(1);

  fullInfo.popularity = moviePopularity;
  fullInfo.movie_genres = movieGenres;

  const lightbox = basicLightbox.create(movieCardLightboxTpl(fullInfo), {});

  lightbox.show();
  const visibleLightbox = basicLightbox.visible();
  console.log(visibleLightbox);

  if (visibleLightbox === true) {
    refs.body.classList.toggle('inactive');
  }

  const closeBtn = document.querySelector('.lightbox__close-button');
  closeBtn.addEventListener('click', onLightboxClose);
  window.addEventListener('keydown', onEscBtnPress);
}

function onLightboxClose() {
  const closeBtn = document.querySelector('.lightbox__close-button');
  const lightBox = document.querySelector('.basicLightbox');

  // lightBox.close();
  lightBox.classList.toggle('basicLightbox--visible');
  closeBtn.removeEventListener('click', onLightboxClose);
  window.removeEventListener('keydown', onEscBtnPress);
}

function onEscBtnPress(evt) {
  if (evt.code === 'Escape') {
    onLightboxClose();
  }
}