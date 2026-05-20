"use client";

import { motion } from "framer-motion";

type Row = { label: string; title: string; body: string };

const ROWS: Row[] = [
  {
    label: "ONE",
    title: "A found-money map.",
    body:
      "Every credit, capital line, expense leak, and AI opportunity we surfaced. Itemized. Sourced.",
  },
  {
    label: "TWO",
    title: "A four-week play.",
    body:
      "Three highest-leverage moves, ranked by ROI, with the vetted partners who execute them.",
  },
  {
    label: "THREE",
    title: "A zero-card promise.",
    body:
      "Every move starts with a free trial, free assessment, or contingency-based work. No upfront commits.",
  },
  {
    label: "FOUR",
    title: "An exit, if you want one.",
    body:
      "If nothing applies, you walk. No follow-up emails. No reminders. We're betting on the data, not the desperation.",
  },
];

export default function ReceiptSection() {
  return (
    <section
      id="receipt"
      className="section"
      style={{ background: "var(--paper-cream)", borderTop: "1px solid var(--hairline)" }}
    >
      <div className="container-editorial">
        <div className="text-center mb-16">
          <span className="eyebrow no-rule">THE RECEIPT</span>
          <h2 className="font-display mt-6">
            What you walk <em>away</em> with.
          </h2>
        </div>

        <ol className="max-w-3xl mx-auto" style={{ listStyle: "none", padding: 0 }}>
          {ROWS.map((r, i) => (
            <motion.li
              key={r.label}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-[80px_1fr] gap-8 items-start"
              style={{
                padding: "32px 0",
                borderTop: i === 0 ? "1px solid var(--hairline)" : "0",
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              <span
                className="font-mono"
                style={{ color: "var(--gold-dark)", fontSize: 11, letterSpacing: "0.22em", paddingTop: 8 }}
              >
                {r.label}
              </span>
              <div>
                <h3 className="font-display" style={{ fontSize: 32, lineHeight: 1.1 }}>
                  {r.title}
                </h3>
                <p className="mt-3" style={{ color: "var(--text-mute)", fontSize: 17, lineHeight: 1.65 }}>
                  {r.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
