import type { SupportedLanguage } from "@/types/domain";

export const supportedLanguages: SupportedLanguage[] = ["en", "fr"];

export const siteConfig = {
  name: "AutoCheck QC",
  tagline: "Don't buy a used car blind.",
  region: "Montreal and Quebec",
  disclaimer:
    "AutoCheck QC is not a replacement for a professional mechanical inspection. This report is an AI-assisted pre-screen based on the information provided. It helps you decide what to verify before buying."
};

export const homeCopy = {
  en: {
    heroTitle: "Don't buy a used car blind.",
    heroSubtitle:
      "Paste the ad, mileage, price, and photos. Get a clear demo risk report before you go see the car, negotiate, or pay for an inspection.",
    primaryCta: "Check This Car",
    secondaryCta: "Book an Inspection"
  },
  fr: {
    heroTitle: "N'achetez pas une voiture usagee a l'aveugle.",
    heroSubtitle:
      "Collez l'annonce, le kilometrage, le prix et les photos. Recevez un rapport de risque clair avant de vous deplacer, negocier ou payer une inspection.",
    primaryCta: "Verifier cette auto",
    secondaryCta: "Reserver une inspection"
  }
};

export const platformLabels = [
  "Facebook Marketplace",
  "Kijiji",
  "AutoTrader",
  "dealer listings",
  "private seller listings"
];

export const officialSources = [
  {
    label: "SAAQ vehicle transfer guidance",
    href: "https://saaq.gouv.qc.ca/en/vehicle-registration/registering-vehicle/automobile-motor-home/passenger-vehicle-between-individuals"
  },
  {
    label: "Quebec consumer protection for used cars",
    href: "https://www.opc.gouv.qc.ca/en/consumer/topic/warranties/automobile/used-car"
  },
  {
    label: "Quebec vehicle purchase and leasing portal",
    href: "https://www.quebec.ca/en/transports/purchase-or-leasing-of-a-vehicle"
  }
];
