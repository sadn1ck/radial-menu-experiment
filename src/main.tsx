import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { StatsMonitor } from "./stats.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StatsMonitor></StatsMonitor>
    <App />
  </React.StrictMode>
);
