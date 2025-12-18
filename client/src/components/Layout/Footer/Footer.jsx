// src/components/Layout/Footer/Footer.jsx
import React from "react";
import styles from "./Footer.module.css";

import facebookIcon from "../../../assets/SVG/facebook.svg";
import instagramIcon from "../../../assets/SVG/instagram.svg";
import twitterIcon from "../../../assets/SVG/twitter.svg";

const socialLinks = [
  { name: "Facebook", icon: facebookIcon, url: "https://facebook.com" },
  { name: "Instagram", icon: instagramIcon, url: "https://instagram.com" },
  { name: "Twitter", icon: twitterIcon, url: "https://x.com" },
];


// If you prefer bundling instead of public/, you could do:
// import facebookIcon from '../../../assets/facebook.svg'
// import instagramIcon from '../../../assets/instagram.svg'
// import twitterIcon from '../../../assets/twitter.svg'
// const socialLinks = [
//   { name:'Facebook', icon: facebookIcon, url:'#' },
//   ...
// ]

const footerLinks = [
  { text: "Privacy Policy", url: "#" },
  { text: "Terms of Service", url: "#" },
  { text: "Shipping Policy", url: "#" },
  { text: "Returns & Refunds", url: "#" },
  { text: "Contact Us", url: "#" },
  { text: "FAQs", url: "#" },
  { text: "Sustainability", url: "#" },
  { text: "Blog", url: "#" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-label="Site footer">
      <div className={styles.footerContainer}>
        {/* Newsletter Section */}
        <div className={styles.newsletter}>
          <h3 className={styles.heading}>Become a Montessart member</h3>
          <form className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Your email address"
              aria-label="Email for newsletter"
              className={styles.emailInput}
              required
            />
            <button type="submit" className={styles.subscribeButton}>
              Subscribe
            </button>
          </form>
        </div>

        {/* Social Links */}
        <div className={styles.socialSection}>
          <h3 className={styles.heading}>Follow us</h3>
          <div className={styles.socialLinks}>
            {socialLinks.map(({ name, icon, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={name}
              >
                <img
                  src={icon}
                  alt={name}
                  className={styles.socialIcon}
                
                />
              </a>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <nav className={styles.footerNav} aria-label="Footer navigation">
          <ul className={styles.footerLinks}>
            {footerLinks.map(({ text, url }) => (
              <li key={text}>
                <a href={url} className={styles.footerLink}>
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Copyright */}
        <div className={styles.legal}>
          <p className={styles.copy}>
            © {currentYear} Montessart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
