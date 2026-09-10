import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { faqItems } from "@/lib/mockData";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about AutoCheck QC used-car pre-screening."
};

export default function FaqPage() {
  return (
    <main className="page-shell">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title="Used-car pre-screening, without overpromising."
          body="AutoCheck QC helps buyers decide what to verify before they buy."
          align="center"
        />
        <div className="faq-grid">
          {faqItems.map((item) => (
            <article className="faq-item" key={item.question}>
              <h2>{item.question}</h2>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </Container>
    </main>
  );
}
