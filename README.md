# Books Library

A simple book catalog app built with vanilla HTML, CSS and JavaScript (ES6+). It searches books by title through the [Open Library API](https://openlibrary.org/), shows results as cards, and lets you save books to favorites with persistence in `localStorage`. No frameworks or libraries — only [Vite](https://vitejs.dev/) as the build tool.

## Task

This project was built as a learning exercise. The full original specification (in Russian) is available here: **https://drive.google.com/file/d/1RBRcuH-_oAvtjem5Xs0c4NXZ8I38aYyH/view**.

## Features

- Search books by title via the Open Library API (`search.json`)
- Live search as you type (debounced), no need to press the search button
- Filter search results by author
- Result cards with cover (or a placeholder fallback), title, author and first publish year
- "Add to favorites" / "Remove from favorites" toggle on every card
- Favorites stored in `localStorage` and restored on reload
- Dedicated favorites section with removal
- Light/dark theme toggle, with the choice saved in `localStorage`
- Loading, empty-result and network-error states
- Responsive layout for desktop and mobile

## How to run the app

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher (npm comes bundled)

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

Vite starts a local dev server (default: `http://localhost:5173`) with hot module replacement.

### Build for production

```bash
npm run build
```

The output goes to `dist/`. The build is configured to produce exactly three top-level artifacts:

```
dist/
├── assets/       # icons, styles
├── index.html
└── index.js
```

### Verify the build structure

```bash
npm run build:check
```

Builds the app and programmatically verifies that `dist/` contains exactly one HTML file, one JS bundle and one `assets/` folder.

### Preview the production build

```bash
npm run preview
```

Serves the contents of `dist/` locally so you can check the built app.

## Project structure

```
├── index.html              # static layout: search form, results, favorites
├── public/
│   └── assets/             # static assets copied as-is (favicon)
├── scripts/
│   └── check-dist.mjs      # verifies the 3-artifact build output
└── src/
    ├── api/
    │   └── openLibrary.js  # Open Library client: fetch, normalize, errors
    ├── app/
    │   ├── search.js       # search flow, author filter, favorites rendering
    │   └── theme.js        # light/dark theme toggle and persistence
    ├── components/
    │   └── BookCard.js     # book card component (cover, meta, favorite button)
    ├── utils/
    │   └── favorites.js    # localStorage persistence + favorites helpers
    └── styles/
        └── main.css        # global styles and theming variables
```
