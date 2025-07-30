import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { loader } from '@monaco-editor/react';

loader.init().then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  );
});
