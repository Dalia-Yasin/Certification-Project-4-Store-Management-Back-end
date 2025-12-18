// src/components/Pages/Shop/Filters/Filters.jsx
import React from 'react'
import styles from './Filters.module.css'
import CategoryDropdown from './CategoryDropdown'
import SortDropdown from './SortDropdown'
import SearchBar         from './SearchBar'

/**
 * Filters
 * 
 * Props:
 * - searchTerm: current search string
 * - onSearchChange: fn called with new search term
 * - category: current selected category
 * - onCategoryChange: fn called with new category
 * - sortOption: current sort option
 * - onSortChange: fn called with new sort option
 * - availableCategories: array of categories to display
 */
export default function Filters({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  sortOption,
  onSortChange,
  availableCategories = []
}) {
  return (
    <div className={styles.filters}>
      <SearchBar
        value={searchTerm}
        onChange={onSearchChange}
      />

      <CategoryDropdown
        category={category}
        availableCategories={availableCategories}
        onCategoryChange={onCategoryChange}
      />

      <SortDropdown
        sortOption={sortOption}
        onSortChange={onSortChange}
      />
    </div>
  )
}
