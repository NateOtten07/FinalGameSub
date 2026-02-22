# React Router Assignment: Multi-Game Lobby

## 🎯 What You'll Build

You'll transform your existing Rock-Paper-Scissors game into a multi-game lobby with React Router, adding a new Tic-Tac-Toe game, authentication, and global state management. You'll learn modern React Router patterns, Context API, and how to build scalable single-page applications.

## 📚 Learning Objectives

By the end of this assignment, you will:

- **Master React Router v6.4+ Data Router API** with `createBrowserRouter` and `RouterProvider`
- **Implement protected routes** that redirect unauthenticated users
- **Use React Context** for global state management
- **Handle URL search parameters** for filtering and search
- **Build nested route structures** with layout components
- **Implement programmatic navigation** with redirects and state preservation
- **Create reusable components** that work across different routes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Basic React knowledge (components, hooks, props)
- Understanding of JavaScript ES6+ features
- Git installed and configured

### Setup

1. **Install the project dependenices (including React and React Router):**
   ```bash
   npm install
   ```

2. **Initialize Git repository (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "feat: initial project setup with RPS game"
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5173`

You should see your existing Rock-Paper-Scissors game working as before.

### 💾 Git Best Practices for This Tutorial

**Throughout this tutorial, you'll see commit milestones at logical points. This helps you:**
- **Track your progress** - Each commit represents a working feature
- **Rollback if needed** - Easy to revert to a previous working state
- **Understand the evolution** - See how the app grows step by step
- **Practice good habits** - Learn meaningful commit messages

**Commit message format we'll use:**
```bash
git commit -m "feat: brief description of what was added"
```

## 📖 Tutorial Steps

### Phase 1: Foundation Setup

#### Step 1: Understand the Starter Code

**What you have:**
- `src/App.jsx` - Your main component with state management
- `src/components/Lobby.jsx` - Settings form (will become your login page)
- `src/components/Game.jsx` - Rock-Paper-Scissors game
- `src/context/SettingsContext.jsx` - **Provided starter code** for global state

**What you'll build:**
- Multi-page navigation with React Router
- Protected routes that require authentication
- A new Tic-Tac-Toe game
- Search functionality on the home page

#### Step 2: Create Your First Navigation Component

**Goal:** Create a basic navigation bar that will appear on all pages.

**Create `src/components/Navigation.jsx`:**

We'll use the `NavLink` component from React Router DOM, which automatically adds the `active` class to the active route and provides better navigation than regular `<a>` tags.

```jsx
import { NavLink } from "react-router-dom";

export function Navigation() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      {` | `}
      <NavLink to="/lobby">Lobby</NavLink>
      {` | `}
      <NavLink to="/game/rps">Rock Paper Scissors</NavLink>
      {` | `}
      <NavLink to="/game/tic-tac-toe">Tic Tac Toe</NavLink>
    </nav>
  );
}
```

**Don't worry about styling yet** - we'll enhance this component later with user information and logout functionality.

#### Step 3: Create Your App Layout

**Goal:** Create a new layout component that wraps all pages, while keeping your original `App.jsx` as reference.

**What you're doing:**
1. **Create a new file** `src/components/AppLayout.jsx` that will be the skeleton of the app instead of the App.jsx file (don't delete `App.jsx` yet!)
2. **Create the structure** of the app layout
  - The layout will have a header with the title of the app
  - The layout will have the Navigation component
  - The layout will have an Outlet component where the page content will be rendered
  - Retain the same styles and layout from the App.jsx file (`App.css`)
  - Apply the saved theme when the component mounts

**Create `src/components/AppLayout.jsx`** with this new content:

```jsx
import { useEffect } from "react";
import { Navigation } from "./Navigation";
import { Outlet } from "react-router-dom";
import { applySavedTheme } from "../utils/theme";
import "../App.css";

export function AppLayout() {
  // Apply theme when component mounts
  useEffect(() => {
    applySavedTheme();
  }, []);
  
  return (
    <main>
      <header>
        <h1>Welcome to the Games Lobby</h1>
      </header>
      <Navigation />
      <Outlet />
    </main>
  );
}
```

**What this new layout does:**
- **Provides the shell** for all pages (navigation + content area)
- **Uses `<Navigation />`** for the nav bar (we created this in Step 2)
- **Uses `<Outlet />`** where React Router will render child pages
- **Keeps the CSS import** for styling
- **Applies saved theme** when the component mounts using `useEffect`

**What we're NOT doing yet:**
- ❌ Moving all the state management (we'll do that in later steps)
- ❌ Updating the Lobby component (we'll do that in Step 7)

**Your original `App.jsx` is still there** - we'll reference it when we move the logic to the new components.

#### Step 3.5: Use the Provided Theme Utility Function

**Goal:** Use the provided `applySavedTheme` function to apply theme settings across the application.

**Note:** The `applySavedTheme` function is already provided in `src/utils/theme.js`. You just need to import and use it in your components.

**What this function does:**
- **Loads settings** from localStorage using the existing `loadSettings()` function
- **Applies dark theme** to `document.documentElement`, `document.body`, and `main` element
- **Removes dark theme** when not enabled
- **Centralizes theme logic** - can be called from any component

**Why we need this:**
- **Consistent theming** - ensures theme is applied across all pages
- **Reusable function** - can be called from AppLayout, Lobby, or any component
- **Maintains theme state** - theme persists across page navigation

#### Step 4: Create Your Home Page (Basic Version)

**Goal:** Create a simple home page with a list of games. We'll add search functionality later.

**Create `src/pages/HomePage.jsx`:**

```jsx
import { Link } from "react-router-dom";

export function HomePage() {
  const games = [
    { key: "rps", name: "Rock Paper Scissors", description: "A simple game of Rock Paper Scissors" },
    { key: "tic-tac-toe", name: "Tic Tac Toe", description: "A simple game of Tic Tac Toe" },
  ];

  return (
    <section>
      <h2>Available Games</h2>
      <p>Choose a game to play</p>

      <ul style={{ textAlign: "left" }}>
        {games.map((game) => (
          <li key={game.key}>
            <Link to={`/game/${game.key}`}>{game.name}</Link>
            <p>{game.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

**What this does:**
- **Simple list** of available games
- **Links to game pages** (they won't work yet, but that's okay)
- **No search functionality yet** - we'll add that later
- **Clean, minimal version** to get the structure working
- **Uses `key` property** for game identification instead of `name`

### Phase 2: Router Configuration

#### Step 5: Set Up Your Router

**Goal:** Configure React Router with all your routes using the Data Router API.

**Update `src/main.jsx`:**

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { HomePage } from "./pages/HomePage";
import { LobbyView } from "./pages/LobbyPage";
import { applySavedTheme } from "./utils/theme";

// Apply theme on app start
applySavedTheme();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/lobby", element: <LobbyView /> },
      // We'll add game routes in later steps
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
```

**Key concepts:**
- `createBrowserRouter` - Modern React Router API
- `RouterProvider` - Renders the router
- Nested routes with `children` array

**Test checkpoint:** 
- Run `npm run dev`
- You should see your new Home page with navigation
- Click the navigation links for the Home and Lobby pages - they should work!
- The lobby page should show your existing settings form
- The game links won't work yet (that's expected - we'll add them in the next steps)

**💾 Commit Milestone:**
```bash
git add .
git commit -m "feat: add basic router setup with home and lobby pages"
```

#### Step 6: Make Lobby Component Standalone

At this point, if you tried to use the Lobby component and the form, they wouldnt work and you would see an error in the console. This is because we used to pass props from the App.jsx file to the Lobby component, but now we are using the router and the Lobby component is not a child of the App.jsx file.

**Goal:** Remove prop dependencies from Lobby component and make it manage its own state using the settings functions.

**Current problem:** Your Lobby component expects these props from a parent:
- `onGameStart`, `onSettingsSave`
- `name`, `setName`, `avatar`, `setAvatar`, `difficulty`, `setDifficulty`, `darkMode`, `setDarkMode`

**What we need to do:** Make it standalone so it can work in the router without parent props.

**Why we're reverting "lifting state up":**

In last week's assignment, you learned to **lift state up** - moving state from child components to a parent component and passing it down as props. This was the right pattern for a single-page app where one parent (`App.jsx`) managed everything.

But now we're building a **multi-page app with React Router**, and the rules change:

**Last week (Single Page App):**
```jsx
// App.jsx managed all state
const [name, setName] = useState("");
const [avatar, setAvatar] = useState();

// Passed down as props
<LobbyView 
  name={name} 
  setName={setName}
  avatar={avatar}
  setAvatar={setAvatar}
  // ... more props
/>
```

**This week (Multi-Page App):**
```jsx
// Router renders components directly - no parent to pass props
<Route path="/lobby" element={<LobbyView />} />
// LobbyView must manage its own state!
```

**Why this change is necessary:**
- **Router components are independent** - they don't have a parent to receive props from
- **Each page manages its own data** - this is how real web apps work
- **localStorage provides persistence** - settings survive page refreshes and navigation
- **We'll add Context later** - for sharing state across components when needed

**This is a common pattern in React Router apps:**
- Each route component is self-contained
- They read/write to localStorage for persistence
- Context is used for shared state that needs to be reactive

**💡 You can copy this logic from your existing `App.jsx`:**

In your current `App.jsx`, you already have this state management code:

```jsx
const initialSettings = loadSettings() || {
  name: ``,
  difficulty: `normal`,
  avatar: undefined,
  darkMode: false,
};
const [view, setView] = useState("settings");
const [name, setName] = useState(initialSettings.name);
const [avatar, setAvatar] = useState(initialSettings.avatar);
const [difficulty, setDifficulty] = useState(initialSettings.difficulty);
const [darkMode, setDarkMode] = useState(initialSettings.darkMode);
```

**What we're doing:** Moving this logic from `App.jsx` into `Lobby.jsx` so it can work independently in the router.

**Key changes from last week's pattern:**
- **Before**: `onGameStart` and `onSettingsSave` were passed as props from `App.jsx`
- **Now**: Lobby handles its own navigation and settings saving internally
- **Before**: Games were started from the parent component
- **Now**: Lobby navigates directly to games using `useNavigate()`
- **Before**: State was managed in one place (`App.jsx`)
- **Now**: Each component manages its own state with localStorage persistence

**Update `src/pages/LobbyPage.jsx`:**

We'll use the `useNavigate` hook from React Router DOM to handle navigation programmatically. We'll also remove the game start buttons since users will navigate to games through the navigation bar instead.

```jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { capitalize } from "../utils/string_formatting";
import { avatars } from "../logic/avatars";
import { loadSettings, saveSettings } from "../logic/settings";
import { applySavedTheme } from "../utils/theme";

export const LobbyView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Load existing settings or use defaults
  const existingSettings = loadSettings();
  const [name, setName] = useState(existingSettings?.name || "");
  const [avatar, setAvatar] = useState(existingSettings?.avatar);
  const [difficulty, setDifficulty] = useState(existingSettings?.difficulty || "normal");
  const [darkMode, setDarkMode] = useState(existingSettings?.darkMode || false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newSettings = { name, avatar, difficulty, darkMode };
    saveSettings(newSettings);

    // Apply theme immediately after saving
    applySavedTheme();

    // Redirect back to the original route if it exists, otherwise go to home
    const from = location.state?.from;
    navigate(from || "/");
  };

  return (
    <section aria-labelledby="settings-heading" className="card">
      <h2 id="settings-heading">Player Settings</h2>

      <div role="status" aria-live="polite" data-testid="greeting">
        {name ? `Hello ${name}` : null}
      </div>
      <div data-testid="errors" aria-live="polite" className="errors" aria-atomic="true"></div>

      <form id="settings-form" onSubmit={handleFormSubmit} noValidate>
        <div className="field">
          <label htmlFor="player-name">Player Name</label>
          <input
            id="player-name"
            name="player-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength="2"
            maxLength="15"
          />
        </div>

        <fieldset>
          <legend>Choose an avatar</legend>
          <div className="avatar-options">
            {avatars.map((a) => {
              return (
                <label key={a.key} className="avatar-option">
                  <input
                    type="radio"
                    name="avatar"
                    value={a.key}
                    checked={a.key === avatar}
                    onChange={() => setAvatar(a.key)}
                  />
                  <img src={a.image} alt="{avatar.key}" />
                  <span>{capitalize(a.key)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="difficulty">Difficulty</label>
          <select id="difficulty" name="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">easy</option>
            <option value="normal">normal</option>
            <option value="hard">hard</option>
          </select>
        </div>

        <div className="field checkbox">
          <label>
            <input
              id="theme-toggle"
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode((darkMode) => !darkMode)}
            />{" "}
            Dark Theme
          </label>
        </div>

        <button id="save-settings" type="submit">
          Save Settings
        </button>
      </form>

      {/* Game navigation will be added later after we create the game routes */}
    </section>
  );
};
```

**Key changes:**
- **Removed all prop dependencies** - no more props from parent
- **Uses `loadSettings()` and `saveSettings()`** - manages settings internally
- **Uses `useNavigate()`** - handles navigation internally
- **Standalone component** - works in router without parent

**Test checkpoint:**
- Save settings and verify you're redirected to home
- Test that settings are saved to localStorage
- Verify the component works without any parent props
- The lobby now works independently without needing props from a parent

**Note:** We'll add the game navigation functionality after we create the game pages and routes. For now, the Lobby just needs to be able to save settings independently.

**💾 Commit Milestone:**
```bash
git add .
git commit -m "feat: make lobby component standalone"
```

### Phase 3: Game Pages

#### Step 7: Create RPS Game Page

**Goal:** Rename and move your existing `Game.jsx` component to create the RPS game page, with it loading settings internally.

**Rename and move the component:**
from src/components/Game.jsx to src/pages/RPSGamePage.jsx

**Update `src/pages/RPSGamePage.jsx` to load settings directly:**

```jsx
import { loadSettings } from '../logic/settings';
// ... other imports ...

export function RPSGamePage() {
  // Load settings directly in the component
  const settings = loadSettings();
  
  // Use the settings in your existing game logic
  const playerName = settings?.name || 'Player';
  const playerAvatar = settings?.avatar;
  const difficulty = settings?.difficulty || 'normal';
  
  // ... rest of your existing game component logic ...
}
```

**What this does:**
- **Removes prop dependencies** - `RPSGamePage` now manages its own settings
- **Uses `loadSettings()`** - loads settings from localStorage directly
- **Works in router** - no need for a wrapper component
- **Maintains existing logic** - just adds settings loading at the top

**Why this approach is better:**
- **Simpler architecture** - one component instead of wrapper + component
- **Self-contained** - `RPSGamePage` handles its own data needs
- **Router-friendly** - works directly as a route component
- **Less code** - no need for additional wrapper components
- **Clear naming** - `RPSGamePage` clearly indicates it's a page component 

#### Step 8: Organize Components for Multiple Games

**Goal:** Rename and reorganize components to support multiple games.

**Before we add Tic-Tac-Toe, let's organize our existing RPS components:**

1. **Rename the game folder to be more specific:**
from src/components/game to src/components/rps-game

We may later find that some of those components are generic enough to be used for other games (the player info card, for example).
At that time, you can move them to another folder that would be common for the games. and that is a true reflection of how software development works.

2. **Update any imports in your `RPSGamePage.jsx` if needed:**

```jsx
// Update imports to use the new folder name
import { GameSection } from '../components/rps-game/GameSection';
import { HighScoresSection } from '../components/rps-game/HighScoresSection';
import { PlayerInfoCard } from '../components/rps-game/PlayerInfoCard';
```

**Why we're doing this:**
- **Organized folders** - `rps-game` vs `tic-tac-toe-game`
- **Scalable structure** - easy to add more games later
- **Clear separation** - each game has its own component folder
- **Page components** - game pages are in the `pages` folder

#### Step 9: Create Tic-Tac-Toe Placeholder

**Goal:** Create a placeholder page for the Tic-Tac-Toe game so we can wire it up to the router.

**Create `src/pages/TicTacToePage.jsx`:**

```jsx
export function TicTacToePage() {
  return (
    <div>
      <h2>Tic-Tac-Toe Game</h2>
      <p>This game will be implemented later.</p>
      <p>For now, this is just a placeholder page.</p>
    </div>
  );
}
```

**What this does:**
- **Creates a simple placeholder** that we can route to
- **Allows us to test routing** before implementing the game
- **Keeps the tutorial focused** on React Router concepts
- **We'll fill this in later** with the actual game

**Why we're doing this now:**
- **Test routing first** - make sure all routes work
- **Build incrementally** - get the structure working before adding complexity
- **Focus on router concepts** - learn routing before game development

#### Step 10: Add Game Routes to Router

**Goal:** Add the game routes to the router so we can test them.

**Update `src/main.jsx` to include the new game pages:**

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { HomePage } from "./pages/HomePage";
import { LobbyView } from "./pages/LobbyPage";
import { RPSGamePage } from "./pages/RPSGamePage";
import { TicTacToePage } from "./pages/TicTacToePage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { applySavedTheme } from "./utils/theme";

// Apply theme on app start
applySavedTheme();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/lobby", element: <LobbyView /> },
      {
        path: "/game/rps",
        element: (
          <ProtectedRoute>
            <RPSGamePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/game/tic-tac-toe",
        element: (
          <ProtectedRoute>
            <TicTacToePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
```

**Test checkpoint:** 
- Run `npm run dev`
- Click the navigation links for both games
- The RPS game should work because it loads settings from localStorage
- The Tic-Tac-Toe placeholder should work
- Test that all routes work correctly

**Note about the games:**
- Both games should work now because they can access settings from localStorage
- The RPS game loads settings using `loadSettings()` function
- The Tic-Tac-Toe game works independently without needing settings

**💾 Commit Milestone:**
```bash
git add .
git commit -m "feat: add game pages and routes"
```

#### Step 10.5: Add Protection to Game Routes

**Goal:** Now add the ProtectedRoute wrapper to protect the game routes.

**Update `src/main.jsx` to add protection:**

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { HomePage } from "./pages/HomePage";
import { LobbyView } from "./pages/LobbyPage";
import { RPSGamePage } from "./pages/RPSGamePage";
import { TicTacToePage } from "./pages/TicTacToePage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { applySavedTheme } from "./utils/theme";

// Apply theme on app start
applySavedTheme();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/lobby", element: <LobbyView /> },
      {
        path: "/game/rps",
        element: (
          <ProtectedRoute>
            <RPSGamePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/game/tic-tac-toe",
        element: (
          <ProtectedRoute>
            <TicTacToePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
```

**Test checkpoint:** 
- Try accessing `/game/rps` without settings - you should be redirected to `/lobby`
- Save settings and verify you're redirected back to the game
- Now the RPS game should work properly with your settings!
- Test both games work correctly with protection

**What happens now:**
- **Without settings**: You get redirected to lobby (protection works!)
- **With settings**: Games work properly because they have the required props
- **Tic-Tac-Toe**: Works regardless because it doesn't need settings

**💾 Commit Milestone:**
```bash
git add .
git commit -m "feat: add protected routes and authentication"
```

#### Step 11: Create Protected Route Component

**Goal:** Create a component that protects routes requiring authentication.

**Create `src/components/ProtectedRoute.jsx`:**

The `children` prop represents the component that should be rendered if the user is authenticated. If not authenticated, we redirect to the lobby.

```jsx
import { Navigate, useLocation } from 'react-router-dom';
import { loadSettings } from '../logic/settings';

export function ProtectedRoute({ children }) {
  const hasSettings = loadSettings();
  const location = useLocation();
  
  if (!hasSettings) {
    // Store the attempted route in state so we can redirect back after login
    return <Navigate to="/lobby" state={{ from: location.pathname }} replace />;
  }
  return children;
}
```

**Key concepts:**
- `Navigate` component for redirects
- `useLocation` hook to get current location
- `state` prop to pass data through navigation
- `replace` to avoid back button issues
- Simple authentication check using `loadSettings()`

#### Step 12: Clean Up (Optional)

**Goal:** Remove the original `App.jsx` file now that everything is working with the new architecture.

**⚠️ Only do this after everything is working!**

Once you've verified that:
- ✅ All routes work correctly
- ✅ Navigation works on all pages  
- ✅ Both games are playable
- ✅ Settings persist and redirects work

**You can now delete the original `App.jsx` file:**

```bash
rm src/App.jsx
```

**Why we waited:**
- We kept it as a reference while building the new architecture
- We could see how the old state management worked
- We could copy logic piece by piece to the new components
- Now that everything is working, we don't need it anymore

**Your app now uses:**
- `AppLayout.jsx` for the shell
- React Router for navigation
- Individual page components for each route

### Phase 4: Enhancements

#### Step 13: Improve Protected Route with State Preservation

**Goal:** Enhance the ProtectedRoute component to preserve the attempted route and redirect users back after authentication.

**Update `src/components/ProtectedRoute.jsx`:**

```jsx
import { Navigate, useLocation } from 'react-router-dom';
import { loadSettings } from '../logic/settings';

export function ProtectedRoute({ children }) {
  const hasSettings = loadSettings();
  const location = useLocation();
  
  if (!hasSettings) {
    // Store the attempted route in state so we can redirect back after login
    return <Navigate to="/lobby" state={{ from: location.pathname }} replace />;
  }
  return children;
}
```

**Key concepts:**
- `useLocation` hook to get current location
- `state` prop to pass data through navigation
- `replace` to avoid back button issues

**Update `src/components/Lobby.jsx` to handle the redirect:**

```jsx
import { useLocation } from 'react-router-dom';

export const LobbyView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ... existing state management ...

  const handleFormSubmit = (e) => {
    e.preventDefault();
    saveSettings({ name, avatar, difficulty, darkMode });
    
    // Redirect back to the original route if it exists, otherwise go to home
    const from = location.state?.from;
    navigate(from || "/");
  };

  // ... rest of component ...
};
```

**What this adds:**
- **State preservation** - remembers where user was trying to go
- **Better UX** - user returns to intended destination after login
- **Seamless flow** - no need to navigate manually after authentication

#### Step 14: Add Search Functionality to Home Page

**Goal:** Enhance your home page with search functionality using URL search parameters.

**Update `src/pages/HomePage.jsx`:**

```jsx
import { Link, useSearchParams } from "react-router-dom";

export function HomePage() {
  const [params, setParams] = useSearchParams();
  const search = (params.get("search") || "").toLowerCase();

  const games = [
    { key: "rps", name: "Rock Paper Scissors", description: "A simple game of Rock Paper Scissors" },
    { key: "tic-tac-toe", name: "Tic Tac Toe", description: "A simple game of Tic Tac Toe" },
  ];

  const filteredGames = games.filter((game) => 
    (!search || game.name.toLowerCase().includes(search))
  );

  return (
    <section>
      <h2>Available Games</h2>
      <p>Choose a game to play</p>

      <input
        id="game-search"
        type="text"
        placeholder="Search games..."
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          if (value.trim() === "") {
            setParams({});
          } else {
            setParams({ search: value });
          }
        }}
      />

      <ul style={{ textAlign: "left" }}>
        {filteredGames.map((game) => (
          <li key={game.key}>
            <Link to={`/game/${game.key}`}>{game.name}</Link>
            <p>{game.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

**What this adds:**
- **Search input** that filters games by name
- **URL search parameters** - search persists in the URL
- **Filtered results** - only shows games matching the search term
- **Form submission** - updates the URL when searching

**Test checkpoint:** 
- Try searching for "rock" - should show only Rock Paper Scissors
- Try searching for "tic" - should show only Tic-Tac-Toe
- Check that the URL updates with `?search=rock`

**💾 Commit Milestone:**
```bash
git add .
git commit -m "feat: add search functionality to home page"
```

#### Step 15: Enhance Your Navigation

**Goal:** Add user information and logout functionality to your navigation.

**Update `src/components/Navigation.jsx`:**

```jsx
import { NavLink, useNavigate } from "react-router-dom";
import { loadSettings } from "../logic/settings";

export function Navigation() {
  const navigate = useNavigate();
  const settings = loadSettings();

  const handleLogout = () => {
    localStorage.removeItem("game.settings");
    navigate("/");
  };

  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      {` | `}
      <NavLink to="/lobby">Lobby</NavLink>
      {` | `}
      <NavLink to="/game/rps">Rock Paper Scissors</NavLink>
      {` | `}
      <NavLink to="/game/tic-tac-toe">Tic-Tac-Toe</NavLink>

      {settings && settings.name && (
        <div>
          <span>Hello, {settings.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
```

**What this adds:**
- **User greeting** - shows the logged-in user's name
- **Logout functionality** - clears settings and redirects to home
- **Conditional display** - only shows user info when logged in

**Test checkpoint:** 
- Save settings and verify you see "Hello, [your name]" in the navigation
- Click logout and verify you're redirected to home
- Verify the user info disappears after logout

**💾 Commit Milestone:**
```bash
git add .
git commit -m "feat: enhance navigation with user info and logout"
```

#### Step 16: Implement Tic-Tac-Toe Game

**Goal:** Fill in the Tic-Tac-Toe placeholder with the actual game from the React tutorial.

**📚 Follow the official React tutorial:**

1. **Go to the React Tic-Tac-Toe tutorial**: https://react.dev/learn/tutorial-tic-tac-toe
2. **Follow the tutorial step by step** - this will teach you:
   - How to build a complete React game
   - State management with `useState`
   - Component composition
   - Event handling
   - Game logic

**🎯 After completing the tutorial, update your TicTacToe component:**

**Update `src/pages/TicTacToePage.jsx`:**

```jsx
// Replace the placeholder with your completed Tic-Tac-Toe code from the tutorial
// Make sure to export it as the default export

export function TicTacToePage() {
  // Your tutorial code goes here
  return (
    <div className="game">
      {/* Your tutorial components */}
    </div>
  );
}
```

**What you'll learn from the tutorial:**
- **React fundamentals** - components, state, props
- **Game development** - logic, win conditions, history
- **Best practices** - clean code, component structure
- **Real-world patterns** - how professional React apps are built

**Why we're using the official tutorial:**
- **Learn from the source** - React team's own teaching materials
- **Comprehensive coverage** - covers all the concepts you need
- **Interactive learning** - hands-on coding experience
- **Industry standard** - this is how React is taught professionally

**Test checkpoint:**
- Complete the React tutorial
- Copy your code into the TicTacToe component
- Test that the game works in your router
- Verify you can navigate to it from the home page

**💾 Commit Milestone:**
```bash
git add .
git commit -m "feat: implement Tic-Tac-Toe game"
```


## 🧪 Testing Your Work

### Running Tests

```bash
# Run all tests
npm test
```

### Manual Testing Checklist

**Navigation:**
- [ ] Navigation bar appears on all pages
- [ ] Active route is highlighted in navigation
- [ ] All links work correctly

**Authentication:**
- [ ] Accessing games without settings redirects to lobby
- [ ] After saving settings, user is redirected back to the game
- [ ] Logout clears settings and redirects to home

**Games:**
- [ ] Rock Paper Scissors game works with saved settings
- [ ] Tic-Tac-Toe game works correctly
- [ ] Both games show user information

**Search:**
- [ ] Search functionality filters games on home page
- [ ] URL updates with search parameters
- [ ] Search persists on page refresh

## 📋 Submission Checklist

Before submitting, verify:

- [ ] All routes work correctly (`/`, `/lobby`, `/game/rps`, `/game/tic-tac-toe`)
- [ ] Protected routes redirect unauthenticated users
- [ ] Settings persist across page reloads
- [ ] Navigation shows active route
- [ ] Search functionality works on home page
- [ ] Both games are playable
- [ ] Logout functionality works
- [ ] All tests pass
- [ ] Code is clean and well-commented

**💾 Final Commit Milestone:**
```bash
git add .
git commit -m "feat: complete React Router multi-game lobby"
```

## 🎓 Key Concepts Learned

### React Router v6.4+ Data Router API
- `createBrowserRouter` - Modern router configuration
- `RouterProvider` - Renders the router
- `Outlet` - Renders child routes
- `NavLink` - Navigation with active state
- `useNavigate` - Programmatic navigation
- `useLocation` - Access current location and state
- `useSearchParams` - URL search parameters

### Protected Routes
- Authentication checks
- Redirect patterns
- State preservation during redirects

### URL State Management
- Search parameters for filtering
- Programmatic URL updates
- State persistence

## 📚 Reference Materials

### React Router Documentation
- [React Router v6.4+ Guide](https://reactrouter.com/en/main)
- [Data Router API](https://reactrouter.com/en/main/routers/create-browser-router)
- [Protected Routes](https://reactrouter.com/en/main/upgrading/v5#require-auth)

### Tutorial Resources
- [React Tic-Tac-Toe Tutorial](https://react.dev/learn/tutorial-tic-tac-toe)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)

## 🎉 Congratulations!

You've successfully built a multi-game lobby with React Router! You now understand:

- Modern React Router patterns
- Protected routes and authentication
- URL state management
- Component composition and reusability

This foundation will serve you well in building more complex React applications!