import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Sync the persisted palette BEFORE first paint so the loader (and every
// palette-driven surface) renders in the right theme immediately instead of
// flashing cobalt blue and switching after mount.
try {
  const raw = localStorage.getItem("dolancer.ui");
  const palette = raw ? (JSON.parse(raw) as { state?: { palette?: string } }).state?.palette : undefined;
  if (palette === "cobalt" || palette === "violet" || palette === "mint" || palette === "sunset") {
    document.documentElement.dataset.palette = palette;
  }
} catch {
  // Corrupt storage - fall back to the default palette.
}

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
