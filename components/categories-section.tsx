"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Tile = {
  label: string;
  title: string;
  body: string;
  img: string;
};

const TILES: Tile[] = [
  {
    label: "I.",
    title: "Tax credits you didn't claim.",
    body: "FICA tip credit. R&D credit. Employee retention credits. Worth $20K–$120K to most SMBs in our area.",
    img: "/venice/tile-tax.png",
  },
  {
    label: "II.",
    title: "Funding already approved for you.",
    body: "$5K–$1.5M working-capital lines based on revenue alone. Most owners don't know they qualify.",
    img: "/venice/tile-funding.png",
  },
  {
    label: "III.",
    title: "Expenses bleeding out quietly.",
    body: "Six SaaS subscriptions you forgot. Payroll inefficiencies. Vendor lines never reviewed.",
    img: "/venice/tile-expenses.png",
  },
  {
    label: "IV.",
    title: "AI moves that pay back fast.",
    body: "The two or three places AI actually fits your business — and the seven where it doesn't.",
    img: "/venice/tile-ai.png",
  },
  {
    label: "V.",
    title: "Business credit you can't see.",
    body: "$50K–$300K of 0% APR credit lines built around the entity, not you.",
    img: "/venice/tile-credit.png",
  },
  {
    label: "VI.",
    title: "Debt that's costing you twice.",
    body: "Debt acceleration strategies that compress 30-year debt to 5–8 without changing income.",
    img: "/venice/tile-debt.png",
  },
];

export default function CategoriesSection() {
  return (
    <section id="categories" className="section">
      <div className="container-editorial">
        <div className="text-center mb-16">
          <span className="eyebrow no-rule">THE SIX HIDING PLACES</span>
          <h2 className="font-display mt-6">
            Where the money usually <em>hides.</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {TILES.map((t, i) => (
            <motion.article
              key={t.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="hairline-frame relative overflow-hidden"
              style={{
                background: "var(--paper-bone)",
                borderRadius: "var(--radius)",
                padding: 32,
              }}
            >
              <div className="grid grid-cols-[88px_1fr] gap-6 items-start">
                <div
                  className="relative hairline-frame overflow-hidden"
                  style={{
                    aspectRatio: "1/1",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--paper-cream)",
                  }}
                >
                  <Image
                    src={t.img}
                    alt=""
                    fill
                    sizes="88px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div>
                  <span
                    className="font-mono"
                    style={{ color: "var(--gold-dark)", fontSize: 11, letterSpacing: "0.22em" }}
                  >
                    {t.label}
                  </span>
                  <h3 className="font-display mt-2" style={{ fontSize: 28, lineHeight: 1.15 }}>
                    {t.title}
                  </h3>
                  <p className="mt-4" style={{ color: "var(--text-mute)", fontSize: 16, lineHeight: 1.65 }}>
                    {t.body}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
