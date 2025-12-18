// src/components/Pages/Shop/Filters/SortDropdown.jsx
import React from 'react'
import styles from './Filters.module.css'

/**
 * SortDropdown
 * 
 * Props:
 * - sortOption: currently selected sort option string
 * - onSortChange: callback when user selects a new sort option
 */
export default function SortDropdown({
  sortOption,
  onSortChange
}) {
  const options = [
    { value: 'name-asc',  label: 'Name (A → Z)' },
    { value: 'name-desc', label: 'Name (Z → A)' },
    { value: 'price-low',  label: 'Price (Low → High)' },
    { value: 'price-high', label: 'Price (High → Low)' }
  ];

  return (
    <div className={styles.control}>
      <label htmlFor="sort" className={styles.label}>
        Sort By
      </label>
      <select
        id="sort"
        className={styles.select}
        value={sortOption}
        onChange={e => onSortChange(e.target.value)}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
