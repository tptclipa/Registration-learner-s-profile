"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: readonly FAQItem[];
}

export function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-list">
      {items.map((item, index) => (
        <div key={index} className="faq-item">
          <button
            type="button"
            onClick={() => toggleItem(index)}
            className="faq-question-btn"
          >
            <span className="faq-question-text">
              {item.question}
            </span>
            <span className="faq-toggle">
              {openIndex === index ? "−" : "+"}
            </span>
          </button>
          {openIndex === index && (
            <div className="faq-answer">
              <p className="faq-answer-text">
                {item.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
