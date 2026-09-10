import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ReportView } from "@/components/ReportView";
import { demoVehicleIntake } from "@/lib/mockData";
import { generateDemoReport } from "@/lib/reportEngine";

export const metadata: Metadata = {
  title: "Example Report",
  description: "Preview the AutoCheck QC buyer report structure with demo data."
};

export default function ExampleReportPage() {
  const report = generateDemoReport(demoVehicleIntake, "full");

  return (
    <main className="page-shell">
      <Container>
        <ReportView report={report} />
      </Container>
    </main>
  );
}
