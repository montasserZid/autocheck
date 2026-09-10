import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { ReportView } from "@/components/ReportView";
import { SectionHeading } from "@/components/SectionHeading";
import { homeCopy, platformLabels, siteConfig } from "@/content/site";
import { demoVehicleIntake, faqItems } from "@/lib/mockData";
import { generateDemoReport } from "@/lib/reportEngine";

const report = generateDemoReport(demoVehicleIntake, "full");

const reportChecks = [
  "visible listing red flags",
  "missing VIN, history, and inspection details",
  "price logic to verify with comparable listings",
  "seller questions before you visit",
  "common inspection areas for Quebec conditions",
  "negotiation points and next-step recommendation"
];

export default function Home() {
  const copy = homeCopy.en;

  return (
    <main>
      <section className="hero">
        <Container className="hero-content">
          <p className="eyebrow">Montreal and Quebec used-car buyer protection</p>
          <h1>{copy.heroTitle}</h1>
          <p>{copy.heroSubtitle}</p>
          <div className="button-row">
            <ButtonLink href="/check" variant="primary">
              {copy.primaryCta}
            </ButtonLink>
            <ButtonLink href="/inspection" variant="secondary">
              {copy.secondaryCta}
            </ButtonLink>
          </div>
          <div className="platform-strip" aria-label="Supported listing sources">
            {platformLabels.map((platform) => (
              <span key={platform}>{platform}</span>
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="A clear decision path before you waste a trip."
            body="AutoCheck QC helps you screen the listing first, then move to a professional inspection only when the car looks worth it."
            align="center"
          />
          <div className="process-grid">
            {[
              ["1", "Paste the ad", "Add listing text, vehicle details, seller notes, and screenshots."],
              ["2", "Get a report", "See risk level, red flags, missing information, and seller questions."],
              ["3", "Choose the next step", "Avoid, ask more questions, go see it, or book a mobile inspection."]
            ].map(([number, title, body]) => (
              <article className="process-card" key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section band">
        <Container className="two-column">
          <div>
            <SectionHeading
              eyebrow="Report checks"
              title="Built around real buyer questions."
              body="The report is designed for shoppers comparing Facebook Marketplace, Kijiji, AutoTrader, dealer, and private-sale listings."
            />
            <ul className="check-list">
              {reportChecks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="warning-panel">
            <p className="eyebrow">Still inspect before buying</p>
            <h3>A pre-screen is not a mechanical inspection.</h3>
            <p>{siteConfig.disclaimer}</p>
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionHeading
            eyebrow="Free vs full"
            title="Start small, upgrade when the car deserves attention."
            align="center"
          />
          <div className="pricing-grid">
            <article className="comparison-card">
              <p className="eyebrow">Free Quick Check</p>
              <h3>Good for early filtering.</h3>
              <strong className="price">$0</strong>
              <ul>
                <li>Basic risk level</li>
                <li>3 red flags</li>
                <li>3 seller questions</li>
                <li>Basic recommendation</li>
              </ul>
              <ButtonLink href="/check" variant="secondary">
                Start Free Check
              </ButtonLink>
            </article>
            <article className="comparison-card highlighted">
              <p className="eyebrow">Full Buyer Report</p>
              <h3>Best before visiting or negotiating.</h3>
              <strong className="price">$19.99 CAD</strong>
              <ul>
                <li>Complete report structure</li>
                <li>Price logic and missing information</li>
                <li>Inspection checklist</li>
                <li>Negotiation script and next step</li>
              </ul>
              <ButtonLink href="/check" variant="primary">
                Preview Full Flow
              </ButtonLink>
            </article>
          </div>
        </Container>
      </section>

      <section className="section band">
        <Container>
          <SectionHeading
            eyebrow="Example report preview"
            title="Professional report format, demo data."
            body="Phase 1 uses a mock report engine so the customer journey is clickable without paid APIs."
            align="center"
          />
          <div className="report-preview-shell">
            <ReportView report={report} />
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionHeading eyebrow="FAQ" title="Common buyer questions" align="center" />
          <div className="faq-grid">
            {faqItems.map((item) => (
              <article className="faq-item" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section final-cta">
        <Container>
          <p className="eyebrow">Start with the listing in front of you</p>
          <h2>Check the red flags before you pay, travel, negotiate, or inspect.</h2>
          <div className="button-row center">
            <ButtonLink href="/check" variant="primary">
              Check This Car
            </ButtonLink>
            <Link className="button button-secondary" href="/example-report">
              See Example Report
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
