import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CheckoutContact } from "@/types";

interface ContactState {
  contact: CheckoutContact;
  setContact: (contact: CheckoutContact) => void;
}

const emptyContact: CheckoutContact = { name: "", phone: "", city: "" };

export const useContactStore = create<ContactState>()(
  persist(
    (set) => ({
      contact: emptyContact,
      setContact: (contact) => set({ contact }),
    }),
    { name: "abana-checkout-contact" },
  ),
);

export function getDisplayName(contact: CheckoutContact): string | null {
  const name = contact.name.trim();
  return name.length > 0 ? name : null;
}
