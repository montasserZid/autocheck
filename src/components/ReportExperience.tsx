"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { demoVehicleIntake } from "@/lib/mockData";
import { generateDemoReport } from "@/lib/reportEngine";
import { getStoredIntake, getStoredReportType, saveReport } from "@/lib/localStorage";
import type { DemoBuyerReport, ReportPackage } from "@/types/domain";
import { ReportView } from "./ReportView";

function coerceReportType(value: string | null): ReportPackage {
  return value === "free" || value === "full" ? value : "full";
}

export function ReportExperience() {
  const searchParams = useSearchParams();
  const [report, setReport] = useState<DemoBuyerReport | null>(null);

  const reportType = useMemo<ReportPackage>(() => {
    return coerceReportType(searchParams.get("type"));
  }, [searchParams]);

  useEffect(() => {
    const storedType = getStoredReportType();
    const selectedType = searchParams.get("type") ? reportType : storedType ?? reportType;
    const intake = getStoredIntake() ?? demoVehicleIntake;
    const generated = generateDemoReport(intake, selectedType);

    saveReport(generated);
    setReport(generated);
  }, [reportType, searchParams]);

  if (!report) {
    return (
      <div className="loading-panel">
        <p className="eyebrow">Generating demo report</p>
        <h1>Preparing your AutoCheck QC report...</h1>
      </div>
    );
  }

  return <ReportView report={report} />;
}
