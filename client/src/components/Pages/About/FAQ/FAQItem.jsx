// src/components/Pages/About/About.jsx
import React from 'react'
import aboutText    from '../../../data/aboutText.js'
import faqItems     from '../../../data/faqs'
import FAQAccordion from './FAQAccordion'
import styles from '../../../Pages/About/About.module.css'

export default function AboutSection() {
  // Split your long text into paragraphs
  const paragraphs = aboutText
    .trim()
    .split('\n\n')
    .map(p => p.trim())

  return (
    <section className={styles.about}>
      <div className={styles.description}>
        <h1 className={styles.title}>About Montessart</h1>
        {paragraphs.map((text, idx) => (
          <p key={idx} className={styles.paragraph}>
            {text}
          </p>
        ))}
      </div>

      {/* FAQ Accordion */}
      <FAQAccordion items={faqItems} />
    </section>
  )
}
