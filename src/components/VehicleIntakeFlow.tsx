"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  CarfaxStatus,
  InspectionAllowedStatus,
  MentionStatus,
  ReportPackage,
  SellerType,
  UploadedFileMeta,
  VehicleIntake
} from "@/types/domain";
import { formatFileSize } from "@/lib/format";
import { saveIntake, saveReportType } from "@/lib/localStorage";

interface FormState {
  listingUrl: string;
  listingText: string;
  make: string;
  model: string;
  year: string;
  trim: string;
  mileageKm: string;
  askingPriceCad: string;
  city: string;
  sellerType: SellerType;
  vin: string;
  accidentHistoryMentioned: MentionStatus;
  carfaxStatus: CarfaxStatus;
  inspectionAllowed: InspectionAllowedStatus;
  sellerDescription: string;
  photos: UploadedFileMeta[];
}

const initialForm: FormState = {
  listingUrl: "",
  listingText: "",
  make: "",
  model: "",
  year: "",
  trim: "",
  mileageKm: "",
  askingPriceCad: "",
  city: "Montreal",
  sellerType: "unknown",
  vin: "",
  accidentHistoryMentioned: "unknown",
  carfaxStatus: "unknown",
  inspectionAllowed: "unknown",
  sellerDescription: "",
  photos: []
};

function toNumber(value: string): number {
  return Number(value.replace(/[^\d.]/g, ""));
}

function toIntake(form: FormState): VehicleIntake {
  return {
    listingUrl: form.listingUrl.trim() || undefined,
    listingText: form.listingText.trim(),
    make: form.make.trim(),
    model: form.model.trim(),
    year: toNumber(form.year),
    trim: form.trim.trim() || undefined,
    mileageKm: toNumber(form.mileageKm),
    askingPriceCad: toNumber(form.askingPriceCad),
    city: form.city.trim(),
    sellerType: form.sellerType,
    vin: form.vin.trim() || undefined,
    accidentHistoryMentioned: form.accidentHistoryMentioned,
    carfaxStatus: form.carfaxStatus,
    inspectionAllowed: form.inspectionAllowed,
    sellerDescription: form.sellerDescription.trim(),
    photos: form.photos,
    preferredLanguage: "en",
    submittedAt: new Date().toISOString()
  };
}

export function VehicleIntakeFlow() {
  const router = useRouter();
  const [step, setStep] = useState<"intake" | "selection" | "demoCheckout">("intake");
  const [form, setForm] = useState<FormState>(initialForm);
  const [submittedIntake, setSubmittedIntake] = useState<VehicleIntake | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<ReportPackage>("full");

  const vehicleLabel = useMemo(() => {
    if (!form.make && !form.model && !form.year) return "your vehicle";
    return [form.year, form.make, form.model, form.trim].filter(Boolean).join(" ");
  }, [form.make, form.model, form.trim, form.year]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type || "unknown"
    }));

    updateField("photos", files);
  }

  function validate(): string[] {
    const validationErrors: string[] = [];

    if (!form.listingText.trim()) validationErrors.push("Paste the listing text or seller ad details.");
    if (!form.make.trim()) validationErrors.push("Enter the make.");
    if (!form.model.trim()) validationErrors.push("Enter the model.");
    if (!toNumber(form.year)) validationErrors.push("Enter the year.");
    if (!toNumber(form.mileageKm)) validationErrors.push("Enter the mileage.");
    if (!toNumber(form.askingPriceCad)) validationErrors.push("Enter the asking price.");
    if (!form.city.trim()) validationErrors.push("Enter the city.");

    return validationErrors;
  }

  function submitIntake(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (validationErrors.length > 0) return;

    const intake = toIntake(form);
    saveIntake(intake);
    setSubmittedIntake(intake);
    setStep("selection");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function continueToReport(reportType: ReportPackage) {
    const intake = submittedIntake ?? toIntake(form);
    saveIntake(intake);
    saveReportType(reportType);
    router.push(`/report?type=${reportType}`);
  }

  return (
    <div className="flow-layout">
      <aside className="flow-sidebar" aria-label="Progress">
        <p className="eyebrow">Phase 1 demo journey</p>
        <h2>Check a used car before you commit.</h2>
        <ol className="step-list">
          <li className={step === "intake" ? "active" : ""}>Enter listing details</li>
          <li className={step === "selection" ? "active" : ""}>Choose report type</li>
          <li className={step === "demoCheckout" ? "active" : ""}>Demo checkout</li>
          <li>View report</li>
          <li>Book inspection</li>
        </ol>
        <p className="fine-print">
          Uploads are local metadata only in Phase 1. No screenshots are sent to a server.
        </p>
      </aside>

      <main className="flow-main">
        {step === "intake" ? (
          <form className="form-panel" onSubmit={submitIntake}>
            <div className="form-head">
              <p className="eyebrow">Vehicle intake</p>
              <h1>Tell us about the listing.</h1>
              <p>
                Paste information from Facebook Marketplace, Kijiji, AutoTrader, dealer pages,
                or a private seller message. The app does not scrape marketplaces.
              </p>
            </div>

            {errors.length > 0 ? (
              <div className="form-errors" role="alert">
                <strong>Fix these items:</strong>
                <ul>
                  {errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <fieldset>
              <legend>Listing source</legend>
              <label>
                Listing URL optional
                <input
                  type="url"
                  value={form.listingUrl}
                  placeholder="https://..."
                  onChange={(event) => updateField("listingUrl", event.target.value)}
                />
              </label>
              <label>
                Listing text
                <textarea
                  value={form.listingText}
                  rows={8}
                  placeholder="Paste the full ad, seller notes, and anything important from the listing."
                  onChange={(event) => updateField("listingText", event.target.value)}
                />
              </label>
            </fieldset>

            <fieldset>
              <legend>Vehicle details</legend>
              <div className="form-grid">
                <label>
                  Make
                  <input
                    value={form.make}
                    placeholder="Toyota"
                    onChange={(event) => updateField("make", event.target.value)}
                  />
                </label>
                <label>
                  Model
                  <input
                    value={form.model}
                    placeholder="Corolla"
                    onChange={(event) => updateField("model", event.target.value)}
                  />
                </label>
                <label>
                  Year
                  <input
                    inputMode="numeric"
                    value={form.year}
                    placeholder="2018"
                    onChange={(event) => updateField("year", event.target.value)}
                  />
                </label>
                <label>
                  Trim optional
                  <input
                    value={form.trim}
                    placeholder="LE, EX, Touring..."
                    onChange={(event) => updateField("trim", event.target.value)}
                  />
                </label>
                <label>
                  Mileage
                  <input
                    inputMode="numeric"
                    value={form.mileageKm}
                    placeholder="145000"
                    onChange={(event) => updateField("mileageKm", event.target.value)}
                  />
                </label>
                <label>
                  Asking price CAD
                  <input
                    inputMode="numeric"
                    value={form.askingPriceCad}
                    placeholder="12900"
                    onChange={(event) => updateField("askingPriceCad", event.target.value)}
                  />
                </label>
                <label>
                  City
                  <input
                    value={form.city}
                    placeholder="Montreal"
                    onChange={(event) => updateField("city", event.target.value)}
                  />
                </label>
                <label>
                  VIN optional
                  <input
                    value={form.vin}
                    placeholder="Ask the seller if missing"
                    onChange={(event) => updateField("vin", event.target.value.toUpperCase())}
                  />
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend>Seller and history signals</legend>
              <div className="form-grid">
                <label>
                  Seller type
                  <select
                    value={form.sellerType}
                    onChange={(event) => updateField("sellerType", event.target.value as SellerType)}
                  >
                    <option value="unknown">Unknown</option>
                    <option value="private">Private seller</option>
                    <option value="dealer">Dealer</option>
                  </select>
                </label>
                <label>
                  Accident history mentioned
                  <select
                    value={form.accidentHistoryMentioned}
                    onChange={(event) =>
                      updateField("accidentHistoryMentioned", event.target.value as MentionStatus)
                    }
                  >
                    <option value="unknown">Unknown</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <label>
                  Carfax mentioned/available
                  <select
                    value={form.carfaxStatus}
                    onChange={(event) => updateField("carfaxStatus", event.target.value as CarfaxStatus)}
                  >
                    <option value="unknown">Unknown</option>
                    <option value="available">Available</option>
                    <option value="not_available">Not available</option>
                  </select>
                </label>
                <label>
                  Inspection allowed
                  <select
                    value={form.inspectionAllowed}
                    onChange={(event) =>
                      updateField("inspectionAllowed", event.target.value as InspectionAllowedStatus)
                    }
                  >
                    <option value="unknown">Unknown</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
              </div>
              <label>
                Seller description or your concerns
                <textarea
                  value={form.sellerDescription}
                  rows={5}
                  placeholder="Example: seller says no rust, needs brakes, no Carfax, leaving Quebec, dealer says sold as-is..."
                  onChange={(event) => updateField("sellerDescription", event.target.value)}
                />
              </label>
            </fieldset>

            <fieldset>
              <legend>Screenshots/photos</legend>
              <label className="upload-zone">
                <span>Upload listing screenshots or car photos</span>
                <input type="file" accept="image/*" multiple onChange={handleFiles} />
              </label>
              {form.photos.length > 0 ? (
                <div className="file-list">
                  {form.photos.map((photo) => (
                    <span key={`${photo.name}-${photo.size}`}>
                      {photo.name} ({formatFileSize(photo.size)})
                    </span>
                  ))}
                </div>
              ) : null}
            </fieldset>

            <div className="form-actions">
              <button className="button button-primary" type="submit">
                Continue to Report Options
              </button>
            </div>
          </form>
        ) : null}

        {step === "selection" ? (
          <section className="selection-panel">
            <p className="eyebrow">Report options</p>
            <h1>Choose how to screen {vehicleLabel}.</h1>
            <div className="pricing-grid">
              <article className="comparison-card">
                <div>
                  <p className="eyebrow">Lead check</p>
                  <h2>Free Quick Check</h2>
                  <p>Fast snapshot for early filtering.</p>
                </div>
                <strong className="price">$0</strong>
                <ul>
                  <li>Basic risk level</li>
                  <li>3 red flags</li>
                  <li>3 seller questions</li>
                  <li>Basic recommendation</li>
                </ul>
                <button className="button button-secondary" onClick={() => continueToReport("free")} type="button">
                  Generate Free Demo
                </button>
              </article>

              <article className="comparison-card highlighted">
                <div>
                  <p className="eyebrow">Buyer report</p>
                  <h2>Full Buyer Report</h2>
                  <p>Complete pre-screen before seeing, negotiating, or inspecting.</p>
                </div>
                <strong className="price">$19.99 CAD</strong>
                <ul>
                  <li>Vehicle summary and risk score</li>
                  <li>Price logic and missing information</li>
                  <li>Common issue checklist</li>
                  <li>Seller questions and negotiation points</li>
                  <li>Inspection recommendation and next step</li>
                </ul>
                <button
                  className="button button-primary"
                  onClick={() => {
                    setSelectedPackage("full");
                    setStep("demoCheckout");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  type="button"
                >
                  Continue to Demo Checkout
                </button>
              </article>
            </div>
          </section>
        ) : null}

        {step === "demoCheckout" ? (
          <section className="checkout-panel">
            <p className="eyebrow">Development checkout</p>
            <h1>Full Buyer Report demo</h1>
            <p>
              Stripe is intentionally not connected in Phase 1. This screen marks the future paid
              checkout step without collecting payment or card details.
            </p>
            <div className="checkout-summary">
              <span>Selected package</span>
              <strong>Full Buyer Report - $19.99 CAD</strong>
              <span>Vehicle</span>
              <strong>{vehicleLabel}</strong>
            </div>
            <div className="button-row">
              <button className="button button-primary" onClick={() => continueToReport(selectedPackage)} type="button">
                Generate Full Demo Report
              </button>
              <button className="button button-ghost" onClick={() => setStep("selection")} type="button">
                Back to Options
              </button>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
