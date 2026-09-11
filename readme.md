# AutoCheck QC

AutoCheck QC is a Phase 1 frontend prototype for used-car listing pre-screening and mobile inspection requests in Quebec. It helps a buyer turn a marketplace ad into a structured checklist of red flags, missing information, seller questions, negotiation points and inspection focus areas.

This repository is intentionally frontend/local only. It does not connect to production AI, payments, scraping, OCR, email, SMS, authentication, databases or inspection dispatch services.

## Stack

- Next.js App Router
- React
- TypeScript
- Plain CSS in `src/app/globals.css`
- Browser `localStorage` for local Phase 1 persistence
- Local listing extraction in `src/lib/listingExtraction.ts`
- Local report generation in `src/lib/reportEngine.ts`
- Static model checklist data in `src/lib/vehicleKnowledge.ts`

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Default local URL:

```text
http://localhost:3000
```

## Quality Commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm test` compiles the focused Node test suite and runs extraction, report logic, validation and local-storage behavior tests.

## Project Structure

```text
src/app/                  Route pages and global CSS
src/components/           Reusable UI and flow components
src/content/              Public copy shared by routes/components
src/lib/                  Extraction, report logic, vehicle data, persistence helpers
src/types/                Domain types for intake, reports and inspection requests
tests/                    Focused Node tests for Phase 1 logic
public/images/            Project visual assets
output/playwright/        Browser test artifacts and screenshots
```

## Phase 1 Implements

- Premium public homepage for Quebec used-car buyers.
- Ad-first intake flow with listing URL, pasted listing text, screenshot/photo metadata and manual-entry fallback.
- Conservative local extraction for common listing patterns.
- Editable vehicle review step with found, missing and needs-confirmation states.
- Free Quick Check and Full Buyer Report preview selection.
- Decision-focused report experience with risk scoring, seller questions, missing information, negotiation points, inspection focus list and final recommendation.
- Static verification checklists for Honda Civic, Toyota Corolla, Mazda3, Honda CR-V, Toyota RAV4, Hyundai Elantra, Honda Odyssey, Toyota Sienna and Nissan Rogue.
- Pricing, FAQ, example report, mobile inspection request, confirmation, contact, privacy, terms and 404 pages.
- Local-only contact/request persistence with deletion controls.
- English UI. French listing phrases are partially recognized by the extractor, but French navigation/reports are not implemented in Phase 1.

## Mocked or Excluded

- Real AI report generation
- Real marketplace scraping
- Production OCR/image analysis
- Vehicle history, Carfax, RDPRM or SAAQ API checks
- Market pricing APIs
- Production file uploads
- Stripe/payment collection
- Email/SMS delivery
- Database persistence
- Authentication/accounts
- Inspector marketplace or partner dispatch
- Production analytics

## Phase 2 Readiness

The Phase 1 frontend now has the right product flow and service boundaries for backend integration. The next phase should connect persistence, production report generation, payments and messaging behind the existing domain/service interfaces without changing the core buyer journey.
