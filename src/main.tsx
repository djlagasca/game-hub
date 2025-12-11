import { Provider } from "@/components/ui/provider";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import logoUrl from "@/assets/logo.webp";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>
);

const faviconLink = document.querySelector<HTMLLinkElement>("link[rel='icon']");
if (faviconLink) {
  faviconLink.type = "image/webp";
  faviconLink.href = logoUrl;
}
