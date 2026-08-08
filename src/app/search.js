import { searchBooks } from '../api/openLibrary.js';
import { createBookCard } from '../components/BookCard.js';
import { loadFavorites, saveFavorites } from '../utils/favorites.js';

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const resultsSection = document.querySelector('#results-section');
const resultsContainer = document.querySelector('#results-container');

const STATUS_MESSAGES = {
  emptyInput: 'Enter a book title to search.',
  loading: 'Loading...',
  emptyResult: 'Nothing found. Try a different query.',
  error: 'Something went wrong. Check your connection and try again.',
};

let currentBooks = [];
let favorites = loadFavorites();

function isFavorite(id) {
  return favorites.some((book) => book.id === id);
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
    resultsContainer.appendChild(createBookCard(book, { isFavorite: isFavorite(book.id) }));
  }
}

function handleFavoriteToggle(event) {
  const { book } = event.detail;
  const index = favorites.findIndex((favorite) => favorite.id === book.id);
  if (index === -1) {
    favorites.push(book);
  } else {
    favorites.splice(index, 1);
  }
  saveFavorites(favorites);
  renderBooks(currentBooks);
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
