import api from "@/lib/api";

export interface ContactUs {
  phone1?: string | null;
  phone2?: string | null;
  email?: string | null;
  address?: string | null;
  telegram?: string | null;
}

export function hasContactDetails(contact: ContactUs): boolean {
  return Boolean(
    contact.phone1?.trim() ||
      contact.phone2?.trim() ||
      contact.email?.trim() ||
      contact.address?.trim() ||
      contact.telegram?.trim(),
  );
}

export async function fetchContactUs(): Promise<ContactUs> {
  const { data } = await api.get<{ contactUs?: ContactUs | null }>("/settings/contact-us");
  return data?.contactUs ?? {};
}
