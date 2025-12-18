// src/components/Pages/Shop/Filters/CategoryDropdown.jsx
import React from 'react'
import styles from './Filters.module.css'

/**
 * CategoryDropdown
 * 
 * Props:
 * - category: current selected category string
 * - availableCategories: array of category strings to display
 * - onCategoryChange: callback when user selects a new category
 */
export default function CategoryDropdown({
  category,
  availableCategories = [],
  onCategoryChange
}) {
  return (
    <div className={styles.control}>
      <label htmlFor="category" className={styles.label}>
        Category
      </label>
      <select
        id="category"
        className={styles.select}
        value={category}
        onChange={e => onCategoryChange(e.target.value)}
      >
        {availableCategories.map(cat => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>
    </div>
  )
}
