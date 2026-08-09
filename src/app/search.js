import { searchBooks } from '../api/openLibrary.js';
import { createBookCard } from '../components/BookCard.js';
import { loadFavorites, saveFavorites, isFavorite, toggleFavorite } from '../utils/favorites.js';

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const resultsSection = document.querySelector('#results-section');
const resultsContainer = document.querySelector('#results-container');
const favoritesContainer = document.querySelector('#favorites-container');
const authorFilter = document.querySelector('#author-filter');

const STATUS_MESSAGES = {
  emptyInput: 'Enter a book title to search.',
  loading: 'Loading...',
  emptyResult: 'Nothing found. Try a different query.',
  error: 'Something went wrong. Check your connection and try again.',
};

let currentBooks = [];
let favorites = loadFavorites();
let searchTimer;

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

function populateAuthorFilter(books) {
  const authors = [...new Set(books.flatMap((book) => book.authors))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  authorFilter.textContent = '';
  const allOption = document.createElement('option');
  allOption.value = '';
  allOption.textContent = 'All authors';
  authorFilter.appendChild(allOption);
  for (const author of authors) {
    const option = document.createElement('option');
    option.value = author;
    option.textContent = author;
    authorFilter.appendChild(option);
  }
  authorFilter.hidden = authors.length < 2;
}

function renderBooks(books) {
  currentBooks = books;
  const selected = authorFilter.value;
  const visible = selected ? books.filter((book) => book.authors.includes(selected)) : books;
  resultsContainer.textContent = '';
  for (const book of visible) {
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

// re-render both lists so the favorite button state stays consistent everywhere
function handleFavoriteToggle(event) {
  const { book } = event.detail;
  toggleFavorite(favorites, book);
  saveFavorites(favorites);
  renderBooks(currentBooks);
  renderFavorites();
}

// Debounce input so a query is only sent after the user pauses typing.
function debounce(callback, delay = 400) {
  return (...args) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => callback(...args), delay);
  };
}

async function handleSearch(query) {
  if (!query.trim()) {
    setStatus(STATUS_MESSAGES.emptyInput, 'error');
    authorFilter.hidden = true;
    resultsContainer.textContent = '';
    return;
  }

  setStatus(STATUS_MESSAGES.loading, 'loading');
  try {
    const books = await searchBooks(query);
    if (books.length === 0) {
      setStatus(STATUS_MESSAGES.emptyResult, 'empty');
      authorFilter.hidden = true;
      resultsContainer.textContent = '';
      return;
    }
    clearStatus();
    populateAuthorFilter(books);
    renderBooks(books);
  } catch (error) {
    console.error(error);
    setStatus(STATUS_MESSAGES.error, 'error');
    authorFilter.hidden = true;
    resultsContainer.textContent = '';
  }
}

const debouncedSearch = debounce(handleSearch);

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearTimeout(searchTimer);
  handleSearch(searchInput.value);
});
searchInput.addEventListener('input', (event) => debouncedSearch(event.target.value));
resultsContainer.addEventListener('favorite:toggle', handleFavoriteToggle);
favoritesContainer.addEventListener('favorite:toggle', handleFavoriteToggle);
authorFilter.addEventListener('change', () => renderBooks(currentBooks));

renderFavorites();
