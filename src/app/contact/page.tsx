import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact AutoCheck QC for support, partner inquiries, or inspection questions."
};

export default function ContactPage() {
  return (
    <main className="page-shell">
      <Container className="narrow">
        <SectionHeading
          eyebrow="Contact"
          title="Support and partner inquiries."
          body="Phase 1 does not send messages yet. This page defines the future contact surface."
        />
        <div className="contact-panel">
          <h2>Customer support</h2>
          <p>Use this route for report questions, refund requests, privacy requests, and inspection follow-up.</p>
          <h2>Inspection partners</h2>
          <p>
            Mobile mechanics and independent inspectors in Montreal, Laval, Longueuil, Brossard,
            South Shore, and North Shore can be routed through this page in Phase 2.
          </p>
          <div className="button-row">
            <ButtonLink href="/check" variant="primary">
              Check a Car
            </ButtonLink>
            <ButtonLink href="/inspection" variant="secondary">
              Book Inspection
            </ButtonLink>
          </div>
        </div>
      </Container>
    </main>
  );
}
