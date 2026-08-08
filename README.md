# Final Game Sub

A React game hub built with Vite and React Router. This project includes a lobby, Rock Paper Scissors, Tic Tac Toe, Wordle, and Type Test, plus Playwright end-to-end tests and GitHub Pages deployment support.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start local development:
   ```bash
   npm run dev
   ```

3. Open the app in your browser at:
   ```text
   http://localhost:5173
   ```

## Run

- Development server:
  ```bash
  npm run dev
  ```

- Production build:
  ```bash
  npm run build
  ```

- Preview the built app locally:
  ```bash
  npm run preview
  ```

## Test

- Run unit and end-to-end tests:
  ```bash
  npm test
  ```

- Run only unit tests:
  ```bash
  npm run test:unit
  ```

- Run only Playwright E2E tests:
  ```bash
  npm run test:e2e
  ```

## Deploy

This project is configured for GitHub Pages under the `FinalGameSub` repository path.

- Build and deploy:
  ```bash
  npm run deploy
  ```

## Architecture Notes

- **Framework:** React 19 with Vite for fast local development and production builds.
- **Routing:** React Router DOM handles client-side routing with nested routes and protected game pages.
- **Pages:** 
  - `HomePage` — landing page with game links.
  - `LobbyPage` — player settings, avatar selection, and theme control.
  - `RPSGamePage` — Rock Paper Scissors game.
  - `TicTacToePage` — Tic Tac Toe connected to a remote game-room API.
  - `Wordle` — word guessing game.
  - `TypeTest` — typing speed test.
- **State & Storage:** Local storage persists player settings and theme preferences.
- **Theming:** Dark mode support is applied via CSS variables and saved settings.
- **Tests:** Vitest for unit testing and Playwright for end-to-end browser testing.
- **Deployment:** Vite `base` is configured for GitHub Pages at `/FinalGameSub/`.

## Credits

- Developed by Nathan Otten.
- Tic Tac Toe room syncing uses the external Game Room API at `https://game-room-api.fly.dev/`.
- Built as part of a final project for a web game development course.


## Reflection
- I learned about React and how it can be used in webpages to make it flow smoother
- I think I may change the design next and make it so it looks a little different, maybe a bit more polished
- I didn't have a whole lot of peer feedback but based off what I know, when creating it, I changed a few design elements based off what I believed users would want, for example a seemless design between pages so they all fit the theme