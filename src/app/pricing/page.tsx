import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Pricing",
  description: "AutoCheck QC demo pricing for Free Quick Check and Full Buyer Report."
};

export default function PricingPage() {
  return (
    <main className="page-shell">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Simple pre-screening before the larger decision."
          body="Phase 1 shows the planned pricing and routes through demo checkout only. No real payment is processed."
          align="center"
        />
        <div className="pricing-grid">
          <article className="comparison-card">
            <p className="eyebrow">Free Quick Check</p>
            <h2>$0</h2>
            <ul>
              <li>Basic risk level</li>
              <li>3 visible red flags</li>
              <li>3 seller questions</li>
              <li>Basic recommendation</li>
            </ul>
            <ButtonLink href="/check" variant="secondary">
              Start Free Check
            </ButtonLink>
          </article>
          <article className="comparison-card highlighted">
            <p className="eyebrow">Full Buyer Report</p>
            <h2>$19.99 CAD</h2>
            <ul>
              <li>Vehicle summary and risk score</li>
              <li>Price logic and missing information</li>
              <li>Common issue checklist</li>
              <li>Questions and negotiation points</li>
              <li>Inspection recommendation</li>
            </ul>
            <ButtonLink href="/check" variant="primary">
              Preview Demo Checkout
            </ButtonLink>
          </article>
          <article className="comparison-card">
            <p className="eyebrow">Premium Human Review</p>
            <h2>$49.99 CAD</h2>
            <ul>
              <li>Future Phase 2+ option</li>
              <li>AI report plus human review</li>
              <li>More specific negotiation advice</li>
              <li>Priority delivery</li>
            </ul>
            <ButtonLink href="/contact" variant="ghost">
              Ask About Premium
            </ButtonLink>
          </article>
        </div>
      </Container>
    </main>
  );
}
