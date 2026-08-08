const STORAGE_KEY = 'books-library:favorites';

export function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFavorites(books) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch {
    return;
  }
}

export function isFavorite(favorites, id) {
  return favorites.some((book) => book.id === id);
}

export function toggleFavorite(favorites, book) {
  const index = favorites.findIndex((favorite) => favorite.id === book.id);
  if (index === -1) {
    favorites.push(book);
  } else {
    favorites.splice(index, 1);
  }
  return favorites;
}
