import React from "react";
import ReactDOM from "react-dom/client";
import {App} from "./app/App";
import {initializeTheme} from "./theme/theme";
import "./styles/main.scss";

initializeTheme();

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
);
