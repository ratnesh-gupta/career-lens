import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/styles/globals.css";

import App from "./app/App";
import { bootstrap } from "./app/bootstrap";

bootstrap().then(() => {
  const root = document.getElementById("root");
  if (!root) throw new Error("#root element not found");

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}).catch(console.error);
