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