import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { HomePage } from "./components/pages/HomePage";
//import { LobbyView } from "./pages/LobbyPage";
import { applySavedTheme } from "./utils/theme";


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