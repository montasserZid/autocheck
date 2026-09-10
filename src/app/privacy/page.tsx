import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy approach for AutoCheck QC Phase 1 demo."
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <Container className="narrow">
        <SectionHeading
          eyebrow="Privacy"
          title="Collect only what is needed."
          body="Phase 1 keeps customer journey data in local browser storage. Future production services must use secure storage, retention rules, and deletion requests."
        />
        <div className="policy-content">
          <h2>Information the product may collect later</h2>
          <p>
            Name, phone number, email, seller information, vehicle location, VIN, screenshots,
            listing text, report details, inspection request details, and feedback.
          </p>
          <h2>Phase 1 demo behavior</h2>
          <p>
            Form data and inspection requests are stored locally in this browser. No database,
            email service, payment provider, AI API, SMS provider, or file storage is connected.
          </p>
          <h2>Production principles</h2>
          <p>
            AutoCheck QC should collect only what is needed, store only what is useful, protect
            uploaded screenshots, restrict admin access, and allow deletion requests.
          </p>
        </div>
      </Container>
    </main>
  );
}
