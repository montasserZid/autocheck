"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredInspectionRequest } from "@/lib/localStorage";
import type { InspectionRequest } from "@/types/domain";
import { titleCaseStatus } from "@/lib/format";

export function ConfirmationDetails() {
  const [request, setRequest] = useState<InspectionRequest | null>(null);

  useEffect(() => {
    setRequest(getStoredInspectionRequest());
  }, []);

  if (!request) {
    return (
      <section className="confirmation-panel">
        <p className="eyebrow">No local request found</p>
        <h1>Inspection request confirmation</h1>
        <p>
          This Phase 1 confirmation reads from local browser storage. Submit the booking form to
          preview the full confirmation state.
        </p>
        <Link className="button button-primary" href="/inspection">
          Book an Inspection
        </Link>
      </section>
    );
  }

  return (
    <section className="confirmation-panel">
      <p className="eyebrow">Request received</p>
      <h1>Your mobile inspection request is ready for dispatch.</h1>
      <p>
        In production, AutoCheck QC would confirm availability with a partner inspector and send
        the booking details by email or SMS. Phase 1 stores this request locally only.
      </p>

      <dl className="summary-grid">
        <div>
          <dt>Request ID</dt>
          <dd>{request.id}</dd>
        </div>
        <div>
          <dt>Buyer</dt>
          <dd>{request.buyerName}</dd>
        </div>
        <div>
          <dt>Vehicle</dt>
          <dd>{request.vehicleTitle}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{request.vehicleAddress}</dd>
        </div>
        <div>
          <dt>Preferred time</dt>
          <dd>
            {request.preferredDate} at {request.preferredTime}
          </dd>
        </div>
        <div>
          <dt>Urgency</dt>
          <dd>{titleCaseStatus(request.urgency)}</dd>
        </div>
      </dl>

      <div className="button-row">
        <Link className="button button-primary" href="/check">
          Check Another Car
        </Link>
        <Link className="button button-secondary" href="/">
          Back Home
        </Link>
      </div>
    </section>
  );
}
