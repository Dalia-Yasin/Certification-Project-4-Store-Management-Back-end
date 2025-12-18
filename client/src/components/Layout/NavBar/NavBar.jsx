// src/components/Layout/NavBar/NavBar.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPage,
  PAGES,
  selectCurrentPage,
} from "../../../redux/slices/pageSlice";
import { selectCartItemCount } from "../../../redux/slices/cartSlice";
import styles from "./NavBar.module.css";

// Import from src/assets (Vite bundling)
import logoSvg from "../../../assets/logo/Montessart_logo.png";
import hamburgerSvg from "../../../assets/SVG/hamburger.svg";
import cartIcon from "../../../assets/SVG/cart.png";

export default function NavBar() {
  const dispatch = useDispatch();
  const currentPage = useSelector(selectCurrentPage);
  const cartItemCount = useSelector(selectCartItemCount);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = (page) => {
    dispatch(setPage(page));
    setMenuOpen(false);
  };

  const navItems = [
    { id: PAGES.HOME, label: "Home" },
    { id: PAGES.SHOP, label: "Shop" },
    { id: PAGES.ABOUT, label: "About" },
  ];

  return (
    <header className={styles.nav}>
      {/* Logo */}
      <button
        type="button"
        className={styles.logo}
        onClick={() => navigate(PAGES.HOME)}
        aria-label="Return to homepage"
      >
        <img src={logoSvg} alt="Montessart logo" className={styles.logoImage} />
      </button>

      {/* Desktop navigation */}
      <nav className={styles.desktopNav} aria-label="Main navigation">
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`${styles.navLink} ${
                  currentPage === item.id ? styles.active : ""
                }`}
                onClick={() => navigate(item.id)}
                aria-current={currentPage === item.id ? "page" : undefined}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Cart + Hamburger wrapper */}
      <div className={styles.cartHamburgerWrapper}>
        {/* Cart button (hide when menu open) */}
        {!menuOpen && (
          <button
            type="button"
            className={styles.cartButton}
            onClick={() => navigate(PAGES.CART)}
            aria-label={`View cart (${cartItemCount} items)`}
          >
            <img
              src={cartIcon}
              alt=""
              aria-hidden="true"
              className={styles.cartIcon}
            />
            {cartItemCount > 0 && (
              <span className={styles.badge} aria-hidden="true">
                {cartItemCount}
              </span>
            )}
          </button>
        )}

        {/* Hamburger */}
        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <img src={hamburgerSvg} alt="" aria-hidden="true" className={styles.hamburgerIcon} />
        </button>
      </div>

      {/* Mobile off-canvas menu */}
      {isMobile && (
        <div
          className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}
          aria-hidden={!menuOpen}
        >
          <div className={styles.mobileMenuHeader}>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          <nav aria-label="Mobile navigation">
            <ul className={styles.mobileNavList}>
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`${styles.mobileNavLink} ${
                      currentPage === item.id ? styles.active : ""
                    }`}
                    onClick={() => navigate(item.id)}
                    aria-current={currentPage === item.id ? "page" : undefined}
                  >
                    {item.label}
                  </button>
                </li>
              ))}

              <li>
                <button
                  type="button"
                  className={styles.mobileCartLink}
                  onClick={() => navigate(PAGES.CART)}
                >
                  Cart {cartItemCount > 0 && `(${cartItemCount})`}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
