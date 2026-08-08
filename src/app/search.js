import { searchBooks } from '../api/openLibrary.js';

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
  resultsContainer.textContent = '';
  for (const book of books) {
    const card = document.createElement('article');
    card.className = 'book-card';

    const title = document.createElement('h3');
    title.className = 'book-card__title';
    title.textContent = book.title;

    const author = document.createElement('p');
    author.className = 'book-card__author';
    author.textContent = book.authors[0] || 'Unknown author';

    card.append(title, author);
    resultsContainer.appendChild(card);
  }
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
