// src/App.jsx
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentPage, PAGES } from "./redux/slices/pageSlice";

import Home from "./components/Pages/Home/Home";
import Shop from "./components/Pages/Shop/Shop";
import Cart from "./components/Pages/Cart/Cart";
import About from "./components/Pages/About/About";
import NavBar from "./components/Layout/NavBar/NavBar";
import Footer from "./components/Layout/Footer/Footer";
import styles from "./App.module.css";
import Confirmation from "./components/Pages/Confirmation/Confirmation";

import { API_BASE } from "./apiBase";


export default function App() {
  const currentPage = useSelector(selectCurrentPage);

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((res) => {
        if (!res.ok) throw new Error(`Health failed: ${res.status}`);
        return res.json();
      })
      .then((data) => console.log("API:", data))
      .catch((err) => console.error("API error:", err));
  }, []); // ✅ no API_BASE here

  let page = null;

  switch (currentPage) {
    case PAGES.HOME:
      page = <Home />;
      break;
  
    case PAGES.SHOP:
      page = <Shop />;
      break;
  
    case PAGES.CART:
      page = <Cart />;
      break;
  
    case PAGES.ABOUT:
      page = <About />;
      break;
  
    case PAGES.CONFIRMATION:
      page = <Confirmation />;
      break;
  
    default:
      page = <Home />;
      break;
  }
  

  
  return (
    <div className={styles.appShell}>
      <NavBar />
      <main className={styles.page}>{page}</main>
      <Footer />
    </div>
  );
}
