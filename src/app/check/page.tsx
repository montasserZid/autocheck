import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { VehicleIntakeFlow } from "@/components/VehicleIntakeFlow";

export const metadata: Metadata = {
  title: "Check a Car",
  description: "Paste a used-car listing and generate a demo AutoCheck QC buyer report."
};

export default function CheckPage() {
  return (
    <main className="page-shell">
      <Container>
        <VehicleIntakeFlow />
      </Container>
    </main>
  );
}
