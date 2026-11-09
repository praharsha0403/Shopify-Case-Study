import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/globals.css";
import "./site.css";
import App from "./App";

// print: open every collapsed section and reveal everything, then restore afterwards
let opened: HTMLDetailsElement[] = [];
window.addEventListener("beforeprint", () => {
  opened = [...document.querySelectorAll<HTMLDetailsElement>("details:not([open])")];
  opened.forEach((d) => (d.open = true));
  document.querySelectorAll(".rv").forEach((e) => e.classList.add("in"));
});
window.addEventListener("afterprint", () => {
  opened.forEach((d) => (d.open = false));
  opened = [];
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
