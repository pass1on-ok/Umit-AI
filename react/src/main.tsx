import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";
import "./i18n.ts";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system">
    <App />
    <Toaster position="top-right" />
  </ThemeProvider>
);
