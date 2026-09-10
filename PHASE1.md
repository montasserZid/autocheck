# Phase 1 Implementation Notes

## Implemented

- Complete clickable customer journey:
  - Home
  - Check a Car
  - Intake form
  - Screenshot/photo metadata upload
  - Free or Full report selection
  - Demo checkout for Full Buyer Report
  - Demo report
  - Book Mobile Inspection
  - Inspection request confirmation
- Trust-focused automotive homepage for AutoCheck QC.
- Professional report UI with all sections from `plan.md`.
- Mobile-oriented form layouts and responsive page structure.
- Mock report engine that uses submitted local data and safe wording.
- Local browser storage for intake, report, and inspection request state.
- Public pages for pricing, FAQ, example report, privacy, terms, contact, and 404.
- Generated project hero image saved at `public/images/hero-autocheck-qc.png`.

## Architectural Decisions

- Next.js App Router was selected because the folder had no existing stack and the plan prioritizes SEO, public pages, and a future full web app.
- Phase 1 avoids backend services and keeps state in `localStorage`.
- Domain types live in `src/types/domain.ts` so future backend payloads can reuse the same shape.
- External services are represented by interfaces in `src/lib/serviceInterfaces.ts`.
- Mock/demo behavior lives outside route components:
  - `src/lib/mockData.ts`
  - `src/lib/reportEngine.ts`
  - `src/lib/localStorage.ts`
- Public page copy has a language-ready structure in `src/content/site.ts`.

## Routes Created

- `/`
- `/check`
- `/report`
- `/inspection`
- `/inspection/confirmation`
- `/example-report`
- `/pricing`
- `/faq`
- `/privacy`
- `/terms`
- `/contact`

## Components Created

- `Header`
- `Footer`
- `Container`
- `ButtonLink`
- `SectionHeading`
- `RecommendationBadge`
- `ReportView`
- `VehicleIntakeFlow`
- `ReportExperience`
- `InspectionBookingForm`
- `ConfirmationDetails`

## Remaining TODOs

- Replace mock report generation with a production AI service.
- Add database persistence for leads, listings, reports, payments, and inspection requests.
- Add real image/file upload storage.
- Add Stripe Checkout and webhook flow.
- Add transactional email delivery.
- Add admin dashboard.
- Add partner dispatch workflow.
- Add full French route/content support.
- Add analytics events.
- Add automated tests.

## Recommended Phase 2 Order

1. Add Supabase schema and persistence for vehicle intake, reports, and inspection requests.
2. Add production file upload/storage with file type and size limits.
3. Add real AI report generation behind the existing report service interface.
4. Add Stripe Checkout for Full Buyer Report and webhook-triggered report generation.
5. Add Resend email delivery for customer report and admin notification.
6. Add a simple admin dashboard for leads, reports, and inspection requests.
7. Add analytics events for funnel tracking.
8. Expand French UI and SEO pages.
