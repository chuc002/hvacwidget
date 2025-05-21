import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Update the title
document.title = "HVAC Maintenance Plans";

// Get any meta description tag or create one if it doesn't exist
let metaDescription = document.querySelector('meta[name="description"]');
if (!metaDescription) {
  metaDescription = document.createElement('meta');
  metaDescription.setAttribute('name', 'description');
  document.head.appendChild(metaDescription);
}

// Set the meta description
metaDescription.setAttribute('content', 'Subscribe to regular HVAC maintenance to keep your system running efficiently and prevent costly breakdowns. Choose from Basic, Standard, and Premium plans.');

// Create a favicon if it doesn't exist
let favicon = document.querySelector('link[rel="icon"]');
if (!favicon) {
  favicon = document.createElement('link');
  favicon.setAttribute('rel', 'icon');
  favicon.setAttribute('href', 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><path d=%22M13 10V3L4 14h7v7l9-11h-7z%22 fill=%22%230F766E%22/></svg>');
  document.head.appendChild(favicon);
}

createRoot(document.getElementById("root")!).render(<App />);
