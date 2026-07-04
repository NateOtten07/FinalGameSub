import { useEffect } from "react";
import { Navigation } from "./Navigation";
import { Outlet } from "react-router-dom";
import { applySavedTheme } from "../utils/theme";
import "../App.css";

export function AppLayout() {
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