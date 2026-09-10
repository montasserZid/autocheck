"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { demoVehicleIntake } from "@/lib/mockData";
import { getStoredIntake, getStoredReport, saveInspectionRequest } from "@/lib/localStorage";
import type { InspectionRequest, Urgency } from "@/types/domain";

interface BookingFormState {
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  vehicleTitle: string;
  vehicleVin: string;
  sellerContact: string;
  vehicleAddress: string;
  preferredDate: string;
  preferredTime: string;
  urgency: Urgency;
  notes: string;
}

const initialBooking: BookingFormState = {
  buyerName: "",
  buyerPhone: "",
  buyerEmail: "",
  vehicleTitle: "",
  vehicleVin: "",
  sellerContact: "",
  vehicleAddress: "",
  preferredDate: "",
  preferredTime: "",
  urgency: "24_48_hours",
  notes: ""
};

export function InspectionBookingForm() {
  const router = useRouter();
  const [form, setForm] = useState<BookingFormState>(initialBooking);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const intake = getStoredIntake() ?? demoVehicleIntake;
    const report = getStoredReport();

    setForm((current) => ({
      ...current,
      vehicleTitle: report?.vehicleTitle ?? [intake.year, intake.make, intake.model, intake.trim].filter(Boolean).join(" "),
      vehicleVin: intake.vin ?? "",
      vehicleAddress: intake.city ? `${intake.city}, QC` : ""
    }));
  }, []);

  function updateField<K extends keyof BookingFormState>(key: K, value: BookingFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validate(): string[] {
    const validationErrors: string[] = [];

    if (!form.buyerName.trim()) validationErrors.push("Enter your name.");
    if (!form.buyerPhone.trim()) validationErrors.push("Enter your phone number.");
    if (!form.buyerEmail.trim()) validationErrors.push("Enter your email.");
    if (!form.vehicleTitle.trim()) validationErrors.push("Enter the vehicle.");
    if (!form.sellerContact.trim()) validationErrors.push("Enter seller contact information.");
    if (!form.vehicleAddress.trim()) validationErrors.push("Enter the vehicle location.");
    if (!form.preferredDate.trim()) validationErrors.push("Choose a preferred date.");
    if (!form.preferredTime.trim()) validationErrors.push("Choose a preferred time.");

    return validationErrors;
  }

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (validationErrors.length > 0) return;

    const report = getStoredReport();
    const request: InspectionRequest = {
      id: `inspection-demo-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      buyerName: form.buyerName.trim(),
      buyerPhone: form.buyerPhone.trim(),
      buyerEmail: form.buyerEmail.trim(),
      vehicleTitle: form.vehicleTitle.trim(),
      vehicleVin: form.vehicleVin.trim() || undefined,
      sellerContact: form.sellerContact.trim(),
      vehicleAddress: form.vehicleAddress.trim(),
      preferredDate: form.preferredDate,
      preferredTime: form.preferredTime,
      urgency: form.urgency,
      notes: form.notes.trim(),
      reportId: report?.id
    };

    saveInspectionRequest(request);
    router.push("/inspection/confirmation");
  }

  return (
    <form className="form-panel" onSubmit={submitBooking}>
      <div className="form-head">
        <p className="eyebrow">Mobile inspection request</p>
        <h1>Request a mobile inspection.</h1>
        <p>
          Phase 1 stores this request locally and shows a confirmation. Partner dispatch, email,
          SMS, and payment are future integrations.
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
        <legend>Buyer information</legend>
        <div className="form-grid">
          <label>
            Full name
            <input value={form.buyerName} onChange={(event) => updateField("buyerName", event.target.value)} />
          </label>
          <label>
            Phone
            <input
              inputMode="tel"
              value={form.buyerPhone}
              onChange={(event) => updateField("buyerPhone", event.target.value)}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.buyerEmail}
              onChange={(event) => updateField("buyerEmail", event.target.value)}
            />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Vehicle information</legend>
        <div className="form-grid">
          <label>
            Vehicle
            <input value={form.vehicleTitle} onChange={(event) => updateField("vehicleTitle", event.target.value)} />
          </label>
          <label>
            VIN if available
            <input
              value={form.vehicleVin}
              onChange={(event) => updateField("vehicleVin", event.target.value.toUpperCase())}
            />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Seller and location</legend>
        <label>
          Seller contact
          <input
            value={form.sellerContact}
            placeholder="Name, phone, email, or Marketplace profile"
            onChange={(event) => updateField("sellerContact", event.target.value)}
          />
        </label>
        <label>
          Vehicle location
          <input
            value={form.vehicleAddress}
            placeholder="Street, area, or city"
            onChange={(event) => updateField("vehicleAddress", event.target.value)}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Timing</legend>
        <div className="form-grid">
          <label>
            Preferred date
            <input
              type="date"
              value={form.preferredDate}
              onChange={(event) => updateField("preferredDate", event.target.value)}
            />
          </label>
          <label>
            Preferred time
            <input
              type="time"
              value={form.preferredTime}
              onChange={(event) => updateField("preferredTime", event.target.value)}
            />
          </label>
          <label>
            Urgency
            <select value={form.urgency} onChange={(event) => updateField("urgency", event.target.value as Urgency)}>
              <option value="today">Today</option>
              <option value="24_48_hours">24-48 hours</option>
              <option value="this_week">This week</option>
              <option value="flexible">Flexible</option>
            </select>
          </label>
        </div>
        <label>
          Notes
          <textarea
            rows={5}
            value={form.notes}
            placeholder="Anything the inspector should know: seller availability, parking, symptoms, warning lights, or urgent concerns."
            onChange={(event) => updateField("notes", event.target.value)}
          />
        </label>
      </fieldset>

      <div className="form-actions">
        <button className="button button-primary" type="submit">
          Submit Inspection Request
        </button>
      </div>
    </form>
  );
}
