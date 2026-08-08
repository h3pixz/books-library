const STORAGE_KEY = 'books-library:theme';
const DARK_CLASS = 'theme-dark';
const themeToggleBtn = document.querySelector('#theme-toggle-btn');

function applyTheme(theme) {
  document.documentElement.classList.toggle(DARK_CLASS, theme === 'dark');
  themeToggleBtn.textContent = theme === 'dark' ? 'Light theme' : 'Dark theme';
}

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
  } catch {
    return null;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function initTheme() {
  const saved = getInitialTheme();
  applyTheme(saved);
  localStorage.setItem(STORAGE_KEY, saved);
  themeToggleBtn.addEventListener('click', () => {
    const next = document.documentElement.classList.contains(DARK_CLASS) ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      return;
    }
  });
}
