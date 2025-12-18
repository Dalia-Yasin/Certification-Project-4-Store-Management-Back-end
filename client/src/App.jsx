// src/App.jsx
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentPage, PAGES } from "./redux/slices/pageSlice";


import Home from "./components/Pages/Home/Home";
import Shop from "./components/Pages/Shop/Shop";
import Cart from "./components/Pages/Cart/Cart";
import styles from "./App.module.css";
import NavBar from "./components/Layout/NavBar/NavBar";
import Footer from "./components/Layout/Footer/Footer";
import About from "./components/Pages/About/About"; 


const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function App() {
  const currentPage = useSelector(selectCurrentPage);

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((res) => res.json())
      .then((data) => console.log("API:", data))
      .catch((err) => console.error("API error:", err));
  }, []);

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
    default:
      page = <Home />;
  }
  

  return (
    <div className={styles.appShell}>
      <NavBar />
      <main className={styles.page}>{page}</main>
      <Footer />
    </div>
  );
}
