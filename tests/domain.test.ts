import { test } from "node:test";
import assert from "node:assert/strict";
import { emptyIntake, extractListing } from "../src/lib/listingExtraction";
import { generateDemoReport } from "../src/lib/reportEngine";
import {
  getVehicleChecklist,
  vehicleKnowledge,
} from "../src/lib/vehicleKnowledge";
import {
  validListingUrl,
  validVin,
  validateIntake,
  validatePhotos,
  validateBooking,
} from "../src/lib/validation";
import { demoVehicleIntake } from "../src/lib/mockData";
import { readLocal, writeLocal, clearLocalData } from "../src/lib/localStorage";

test("extracts full English ad without requiring duplicate entry", () => {
  const { details } = extractListing(
    "2015 Honda Civic EX. 165,000 km. $8,500. Montreal. Private seller. VIN: 2HGFB2F50FH123456. Carfax available. No accidents. Not rebuilt. Inspection welcome. Maintenance records available.",
  );
  assert.deepEqual(details, {
    make: "Honda",
    model: "Civic",
    year: 2015,
    trim: "EX",
    mileageKm: 165000,
    askingPriceCad: 8500,
    city: "Montreal",
    vin: "2HGFB2F50FH123456",
    sellerType: "private",
    accidentHistoryMentioned: "no",
    rebuiltStatus: "no",
    inspectionAllowed: "yes",
    maintenanceRecords: "yes",
    carfaxStatus: "available",
  });
});
for (const ad of [
  "Honda Civic 2015, 165000km, 8 500$, Montréal",
  "2015 Honda Civic, 165 000 km, $8,500, Montreal",
  "2015 Honda Civic, 165\u202f000 km, 8\u00a0500$, Montreal",
])
  test(`numeric format: ${ad}`, () => {
    const d = extractListing(ad).details;
    assert.equal(d.year, 2015);
    assert.equal(d.mileageKm, 165000);
    assert.equal(d.askingPriceCad, 8500);
    assert.equal(d.city, "Montreal");
  });
for (const city of ["Laval", "Longueuil", "Brossard"])
  test(`city ${city}`, () =>
    assert.equal(extractListing(city).details.city, city));
test("common French claims", () => {
  const d = extractListing(
    "Toyota Corolla 2016. 150000km. 9 000$. Particulier. Carfax disponible. Aucun accident. Inspection acceptée. Factures disponibles.",
  ).details;
  assert.equal(d.accidentHistoryMentioned, "no");
  assert.equal(d.inspectionAllowed, "yes");
  assert.equal(d.maintenanceRecords, "yes");
  assert.equal(d.carfaxStatus, "available");
});
test("unknown facts remain unknown; partial VIN is not trusted", () => {
  const d = extractListing("2015 Honda Civic, VIN: 2HG...");
  assert.equal(d.details.vin, undefined);
  assert.ok(d.uncertain.includes("vin"));
  assert.equal(d.details.mileageKm, undefined);
  assert.equal(d.details.askingPriceCad, undefined);
  assert.equal(d.details.carfaxStatus, undefined);
});
test("ambiguous price, model and mileage are not guessed", () => {
  const r = extractListing(
    "2015 Honda Civic or Toyota Corolla. $8,500 or $9,000. 150000km or 160000km.",
  );
  assert.equal(r.details.model, undefined);
  assert.equal(r.details.askingPriceCad, undefined);
  assert.equal(r.details.mileageKm, undefined);
});
test("conflicting and qualified history is unknown", () => {
  for (const t of [
    "No accidents. Accident repaired.",
    "No known accidents",
    "No major accidents",
    "Accident history unknown",
  ])
    assert.equal(
      extractListing(t).details.accidentHistoryMentioned,
      undefined,
      t,
    );
});
test("negative claims and inspection refusal are recognized", () => {
  const d = extractListing(
    "No Carfax. No service records. Inspection refused. Never had an accident. Not rebuilt.",
  ).details;
  assert.equal(d.carfaxStatus, "not_available");
  assert.equal(d.maintenanceRecords, "no");
  assert.equal(d.inspectionAllowed, "no");
  assert.equal(d.accidentHistoryMentioned, "no");
  assert.equal(d.rebuiltStatus, "no");
});
test("decimal price and monthly financing", () => {
  assert.equal(extractListing("$8,500.50").details.askingPriceCad, 8500.5);
  assert.equal(extractListing("$299/month").details.askingPriceCad, undefined);
  assert.equal(extractListing("-100km. -8500$").details.mileageKm, undefined);
  assert.equal(
    extractListing("-100km. -8500$").details.askingPriceCad,
    undefined,
  );
});
test("unsupported model uses general checklist without inventing a model", () => {
  const d = extractListing("2019 Volvo XC40, 80000km").details;
  assert.equal(d.make, "Volvo");
  assert.equal(d.model, undefined);
  assert.match(
    getVehicleChecklist({ ...emptyIntake, make: "Volvo", model: "XC40" })[0]
      .title,
    /General/,
  );
});
test("all nine models have dedicated verification checklists", () => {
  assert.equal(vehicleKnowledge.length, 9);
  for (const v of vehicleKnowledge) {
    const checks = getVehicleChecklist({
      ...emptyIntake,
      make: v.make,
      model: v.model,
    });
    assert.equal(checks.length, 6);
    assert.ok(!checks[0].title.includes("General"));
  }
});
test("missing information never becomes a zero price or an automatic avoid", () => {
  const r = generateDemoReport(
    { ...emptyIntake, make: "Honda", model: "Civic" },
    "full",
  );
  assert.equal(r.riskLevel, "Unknown");
  assert.equal(r.finalRecommendation, "Ask more questions");
  assert.equal(
    r.vehicleSummary.find((v) => v.label === "Mileage")?.value,
    "Not provided",
  );
  assert.ok(!r.priceCheck[0].title.includes("$0"));
});
test("inspection refusal dominates recommendation and cannot suggest booking first", () => {
  const r = generateDemoReport(
    { ...demoVehicleIntake, inspectionAllowed: "no" },
    "full",
  );
  assert.equal(r.finalRecommendation, "Avoid");
  assert.match(r.topConcern, /refuses/);
  assert.match(r.inspectionRecommendation, /Not while/);
});
test("reported rebuilt status is actionable, not a confirmed defect", () => {
  const r = generateDemoReport(
    { ...demoVehicleIntake, rebuiltStatus: "yes" },
    "full",
  );
  assert.equal(r.finalRecommendation, "Ask more questions");
  assert.ok(r.biggestRedFlags.some((f) => /Rebuilt/.test(f.title)));
  assert.match(r.biggestRedFlags[0].detail, /not been verified/);
});
test("complete seller claims still lead to inspection, never a guarantee", () => {
  const r = generateDemoReport(
    {
      ...demoVehicleIntake,
      mileageKm: 80000,
      vin: "2HGFB2F50FH123456",
      carfaxStatus: "available",
      maintenanceRecords: "yes",
      rebuiltStatus: "no",
      accidentHistoryMentioned: "no",
    },
    "full",
  );
  assert.equal(r.riskLevel, "Low");
  assert.equal(r.finalRecommendation, "Worth professional inspection");
  assert.equal(r.missingInformation.length, 0);
});
test("attachments cannot improve risk without image analysis", () => {
  const a = generateDemoReport(demoVehicleIntake, "full");
  const b = generateDemoReport(
    {
      ...demoVehicleIntake,
      photos: [{ name: "photo.jpg", type: "image/jpeg", size: 100 }],
    },
    "full",
  );
  assert.equal(a.riskScore, b.riskScore);
});
test("scores are explained and capped; free/full recommendations agree", () => {
  const a = generateDemoReport(
    {
      ...emptyIntake,
      make: "Honda",
      model: "Civic",
      inspectionAllowed: "no",
      rebuiltStatus: "yes",
      accidentHistoryMentioned: "yes",
    },
    "free",
  );
  assert.equal(
    a.riskScore,
    Math.min(
      100,
      a.riskContributions.reduce((s, c) => s + c.points, 0),
    ),
  );
  assert.equal(
    generateDemoReport(demoVehicleIntake, "free").finalRecommendation,
    generateDemoReport(demoVehicleIntake, "full").finalRecommendation,
  );
});
test("review validation permits unknowns and real zero mileage but rejects invalid data", () => {
  assert.deepEqual(
    validateIntake({
      ...emptyIntake,
      make: "Honda",
      model: "Civic",
      mileageKm: 0,
    }),
    {},
  );
  const e = validateIntake({
    ...emptyIntake,
    year: 1000,
    mileageKm: -1,
    askingPriceCad: -20,
    vin: "bad",
  });
  for (const key of [
    "make",
    "model",
    "year",
    "mileageKm",
    "askingPriceCad",
    "vin",
  ])
    assert.ok(e[key]);
});
test("URL and VIN validation", () => {
  assert.ok(validListingUrl("https://www.kijiji.ca/v-cars/trial"));
  assert.ok(!validListingUrl("javascript:alert(1)"));
  assert.ok(!validListingUrl("not a link"));
  assert.ok(!validListingUrl("https://user:pass@example.com"));
  assert.ok(validVin("2HGFB2F50FH123456"));
  assert.ok(!validVin("2HGIB2F50FH123456"));
});
test("image metadata validation", () => {
  assert.equal(
    validatePhotos([{ name: "a.jpg", type: "image/jpeg", size: 100 }]),
    null,
  );
  assert.ok(
    validatePhotos([{ name: "a.svg", type: "image/svg+xml", size: 100 }]),
  );
  assert.ok(
    validatePhotos([{ name: "a.png", type: "image/png", size: 11000000 }]),
  );
});
test("booking rejects past times, malformed dates and invalid contacts", () => {
  const now = new Date("2026-09-10T12:00:00");
  const valid = {
    buyerName: "Alex",
    buyerPhone: "514-555-0198",
    buyerEmail: "alex@example.com",
    vehicleTitle: "Honda Civic",
    vehicleVin: "",
    sellerContact: "Seller",
    vehicleAddress: "Laval",
    preferredDate: "2026-09-11",
    preferredTime: "14:30",
  };
  assert.deepEqual(validateBooking(valid, now), []);
  assert.ok(
    validateBooking({ ...valid, preferredDate: "2026-09-09" }, now).length,
  );
  assert.ok(
    validateBooking({ ...valid, preferredDate: "2026-02-30" }, now).length,
  );
  assert.ok(
    validateBooking(
      { ...valid, buyerPhone: "abc", buyerEmail: "x", vehicleVin: "bad" },
      now,
    ).length >= 3,
  );
});
test("storage denial is handled without crashing", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      get localStorage() {
        throw new Error("blocked");
      },
    },
  });
  try {
    assert.equal(writeLocal("test", { saved: true }), false);
    assert.deepEqual(readLocal("test"), { saved: true });
    assert.equal(clearLocalData(), false);
  } finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
