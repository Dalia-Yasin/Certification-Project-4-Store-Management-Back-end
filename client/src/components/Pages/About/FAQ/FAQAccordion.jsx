// src/components/Pages/About/FAQAccordion.jsx
import React, { useState } from 'react';
import FAQItem from './FAQItem';
import styles from './FAQAccordion.module.css'; // Updated path

export default function FAQAccordion({ items = [] }) { // Default empty array
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  // Safety checks
  if (!Array.isArray(items)) {
    console.error('FAQAccordion: Expected items to be an array, got:', items);
    return null; // or return a friendly error message
  }

  if (items.length === 0) {
    return <div className={styles.noQuestions}>No questions available</div>;
  }

  return (
    <section className={styles.faqContainer}>
      <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
      {items.map((item, index) => (
        <FAQItem
          key={index}
          item={item}
          index={index}
          isActive={activeIndex === index}
          onToggle={handleToggle}
        />
      ))}
    </section>
  );
}