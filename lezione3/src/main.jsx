import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter} from 'react-router-dom';

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter> {/* Questo é l'elemento contenitore della SPA */}
      <App />
    </BrowserRouter>
  </StrictMode>,
);
