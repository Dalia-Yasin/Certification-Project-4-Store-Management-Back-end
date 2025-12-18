// src/components/Pages/Shop/Shop.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchProducts,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
} from "../../../redux/slices/productsSlice";

import {
  setSearchTerm,
  setCategory,
  setSortOption,
  selectFilters,
} from "../../../redux/slices/filtersSlice";

import Filters from "./Filters/Filters";
import ProductCard from "./ProductCard";
import styles from "./Shop.module.css";

export default function Shop() {
  const dispatch = useDispatch();

  const { searchTerm, category, sortOption } = useSelector(selectFilters);

  const products = useSelector(selectProducts);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  // ✅ Debounce search term so we don't fetch on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // map UI sort values -> API sort values
  const apiSort =
    sortOption === "price-low"
      ? "price-asc"
      : sortOption === "price-high"
      ? "price-desc"
      : sortOption === "name-desc"
      ? "name-desc"
      : "name-asc";

  // fetch whenever filters change (uses debouncedSearch)
  useEffect(() => {
    dispatch(
      fetchProducts({
        search: debouncedSearch,
        category, // backend ignores "all"
        sort: apiSort,
        inStock: "true",
      })
    );
  }, [dispatch, debouncedSearch, category, apiSort]);

  // categories dropdown options
  const availableCategories = useMemo(
    () => ["all", ...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const handleResetFilters = () => {
    dispatch(setSearchTerm(""));
    dispatch(setCategory("all"));
    dispatch(setSortOption("name-asc"));
  };

  if (error) {
    return <div className={styles.loading}>Error loading products: {error}</div>;
  }

  return (
    <section className={styles.shop}>
      <Filters
        searchTerm={searchTerm}
        onSearchChange={(val) => dispatch(setSearchTerm(val))}
        category={category}
        onCategoryChange={(val) => dispatch(setCategory(val))}
        sortOption={sortOption}
        onSortChange={(val) => dispatch(setSortOption(val))}
        availableCategories={availableCategories}
      />

      {isLoading ? (
        <div className={styles.loading}>Loading products...</div>
      ) : (
        <div className={styles.grid}>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className={styles.empty}>
              <p>No products match your filters</p>
              <button
                className={styles.resetFilters}
                onClick={handleResetFilters}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
