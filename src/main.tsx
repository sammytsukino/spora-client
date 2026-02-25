import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { initAccentColorCycling } from "./lib/accentColorCycling";
import Router from "./router/Router";

initAccentColorCycling();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);

