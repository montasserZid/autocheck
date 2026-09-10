import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ConfirmationDetails } from "@/components/ConfirmationDetails";

export const metadata: Metadata = {
  title: "Inspection Request Confirmation",
  description: "Confirmation for the AutoCheck QC demo mobile inspection request."
};

export default function InspectionConfirmationPage() {
  return (
    <main className="page-shell">
      <Container className="narrow">
        <ConfirmationDetails />
      </Container>
    </main>
  );
}
