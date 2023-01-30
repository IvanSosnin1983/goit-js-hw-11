import './css/style.css';
import Notiflix from 'notiflix';
import ImagesApi from './images-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formSearch = document.querySelector('.search-form');
const loadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const imagesApi = new ImagesApi();

showButton(false);

formSearch.addEventListener('submit', onSearch);
loadMore.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  showButton(false);
  imagesApi.searchQuery = e.currentTarget.elements.searchQuery.value;
  if (imagesApi.searchQuery === '') {
    Notiflix.Notify.failure('Enter the search value!');
    gallery.innerHTML = '';
    return;
  }
  imagesApi.resetPage();
  gallery.innerHTML = '';

  try {
    const fetchCards = await imagesApi.fetchImages();
    const addCards = await addAllCards(fetchCards);
    if (fetchCards.totalHits > 0) {
      return (hoorey = await Notiflix.Notify.success(
        `Hooray! We found ${fetchCards.totalHits} images.`
      ));
    }
    return addCards;
  } catch (error) {
    console.log(error.message);
  }
}
function enable() {
  loadMore.disabled = false;
}
function disable() {
  loadMore.disabled = true;
}

async function onLoadMore() {
  disable();

  try {
    const fetchCards = await imagesApi.fetchImages();
    const addCards = await addAllCards(fetchCards);
    enable();
    return addCards;
  } catch (error) {
    console.log(error.message);
  }
}

function renderCards(article) {
  const markup = article.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <a class="link-card" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
 </a>
</div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);

  return;
}
function addAllCards(articles) {
  if (articles.totalHits === 0) {
    showButton(false);
    gallery.innerHTML = '';
    return Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    showButton(true);
    renderCards(articles);
    if (articles.hits.length < imagesApi.per_page) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      showButton(false);
    }
  }
  simple();
}
function showButton(used) {
  loadMore.style.display = used ? 'block' : 'none';
}
function simple() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionPosition: 'button',
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}
