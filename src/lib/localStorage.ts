import type { DemoBuyerReport, InspectionRequest, ReportPackage, VehicleIntake } from "@/types/domain";

const keys = {
  intake: "autocheck-qc:intake",
  reportType: "autocheck-qc:report-type",
  report: "autocheck-qc:report",
  inspection: "autocheck-qc:inspection-request"
};

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function saveIntake(intake: VehicleIntake): void {
  writeJson(keys.intake, intake);
}

export function getStoredIntake(): VehicleIntake | null {
  return readJson<VehicleIntake>(keys.intake);
}

export function saveReportType(reportType: ReportPackage): void {
  writeJson(keys.reportType, reportType);
}

export function getStoredReportType(): ReportPackage | null {
  return readJson<ReportPackage>(keys.reportType);
}

export function saveReport(report: DemoBuyerReport): void {
  writeJson(keys.report, report);
}

export function getStoredReport(): DemoBuyerReport | null {
  return readJson<DemoBuyerReport>(keys.report);
}

export function saveInspectionRequest(request: InspectionRequest): void {
  writeJson(keys.inspection, request);
}

export function getStoredInspectionRequest(): InspectionRequest | null {
  return readJson<InspectionRequest>(keys.inspection);
}
