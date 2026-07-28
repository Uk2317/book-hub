# Book Hub

Book Hub is a responsive book discovery application built with React and TypeScript. Users can log in, browse top-rated books, filter their bookshelves, search the catalog, and open detailed pages for any title.

The application is built around production-style front-end patterns: protected routing, authenticated API requests, clear asynchronous state handling, responsive layouts, and resilient UI states for loading, empty, and error scenarios.

## Overview

| Route | Description |
| --- | --- |
| `/login` | Authentication with credential validation |
| `/` | Home page with a top-rated books carousel |
| `/shelf` | Bookshelves with category filters and search |
| `/books/:id` | Detailed page for a single book |
| `*` | Not Found page for unmatched routes |

## Key Features

- **Authentication** – Login with JWT stored in cookies and used for protected API requests.
- **Protected routes** – Home, Bookshelves, and Book Details are only accessible when authenticated; unauthenticated access redirects to login.
- **Top-rated carousel** – A responsive slider that adapts the number of visible books across screen sizes.
- **Bookshelf filtering** – Switch between All, Read, Currently Reading, and Want to Read.
- **Combined search** – Search works together with the selected shelf in a single request.
- **Book details** – Cover, rating, reading status, author information, and description for each title.
- **Resilient UI** – Loading spinners, empty results, and retryable failure views for every request.
- **Responsive design** – Mobile-first layout using CSS media queries, without duplicating markup per breakpoint.

## Tech Stack

| Technology | Purpose |
| --- | --- |
| React | Component-based UI |
| TypeScript | Type safety and maintainable code |
| React Router | Client-side routing and route protection |
| React Slick | Responsive carousel |
| js-cookie | JWT persistence |
| CSS media queries | Responsive design |
| Vite | Development server and production build |

## Engineering Details

- Route-level pages use class components with lifecycle methods for data fetching.
- API views follow a consistent status model: initial, loading, success, and failure.
- Failed network requests render retryable failure views instead of a blank screen.
- Search parameters are URL-encoded before requests are sent.
- Unauthorized responses clear the session and redirect the user to login.
- Book cover images include a fallback for broken image sources.
- Document titles update per route for clearer browser history.
- Focus states and semantic labels support keyboard and screen-reader users.

## Folder Structure

```text
src/
|-- components/
|   |-- BookDetails.tsx
|   |-- Bookshelves.tsx
|   |-- FailureView.tsx
|   |-- Footer.tsx
|   |-- Header.tsx
|   |-- Home.tsx
|   |-- Loader.tsx
|   |-- Login.tsx
|   |-- Logo.tsx
|   |-- NotFound.tsx
|   `-- ProtectedRoute.tsx
|-- types/
|-- utils/
|-- App.tsx
|-- index.css
`-- main.tsx
```

## Getting Started

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

## Demo Credentials

```text
username: rahul
password: rahul@2021
```

## API Integration

The application consumes REST endpoints for login, top-rated books, filtered bookshelves, and book details. Every protected request includes the JWT token in the Authorization header.

## What This Project Demonstrates

- Building multi-route React applications with protected navigation.
- Managing asynchronous API state with clear loading and error handling.
- Designing responsive interfaces with a single, adaptive layout.
- Handling real-world edge cases: failed requests, expired sessions, empty results, and broken images.
- Writing readable component structure and maintainable styles.
