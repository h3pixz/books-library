const SEARCH_URL = 'https://openlibrary.org/search.json';

export class ApiError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'ApiError';
    this.cause = cause;
  }
}

function normalizeBook(doc) {
  return {
    id: String(doc.key),
    title: doc.title || 'Untitled',
    authors: doc.author_name || [],
    firstPublishYear: doc.first_publish_year ?? null,
    coverId: doc.cover_i ?? null,
  };
}

async function fetchWithTimeout(resource, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(resource, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function searchBooks(query) {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }
  const params = new URLSearchParams({ q: trimmed, limit: '20' });
  const url = `${SEARCH_URL}?${params}`;
  const response = await fetchWithTimeout(url);
  if (!response.ok) {
    throw new ApiError(`Open Library responded with ${response.status}`, response.status);
  }
  const data = await response.json();
  return (data.docs || []).map(normalizeBook);
}
