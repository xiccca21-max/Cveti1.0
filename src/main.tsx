import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ShopDataProvider } from "./context/ShopDataProvider.tsx";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ShopDataProvider>
        <App />
      </ShopDataProvider>
    </BrowserRouter>
  </StrictMode>,
);
