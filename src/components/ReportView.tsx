import Link from "next/link";
import type { DemoBuyerReport } from "@/types/domain";
import { ButtonLink } from "./ButtonLink";
import { RecommendationBadge } from "./RecommendationBadge";

interface ReportViewProps {
  report: DemoBuyerReport;
}

function FindingList({ items }: { items: { title: string; detail: string }[] }) {
  return (
    <div className="finding-list">
      {items.map((item) => (
        <article className="finding-item" key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.detail}</p>
        </article>
      ))}
    </div>
  );
}

function QuestionList({ items }: { items: string[] }) {
  return (
    <ol className="question-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  );
}

export function ReportView({ report }: ReportViewProps) {
  const isFree = report.reportType === "free";

  return (
    <article className="report-shell">
      <div className="report-banner">
        <div>
          <p className="eyebrow">Demo report</p>
          <h1>{report.vehicleTitle}</h1>
          <p>
            This is generated from Phase 1 mock logic and local form data. No paid vehicle
            history, pricing, lien, or mechanical database is connected.
          </p>
        </div>
        <RecommendationBadge recommendation={report.finalRecommendation} riskLevel={report.riskLevel} />
      </div>

      <section className="report-section" id="vehicle-summary">
        <div className="report-section-heading">
          <span>1</span>
          <h2>Vehicle Summary</h2>
        </div>
        <dl className="summary-grid">
          {report.vehicleSummary.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="report-section" id="first-impression">
        <div className="report-section-heading">
          <span>2</span>
          <h2>First Impression</h2>
        </div>
        <p>{report.firstImpression}</p>
      </section>

      <section className="report-section" id="risk-score">
        <div className="report-section-heading">
          <span>3</span>
          <h2>Risk Score</h2>
        </div>
        <div className="risk-layout">
          <div className="risk-meter" aria-label={`Risk score ${report.riskScore} out of 100`}>
            <strong>{report.riskScore}</strong>
            <span>/100</span>
          </div>
          <div>
            <RecommendationBadge recommendation={report.finalRecommendation} riskLevel={report.riskLevel} />
            <ul className="compact-list">
              {report.riskDrivers.map((driver) => (
                <li key={driver}>{driver}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {isFree ? (
        <section className="report-section upgrade-section" id="free-report-limit">
          <div className="report-section-heading">
            <span>4</span>
            <h2>Free Quick Check Limit</h2>
          </div>
          <p>
            Free Quick Check includes the risk level, 3 red flags, 3 seller questions, and a
            basic recommendation. Continue with the demo Full Buyer Report to preview the full
            report structure.
          </p>
          <Link className="button button-secondary" href="/check">
            Generate Full Demo Report
          </Link>
        </section>
      ) : null}

      <section className="report-section" id="price-check">
        <div className="report-section-heading">
          <span>4</span>
          <h2>Price Check</h2>
        </div>
        <FindingList items={isFree ? report.priceCheck.slice(0, 1) : report.priceCheck} />
      </section>

      <section className="report-section" id="biggest-red-flags">
        <div className="report-section-heading">
          <span>5</span>
          <h2>Biggest Red Flags</h2>
        </div>
        <FindingList items={isFree ? report.biggestRedFlags.slice(0, 3) : report.biggestRedFlags} />
      </section>

      {!isFree ? (
        <>
          <section className="report-section" id="missing-information">
            <div className="report-section-heading">
              <span>6</span>
              <h2>Missing Information</h2>
            </div>
            <FindingList items={report.missingInformation} />
          </section>

          <section className="report-section" id="common-problems">
            <div className="report-section-heading">
              <span>7</span>
              <h2>Common Problems for This Model</h2>
            </div>
            <FindingList items={report.commonProblems} />
          </section>
        </>
      ) : null}

      <section className="report-section" id="seller-questions">
        <div className="report-section-heading">
          <span>{isFree ? "6" : "8"}</span>
          <h2>Questions to Ask the Seller</h2>
        </div>
        <QuestionList items={isFree ? report.sellerQuestions.slice(0, 3) : report.sellerQuestions} />
      </section>

      {!isFree ? (
        <>
          <section className="report-section" id="in-person-checks">
            <div className="report-section-heading">
              <span>9</span>
              <h2>What to Check in Person</h2>
            </div>
            <FindingList items={report.inPersonChecks} />
          </section>

          <section className="report-section" id="negotiation-points">
            <div className="report-section-heading">
              <span>10</span>
              <h2>Negotiation Points</h2>
            </div>
            <FindingList items={report.negotiationPoints} />
          </section>
        </>
      ) : null}

      <section className="report-section" id="inspection-recommendation">
        <div className="report-section-heading">
          <span>{isFree ? "7" : "11"}</span>
          <h2>Inspection Recommendation</h2>
        </div>
        <p>{report.inspectionRecommendation}</p>
      </section>

      <section className="report-section" id="final-recommendation">
        <div className="report-section-heading">
          <span>{isFree ? "8" : "12"}</span>
          <h2>Final Recommendation</h2>
        </div>
        <RecommendationBadge recommendation={report.finalRecommendation} />
      </section>

      <section className="report-section cta-section" id="next-step">
        <div className="report-section-heading">
          <span>{isFree ? "9" : "13"}</span>
          <h2>Next Step</h2>
        </div>
        <p>{report.nextStep}</p>
        <div className="button-row">
          <ButtonLink href="/inspection" variant="primary">
            Book a Mobile Inspection
          </ButtonLink>
          <ButtonLink href="/check" variant="secondary">
            Check Another Car
          </ButtonLink>
        </div>
      </section>

      <section className="report-disclaimer">
        <strong>Important:</strong> {report.disclaimer}
      </section>
    </article>
  );
}
