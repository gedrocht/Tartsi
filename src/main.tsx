import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

/**
 * The application entry point only has one job: locate the root element and ask React to
 * render the top-level application component into it. Keeping this file tiny makes it easier
 * for beginners to see the boundary between the browser host page and the React application.
 */
const applicationRootElement = document.getElementById("root");

if (applicationRootElement === null) {
  throw new Error("The root element with the identifier 'root' was not found.");
}

ReactDOM.createRoot(applicationRootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

