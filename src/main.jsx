import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { applySavedTheme } from "./utils/theme";
import { appRoutes } from "./routes";

// Apply theme on app start
applySavedTheme();

const router = createBrowserRouter(appRoutes, {
  basename: import.meta.env.BASE_URL,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);