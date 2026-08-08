const COVER_URL = (coverId) => `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;

function createPlaceholder(title) {
  const placeholder = document.createElement('div');
  placeholder.className = 'book-card__cover book-card__cover--placeholder';
  placeholder.textContent = 'No cover';
  placeholder.setAttribute('role', 'img');
  placeholder.setAttribute('aria-label', `No cover for ${title}`);
  return placeholder;
}

function createCover(book) {
  if (!book.coverId) {
    return createPlaceholder(book.title);
  }
  const cover = document.createElement('img');
  cover.className = 'book-card__cover';
  cover.src = COVER_URL(book.coverId);
  cover.alt = `Cover of ${book.title}`;
  cover.addEventListener('error', () => {
    cover.replaceWith(createPlaceholder(book.title));
  });
  return cover;
}

export function createBookCard(book, { isFavorite = false } = {}) {
  const card = document.createElement('article');
  card.className = 'book-card';

  const title = document.createElement('h3');
  title.className = 'book-card__title';
  title.textContent = book.title;

  const author = document.createElement('p');
  author.className = 'book-card__author';
  author.textContent = book.authors[0] || 'Unknown author';

  const year = document.createElement('p');
  year.className = 'book-card__year';
  year.textContent = book.firstPublishYear ? `First published: ${book.firstPublishYear}` : '';

  const favoriteButton = document.createElement('button');
  favoriteButton.type = 'button';
  favoriteButton.className = 'book-card__favorite';
  favoriteButton.textContent = isFavorite ? 'Remove from favorites' : 'Add to favorites';
  favoriteButton.addEventListener('click', () => {
    card.dispatchEvent(
      new CustomEvent('favorite:toggle', {
        bubbles: true,
        detail: { book },
      })
    );
  });

  card.append(createCover(book), title, author, year, favoriteButton);
  return card;
}
