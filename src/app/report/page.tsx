import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { ReportExperience } from "@/components/ReportExperience";

export const metadata: Metadata = {
  title: "Demo Buyer Report",
  description: "View the AutoCheck QC demo report generated from local mock data."
};

export default function ReportPage() {
  return (
    <main className="page-shell">
      <Container>
        <Suspense
          fallback={
            <div className="loading-panel">
              <p className="eyebrow">Loading</p>
              <h1>Preparing report...</h1>
            </div>
          }
        >
          <ReportExperience />
        </Suspense>
      </Container>
    </main>
  );
}
