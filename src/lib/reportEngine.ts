import { siteConfig } from "@/content/site";
import type {
  DemoBuyerReport,
  FinalRecommendation,
  ReportFinding,
  ReportPackage,
  RiskLevel,
  VehicleIntake
} from "@/types/domain";
import { formatCurrencyCad, formatKilometers, titleCaseStatus } from "./format";

function vehicleTitle(intake: VehicleIntake): string {
  return [intake.year, intake.make, intake.model, intake.trim]
    .filter(Boolean)
    .join(" ");
}

function calculateRiskScore(intake: VehicleIntake): number {
  let score = 24;

  if (!intake.vin) score += 10;
  if (intake.inspectionAllowed === "no") score += 24;
  if (intake.inspectionAllowed === "unknown") score += 8;
  if (intake.accidentHistoryMentioned === "yes") score += 15;
  if (intake.accidentHistoryMentioned === "unknown") score += 5;
  if (intake.carfaxStatus === "not_available") score += 8;
  if (intake.carfaxStatus === "unknown") score += 6;
  if (intake.mileageKm > 200000) score += 14;
  if (intake.mileageKm > 150000) score += 6;
  if (intake.askingPriceCad < 5000) score += 6;
  if (intake.listingText.trim().length < 180) score += 8;
  if (intake.photos.length === 0) score += 8;

  return Math.min(score, 92);
}

function riskLevel(score: number): RiskLevel {
  if (score >= 76) return "Very High";
  if (score >= 56) return "High";
  if (score >= 34) return "Medium";
  if (score >= 15) return "Low";
  return "Unknown";
}

function recommendationFor(intake: VehicleIntake, level: RiskLevel): FinalRecommendation {
  if (intake.inspectionAllowed === "no" || level === "Very High") {
    return "Avoid";
  }

  if (level === "High") {
    return "Ask more questions";
  }

  if (level === "Medium") {
    return "Worth professional inspection";
  }

  if (level === "Low" && intake.vin && intake.carfaxStatus === "available") {
    return "Strong candidate";
  }

  return "Worth seeing";
}

function buildRedFlags(intake: VehicleIntake): ReportFinding[] {
  const flags: ReportFinding[] = [];

  if (!intake.vin) {
    flags.push({
      title: "VIN is not provided",
      detail:
        "Ask for the VIN before visiting. The report cannot confirm vehicle history, lien status, or registration details from the listing alone."
    });
  }

  if (intake.inspectionAllowed === "no") {
    flags.push({
      title: "Seller says inspection is not allowed",
      detail:
        "Inspection refusal is a major buyer-risk signal. A professional inspection should be allowed before any final purchase decision."
    });
  } else if (intake.inspectionAllowed === "unknown") {
    flags.push({
      title: "Inspection permission is not clear",
      detail:
        "Confirm whether the seller will allow an independent pre-purchase inspection before you spend time visiting the car."
    });
  }

  if (intake.accidentHistoryMentioned === "yes") {
    flags.push({
      title: "Accident or damage history is mentioned",
      detail:
        "Ask for repair invoices, photos, Carfax details, and inspection permission. This report cannot confirm the severity from the listing."
    });
  } else if (intake.accidentHistoryMentioned === "unknown") {
    flags.push({
      title: "Accident history is not stated",
      detail:
        "The listing does not clearly state accident history. Treat this as missing information until documentation is provided."
    });
  }

  if (intake.mileageKm > 150000) {
    flags.push({
      title: "Mileage deserves extra verification",
      detail:
        "Higher-mileage vehicles can still be good candidates, but maintenance records, rust condition, suspension, brakes, and drivetrain behavior matter more."
    });
  }

  if (intake.listingText.trim().length < 180) {
    flags.push({
      title: "Listing description is thin",
      detail:
        "A short ad can hide important details. Ask for service records, ownership history, reason for sale, and current warning lights."
    });
  }

  if (intake.photos.length === 0) {
    flags.push({
      title: "No screenshots or photos uploaded",
      detail:
        "Photos are useful for visible condition checks. Request exterior, interior, dashboard, tire, rocker panel, and underbody photos."
    });
  }

  return flags.slice(0, 6);
}

function buildMissingInformation(intake: VehicleIntake): ReportFinding[] {
  const missing: ReportFinding[] = [];

  if (!intake.vin) {
    missing.push({
      title: "VIN",
      detail: "Needed before ordering history reports or checking vehicle identity."
    });
  }

  if (intake.carfaxStatus !== "available") {
    missing.push({
      title: "Vehicle history report",
      detail: "Ask whether Carfax or equivalent history is available, then verify what it actually says."
    });
  }

  if (intake.inspectionAllowed === "unknown") {
    missing.push({
      title: "Inspection availability",
      detail: "Ask clearly if an independent mobile or garage inspection is allowed before purchase."
    });
  }

  missing.push(
    {
      title: "Maintenance records",
      detail: "Ask for oil change history, brake work, tire age, major repairs, and recent invoices."
    },
    {
      title: "Rust and underbody condition",
      detail: "Important in Quebec because winter road salt can make visual body condition misleading."
    },
    {
      title: "Reason for sale",
      detail: "A clear reason is not proof, but vague answers should lead to more verification."
    }
  );

  return missing;
}

function riskDriversFor(intake: VehicleIntake, redFlags: ReportFinding[]): string[] {
  const drivers = redFlags.map((flag) => flag.title);

  if (drivers.length < 3) {
    drivers.push(
      "Demo engine is using general buyer-risk rules only",
      "No paid history, pricing, or mechanical data is connected yet"
    );
  }

  return drivers.slice(0, 4);
}

export function generateDemoReport(
  intake: VehicleIntake,
  reportType: ReportPackage
): DemoBuyerReport {
  const score = calculateRiskScore(intake);
  const level = riskLevel(score);
  const finalRecommendation = recommendationFor(intake, level);
  const redFlags = buildRedFlags(intake);

  const commonProblems: ReportFinding[] = [
    {
      title: "Model-specific database is not connected in Phase 1",
      detail:
        "This demo uses a general used-car checklist. Future AI and model-data integrations should replace this with make, model, year, and trim-specific checks."
    },
    {
      title: "Quebec rust exposure",
      detail:
        "Verify rocker panels, wheel arches, brake lines, subframe areas, floor pans, and underbody condition before purchase."
    },
    {
      title: "High-mileage wear items",
      detail:
        "Ask an inspector to check brakes, suspension, wheel bearings, tires, fluids, leaks, exhaust, HVAC, and warning lights."
    }
  ];

  return {
    id: `demo-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    reportType,
    isDemo: true,
    vehicleTitle: vehicleTitle(intake),
    vehicleSummary: [
      { label: "Vehicle", value: vehicleTitle(intake) },
      { label: "Mileage", value: formatKilometers(intake.mileageKm) },
      { label: "Asking price", value: formatCurrencyCad(intake.askingPriceCad) },
      { label: "Location", value: `${intake.city}, QC` },
      { label: "Seller type", value: titleCaseStatus(intake.sellerType) },
      { label: "VIN", value: intake.vin || "Not provided" },
      { label: "Carfax", value: titleCaseStatus(intake.carfaxStatus) },
      { label: "Inspection allowed", value: titleCaseStatus(intake.inspectionAllowed) }
    ],
    firstImpression:
      "This Phase 1 demo report turns your submitted listing details into a structured buyer checklist. It flags missing information and visible listing risks, but it does not verify history, liens, mechanical condition, or market value.",
    riskScore: score,
    riskLevel: level,
    riskDrivers: riskDriversFor(intake, redFlags),
    priceCheck: [
      {
        title: "Price needs comparable-listing verification",
        detail: `${formatCurrencyCad(
          intake.askingPriceCad
        )} is the submitted asking price. Phase 1 does not connect live market data, so compare similar vehicles by year, mileage, trim, condition, and location.`
      },
      {
        title: "Use missing information as price pressure",
        detail:
          "If VIN, service records, accident history, inspection permission, or underbody photos are missing, avoid negotiating as if the car is already verified."
      }
    ],
    biggestRedFlags: redFlags,
    missingInformation: buildMissingInformation(intake),
    commonProblems,
    sellerQuestions: [
      "Can you send the VIN before I come see the car?",
      "Do you have maintenance records or recent repair invoices?",
      "Has the car ever been in an accident, rebuilt, used commercially, or imported from outside Quebec?",
      "Are there any warning lights, leaks, transmission issues, AC/heating problems, or rust areas I should know about?",
      "Would you allow an independent mobile or garage inspection before purchase?"
    ],
    inPersonChecks: [
      {
        title: "Cold start and dashboard",
        detail:
          "Start the car cold if possible. Check warning lights, idle quality, smoke, battery warnings, and whether the seller warmed it up before you arrived."
      },
      {
        title: "Rust-prone areas",
        detail:
          "Inspect rocker panels, wheel arches, doors, trunk edges, underbody, brake lines, and subframe areas with proper lighting."
      },
      {
        title: "Road test behavior",
        detail:
          "Listen for suspension noise, vibration, brake pulsing, transmission hesitation, steering pull, and drivetrain clunks."
      },
      {
        title: "Documents",
        detail:
          "Confirm seller identity, VIN consistency, registration situation, and whether the vehicle can be transferred through the correct Quebec process."
      }
    ],
    negotiationPoints: [
      {
        title: "Do not negotiate from hope",
        detail:
          "Use missing VIN/history/records as reasons to pause, not as reasons to gamble. Ask for documents before making a firm offer."
      },
      {
        title: "Conditional offer script",
        detail:
          "If the car checks out and inspection is allowed, offer subject to inspection results and clear documentation."
      },
      {
        title: "Inspection-based negotiation",
        detail:
          "If an inspector finds brakes, tires, leaks, rust, warning lights, or suspension work, use written findings to negotiate or walk away."
      }
    ],
    inspectionRecommendation:
      finalRecommendation === "Avoid"
        ? "Do not book an inspection unless the seller first resolves the major concern, especially inspection refusal or missing identity details."
        : "A mobile pre-purchase inspection is recommended before any final purchase decision, especially if the seller provides VIN, records, and agrees to inspection.",
    finalRecommendation,
    nextStep:
      finalRecommendation === "Avoid"
        ? "Ask for VIN, history, and inspection permission. If the seller refuses, move on to another listing."
        : "Send the seller questions, request missing documents, then book a mobile inspection if the answers are acceptable.",
    disclaimer: siteConfig.disclaimer
  };
}
