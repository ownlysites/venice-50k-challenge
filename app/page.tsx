import EditorialHeader from "@/components/editorial-header";
import HeroSection from "@/components/hero-section";
import WagerStrip from "@/components/wager-strip";
import CategoriesSection from "@/components/categories-section";
import DaveStrip from "@/components/dave-strip";
import TestimonialsSection from "@/components/testimonials-section";
import ReceiptSection from "@/components/receipt-section";
import FinalCta from "@/components/final-cta";
import FooterColophon from "@/components/footer-colophon";

export default function Page() {
  return (
    <>
      <EditorialHeader />
      <main className="flex-1">
        <HeroSection />
        <WagerStrip />
        <CategoriesSection />
        <DaveStrip />
        <TestimonialsSection />
        <ReceiptSection />
        <FinalCta />
      </main>
      <FooterColophon />
    </>
  );
}
