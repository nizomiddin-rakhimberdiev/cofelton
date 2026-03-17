import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import { AdminProvider } from "./context/AdminContext";
import App from "./App.jsx";
import Admin from "./pages/Admin/Admin";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AdminProvider>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </LanguageProvider>
      </AdminProvider>
    </BrowserRouter>
  </StrictMode>
);
