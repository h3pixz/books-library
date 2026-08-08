import { searchBooks } from '../api/openLibrary.js';
import { createBookCard } from '../components/BookCard.js';
import { loadFavorites, saveFavorites, isFavorite, toggleFavorite } from '../utils/favorites.js';

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const resultsSection = document.querySelector('#results-section');
const resultsContainer = document.querySelector('#results-container');
const favoritesContainer = document.querySelector('#favorites-container');

const STATUS_MESSAGES = {
  emptyInput: 'Enter a book title to search.',
  loading: 'Loading...',
  emptyResult: 'Nothing found. Try a different query.',
  error: 'Something went wrong. Check your connection and try again.',
};

let currentBooks = [];
let favorites = loadFavorites();

function isFavoriteId(id) {
  return isFavorite(favorites, id);
}

function setStatus(message, type = 'info') {
  clearStatus();
  const status = document.createElement('p');
  status.className = `status status--${type}`;
  status.textContent = message;
  resultsSection.insertBefore(status, resultsContainer);
}

function clearStatus() {
  resultsSection.querySelector('.status')?.remove();
}

function renderBooks(books) {
  currentBooks = books;
  resultsContainer.textContent = '';
  for (const book of books) {
    resultsContainer.appendChild(createBookCard(book, { isFavorite: isFavoriteId(book.id) }));
  }
}

function renderFavorites() {
  favoritesContainer.textContent = '';
  if (favorites.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'favorites-empty';
    empty.textContent = 'No favorites yet. Add books from the search results.';
    favoritesContainer.appendChild(empty);
    return;
  }
  for (const book of favorites) {
    favoritesContainer.appendChild(createBookCard(book, { isFavorite: true }));
  }
}

function handleFavoriteToggle(event) {
  const { book } = event.detail;
  toggleFavorite(favorites, book);
  saveFavorites(favorites);
  renderBooks(currentBooks);
  renderFavorites();
}

async function handleSearch(event) {
  event.preventDefault();
  const query = searchInput.value;
  if (!query.trim()) {
    setStatus(STATUS_MESSAGES.emptyInput, 'error');
    resultsContainer.textContent = '';
    return;
  }

  setStatus(STATUS_MESSAGES.loading, 'loading');
  try {
    const books = await searchBooks(query);
    if (books.length === 0) {
      setStatus(STATUS_MESSAGES.emptyResult, 'empty');
      resultsContainer.textContent = '';
      return;
    }
    clearStatus();
    renderBooks(books);
  } catch (error) {
    console.error(error);
    setStatus(STATUS_MESSAGES.error, 'error');
    resultsContainer.textContent = '';
  }
}

searchForm.addEventListener('submit', handleSearch);
resultsContainer.addEventListener('favorite:toggle', handleFavoriteToggle);
favoritesContainer.addEventListener('favorite:toggle', handleFavoriteToggle);

renderFavorites();
