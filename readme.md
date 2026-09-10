# AutoCheck QC

AutoCheck QC is an AI-assisted used-car pre-screening and inspection-booking MVP for Montreal and Quebec buyers.

## Chosen Stack

- Next.js App Router
- React
- TypeScript
- Plain CSS in `src/app/globals.css`
- Browser `localStorage` for Phase 1 demo persistence
- Mock report generation in `src/lib/reportEngine.ts`

The repository was empty except for `readme.md` and `plan.md`, so Phase 1 starts a fresh Next.js project. This matches the plan's recommended stack while avoiding backend integrations until the product journey is approved.

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

## Build

```bash
npm run build
```

## Quality Commands

```bash
npm run lint
npm run typecheck
```

There are no automated tests configured in Phase 1.

## Project Structure

```text
src/app/                  Route pages and global CSS
src/components/           Reusable UI and flow components
src/content/              Site copy, source links, language-ready content
src/lib/                  Mock data, report engine, local storage, service interfaces
src/types/                Domain types for intake, reports, and inspection requests
public/images/            Project visual assets
```

## Phase 1 Implements

- Homepage with automotive hero image, trust-focused copy, CTAs, FAQ, report preview, and Free vs Full report comparison.
- Check a Car intake flow with listing text, vehicle fields, seller/history signals, and photo upload metadata.
- Free Quick Check and Full Buyer Report selection.
- Clearly marked demo checkout state for the Full Buyer Report.
- Demo report page with the full planned report structure.
- Mobile inspection booking form.
- Local confirmation screen after inspection request submission.
- Public support pages: pricing, FAQ, example report, privacy, terms, contact, and not-found page.
- Language-ready content structure for English/French expansion.
- Service interfaces for future database, AI, Stripe, file storage, email, and dispatch integration.

## Mocked in Phase 1

- AI report generation
- Vehicle history and VIN checks
- Market pricing data
- File uploads
- Stripe/payment processing
- Email delivery
- SMS delivery
- Database storage
- Inspection partner dispatch
- Authentication and admin dashboard
- Analytics

## Remaining for Phase 2

- Connect persistent database storage.
- Add production file upload/storage.
- Connect a real AI report service with prompt versioning and safety guardrails.
- Add Stripe Checkout and webhook handling.
- Add transactional email delivery.
- Add admin dashboard or admin spreadsheet integration.
- Add inspection partner dispatch workflow.
- Expand French UI coverage.
- Add analytics events and conversion tracking.
- Add automated tests for report logic and critical forms.
