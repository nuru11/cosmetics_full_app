import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import am from "./am.json";

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    am: { translation: am },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

export function versionLabelKey(versionKey: string): string {
  switch (versionKey.toUpperCase()) {
    case "ORIGINAL":
      return "version.original";
    case "TWO_LEVEL":
      return "version.two_level";
    case "PREMIUM":
      return "version.premium";
    default:
      return "version.original";
  }
}

export function versionSubtitleKey(versionKey: string): string {
  switch (versionKey.toUpperCase()) {
    case "ORIGINAL":
      return "version.original_subtitle";
    case "TWO_LEVEL":
      return "version.two_level_subtitle";
    case "PREMIUM":
      return "version.premium_subtitle";
    default:
      return "version.original_subtitle";
  }
}

export function orderStatusKey(status: string): string {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "orders.status.pending";
    case "PAID":
      return "orders.status.paid";
    case "SHIPPED":
      return "orders.status.shipped";
    case "DELIVERED":
      return "orders.status.delivered";
    case "CANCELLED":
      return "orders.status.cancelled";
    default:
      return "orders.status.unknown";
  }
}
