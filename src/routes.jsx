import React from "react";
import { AppLayout } from "./components/AppLayout";
import { HomePage } from "./pages/HomePage";
import { LobbyView } from "./pages/LobbyPage";
import { RPSGamePage } from "./pages/RPSGamePage";
import { TicTacToePage } from "./pages/TicTacToePage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Wordle from "./pages/Wordle";
import TypeTest from "./pages/TypeTest";

export const appRoutes = [
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
      {
        path: "/game/wordle",
        element: (
          <ProtectedRoute>
            <Wordle />
          </ProtectedRoute>
        ),
      },
      {
        path: "/game/type-test",
        element: (
          <ProtectedRoute>
            <TypeTest />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
