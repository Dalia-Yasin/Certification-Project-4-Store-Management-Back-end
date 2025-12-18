// src/components/Pages/Shop/Filters/SearchBar.jsx
import React from 'react'
import styles from './Filters.module.css'

export default function SearchBar({ value, onChange, id = 'search-input' }) {
  return (
    <div className={styles.control}>
      <label htmlFor={id} className={styles.label}>
        Search products
      </label>
      <div className={styles.searchWrapper}>
        <input
          id={id}
          type="text"
          placeholder="Search products…"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={styles.input}
          aria-label="Search products"
        />
        <span className={styles.searchIcon} aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
      </div>
    </div>
)
}
