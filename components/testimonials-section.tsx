"use client";

import { motion } from "framer-motion";

type Quote = { quote: string; attribution: string };

const QUOTES: Quote[] = [
  {
    quote:
      "Dave found $47,000 in FICA tip credit I'd been leaving on the table for three years. The whole conversation took eleven minutes.",
    attribution: "RESTAURANT OWNER · VENICE FL",
  },
  {
    quote:
      "I thought it was a sales pitch. He didn't sell me anything. He showed me $112K in funding lines I already qualified for.",
    attribution: "HVAC CONTRACTOR · NORTH PORT FL",
  },
  {
    quote:
      "He told me NOT to spend $9K/month on the marketing agency. That alone paid for the next twelve months.",
    attribution: "MED SPA OWNER · SARASOTA FL",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="section">
      <div className="container-editorial">
        <div className="text-center mb-14">
          <span className="eyebrow no-rule">THREE NEIGHBORS, ON THE RECORD</span>
          <h2 className="font-display mt-6">
            What the <em>last three</em> said.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {QUOTES.map((q, i) => (
            <motion.figure
              key={q.attribution}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="hairline-frame"
              style={{
                background: "var(--paper-cream)",
                borderRadius: "var(--radius)",
                padding: "36px 28px",
              }}
            >
              <span
                aria-hidden
                className="font-display"
                style={{
                  fontSize: 56,
                  lineHeight: 0.5,
                  color: "var(--gold)",
                  display: "block",
                  height: 22,
                }}
              >
                &ldquo;
              </span>
              <blockquote
                className="font-display"
                style={{
                  fontStyle: "italic",
                  fontSize: 22,
                  lineHeight: 1.4,
                  color: "var(--ink)",
                  marginTop: 8,
                }}
              >
                {q.quote}
              </blockquote>
              <hr className="hairline mt-6 mb-4" style={{ maxWidth: 48 }} />
              <figcaption className="meta-mono" style={{ color: "var(--gold-dark)" }}>
                {q.attribution}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
