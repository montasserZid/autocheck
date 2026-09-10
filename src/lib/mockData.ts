import type { VehicleIntake } from "@/types/domain";

export const demoVehicleIntake: VehicleIntake = {
  listingUrl: "https://example.com/demo-listing",
  listingText:
    "2017 Mazda3 GS, 168000 km, clean body, winter tires included, selling because we bought an SUV. Runs well. No trades. Located in Laval.",
  make: "Mazda",
  model: "Mazda3",
  year: 2017,
  trim: "GS",
  mileageKm: 168000,
  askingPriceCad: 8900,
  city: "Laval",
  sellerType: "private",
  vin: "",
  accidentHistoryMentioned: "unknown",
  carfaxStatus: "unknown",
  inspectionAllowed: "unknown",
  sellerDescription:
    "Seller says the car runs well and includes winter tires, but the ad does not mention service records, VIN, or inspection availability.",
  photos: [
    {
      name: "marketplace-front-view-demo.jpg",
      size: 420000,
      type: "image/jpeg"
    },
    {
      name: "dashboard-demo.jpg",
      size: 310000,
      type: "image/jpeg"
    }
  ],
  preferredLanguage: "en",
  submittedAt: new Date().toISOString()
};

export const faqItems = [
  {
    question: "Does AutoCheck QC replace a mechanical inspection?",
    answer:
      "No. AutoCheck QC is a pre-screening report. It helps you decide what to ask, what to verify, and whether the car is worth a professional inspection."
  },
  {
    question: "Can I use it for Facebook Marketplace or Kijiji?",
    answer:
      "Yes. For Phase 1, you paste the listing text and upload screenshots yourself. The app does not scrape marketplaces."
  },
  {
    question: "Is payment active in this MVP?",
    answer:
      "No. The Full Buyer Report flow includes a marked demo checkout state so the journey can be tested without processing payments."
  },
  {
    question: "Can the report confirm accident history or liens?",
    answer:
      "No. The demo report only comments on information you provide. Future integrations may link to official checks, but the report should never invent VIN, Carfax, SAAQ, or RDPRM results."
  }
];
