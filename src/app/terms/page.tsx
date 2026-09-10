import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms and Disclaimer",
  description: "AutoCheck QC terms and AI-assisted pre-screen disclaimer."
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <Container className="narrow">
        <SectionHeading
          eyebrow="Terms"
          title="AI-assisted pre-screen, not a guarantee."
          body="This page sets the tone for safe public copy and production legal review."
        />
        <div className="policy-content">
          <h2>Core disclaimer</h2>
          <p>{siteConfig.disclaimer}</p>
          <h2>Claims AutoCheck QC should avoid</h2>
          <ul>
            <li>Guaranteed hidden-defect protection</li>
            <li>Guaranteed accident detection</li>
            <li>Certified mechanical inspection</li>
            <li>Guaranteed market value</li>
            <li>Legal, insurance, SAAQ, or RDPRM advice</li>
          </ul>
          <h2>Safe wording</h2>
          <p>
            Reports should use phrases like visible risk, based on the listing information,
            recommended to verify, possible red flag, and confirm with a professional inspection.
          </p>
        </div>
      </Container>
    </main>
  );
}
