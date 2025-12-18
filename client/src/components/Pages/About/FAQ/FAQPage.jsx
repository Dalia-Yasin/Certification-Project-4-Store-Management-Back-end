// src/components/Pages/FAQ/FAQPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './FAQPage.module.css';
import FAQAccordion from './FAQAccordion';
import FAQItem from './FAQItem';
import faqItems from '../../../data/faqs'; // Import from data file

export default function FAQPage() {
    return (
      <div className={styles.faqPage}>
        <div className={styles.faqHeader}>
          <h1>Frequently Asked Questions</h1>
          <Link to="/about" className={styles.backLink}>
            ← Back to About
          </Link>
        </div>
        
        <FAQAccordion allowMultiple>
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </FAQAccordion>
  
        <div className={styles.contactPrompt}>
          <p>Still have questions?</p>
          <Link to="/contact" className={styles.contactLink}>
            Contact our team
          </Link>
        </div>
      </div>
    );
  }