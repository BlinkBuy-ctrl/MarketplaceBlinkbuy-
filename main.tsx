import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

window.addEventListener("unhandledrejection", (e) => {
  console.error("[Unhandled]", e.reason);
  e.preventDefault();
});

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
