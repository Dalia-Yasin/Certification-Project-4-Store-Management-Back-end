// src/components/Pages/Home/Home.jsx
import { useDispatch } from "react-redux";
import { setPage, PAGES } from "../../../redux/slices/pageSlice";
import styles from "./Home.module.css";

import heroBg from "../../../assets/background/hero_background.jpg";

export default function Home() {
  const dispatch = useDispatch();

  const goToAbout = () => dispatch(setPage(PAGES.ABOUT)); // or "about" if that's what your slice uses

  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Dark overlay for legibility */}
      <div className={styles.overlay} />

      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h1 className={styles.heroTitle}>Montessart</h1>
          <p className={styles.body}>
            Montessart is a contemporary fashion brand that blends minimalist
            elegance with organic inspiration. Drawing from both the quiet
            strength of mountains and the gentle flow of nature, our chic
            clothing and accessories are designed for those who seek
            high-quality fabrics and timeless silhouettes—where simplicity meets
            sophistication.
          </p>
          <p className={styles.tagline}>
            <em>Simplicity, elevated.</em>
          </p>
        </div>
        <button type="button" className={styles.cta} onClick={goToAbout}>
          Learn More
        </button>
      </div>
    </section>
  );
}
