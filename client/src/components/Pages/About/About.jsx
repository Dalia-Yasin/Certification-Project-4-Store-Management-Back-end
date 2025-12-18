// src/components/Pages/About/About.jsx
import React from "react";
import aboutText from "../../data/aboutText";
import faqItems from "../../data/faqs";
import styles from "./About.module.css";
import faqStyles from "./FAQ/FAQAccordion.module.css";

import fabricImage from "../../../assets/about/fabric.jpg";
import mountains from "../../../assets/about/about_page_mountains.jpg";
import model from "../../../assets/about/model_about_page.jpg";

export default function About() {
  const [expandedQuestion, setExpandedQuestion] = React.useState(null);
  const [showFAQ, setShowFAQ] = React.useState(false);

  const { content } = React.useMemo(() => {
    const blocks = aboutText.trim().split("\n\n").filter(Boolean);
    const firstBlock = blocks[0].split("\n");

    return {
      content: [
        { heading: firstBlock[0], text: firstBlock.slice(1).join(" ") },
        ...blocks.slice(1).map((block) => {
          const [heading, ...text] = block.split("\n");
          return { heading, text: text.join(" ") };
        }),
      ],
    };
  }, []);

  const toggleQuestion = (index) => {
    setExpandedQuestion((prev) => (prev === index ? null : index));
  };

  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.sectionTitle}>About Montessart</h1>

      <div className={styles.gridLayout}>
        <div className={styles.textColumn}>
          {content.map((section, index) => (
            <div key={index} className={styles.contentBlock}>
              <h2 className={styles.sectionHeading}>{section.heading}</h2>
              <p className={styles.sectionText}>{section.text}</p>
              {index < content.length - 1 && <hr className={styles.divider} />}
            </div>
          ))}

          <div className={styles.faqButtonContainer}>
            <button
              type="button"
              onClick={() => setShowFAQ((v) => !v)}
              className={`${styles.faqToggle} ${
                showFAQ ? styles.faqToggleActive : ""
              }`}
            >
              FAQ
            </button>
          </div>
        </div>

        <div className={styles.imageColumn}>
          <div className={styles.imageStack}>
            <img src={fabricImage} alt="Montessart sustainable fabric" className={styles.fabricImage} />
            <img src={mountains} alt="West Coast Mountains" className={styles.fabricImage} />
            <img src={model} alt="Montessart Lookbook" className={styles.fabricImage} />
          </div>
        </div>
      </div>

      {showFAQ && (
        <>
          <div
            className={styles.faqBackdrop}
            onClick={() => setShowFAQ(false)}
            aria-hidden="true"
          />

          {/* ✅ Use faqStyles.faqCard so the X positions correctly */}
          <div className={`${styles.faqCard} ${faqStyles.faqCard}`}>
            <button
              type="button"
              className={faqStyles.faqCloseButton}
              onClick={() => setShowFAQ(false)}
              aria-label="Close FAQ"
            >
              ×
            </button>

            <div className={styles.faqCardContent}>
              <h3 className={styles.faqCardTitle}>Frequently Asked Questions</h3>

              <div className={styles.faqAccordion}>
                {faqItems.map((item, index) => (
                  <div key={index} className={styles.faqItem}>
                    <button
                      type="button"
                      onClick={() => toggleQuestion(index)}
                      className={faqStyles.faqQuestion}
                      aria-expanded={expandedQuestion === index}
                    >
                      {item.question}
                      <span className={faqStyles.faqIcon}>
                        {expandedQuestion === index ? "−" : "+"}
                      </span>
                    </button>

                    {expandedQuestion === index && (
                      <div className={styles.faqAnswer}>{item.answer}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
