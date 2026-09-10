import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { InspectionBookingForm } from "@/components/InspectionBookingForm";

export const metadata: Metadata = {
  title: "Book a Mobile Inspection",
  description: "Submit a demo mobile inspection request for a used car in Montreal or Quebec."
};

export default function InspectionPage() {
  return (
    <main className="page-shell">
      <Container className="narrow">
        <InspectionBookingForm />
      </Container>
    </main>
  );
}
