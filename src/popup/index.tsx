import { createRoot } from "react-dom/client";
import Popup from "./Popup";
import "./popup.css";
import './index.css';

const root = document.getElementById("my-ext-popup-page");
if (root) {
  createRoot(root).render(<Popup />);
}
