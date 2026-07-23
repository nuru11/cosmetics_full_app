import api from "../lib/api";

export interface SettingsRecord {
  bankName?: string | null;
  bankAccountName?: string | null;
  bankAccountNumber?: string | null;
  bankInstructions?: string | null;
  defaultPrivacyPolicy?: string | null;
  defaultPenaltyPercent?: number | null;
}

export const getSettings = async (): Promise<SettingsRecord | null> => {
  const { data } = await api.get<SettingsRecord | null>("/admin/settings/bank");
  return data;
};

export const updateSettings = async (
  payload: SettingsRecord
): Promise<SettingsRecord> => {
  const { data } = await api.put<SettingsRecord>(
    "/admin/settings/bank",
    payload
  );
  return data;
};

export interface CommissionRates {
  in_house?: number;
  freelancer?: number;
}

export const getCommissionRates = async (): Promise<CommissionRates> => {
  const { data } = await api.get<CommissionRates>("/admin/settings/commission");
  return data;
};

export const updateCommissionRates = async (
  payload: CommissionRates
): Promise<CommissionRates> => {
  const { data } = await api.put<CommissionRates>(
    "/admin/settings/commission",
    payload
  );
  return data;
};

export interface DefaultPrivacyPolicyResponse {
  defaultPrivacyPolicy?: string | null;
}

export const getDefaultPrivacyPolicy = async (): Promise<string | null> => {
  const { data } = await api.get<DefaultPrivacyPolicyResponse>(
    "/admin/settings/privacy-policy"
  );
  return data?.defaultPrivacyPolicy ?? null;
};

export const updateDefaultPrivacyPolicy = async (
  defaultPrivacyPolicy: string | null
): Promise<string | null> => {
  const { data } = await api.put<DefaultPrivacyPolicyResponse>(
    "/admin/settings/privacy-policy",
    { defaultPrivacyPolicy }
  );
  return data?.defaultPrivacyPolicy ?? null;
};

export interface DefaultPrivacyPolicyPdfResponse {
  defaultPrivacyPolicyUrl?: string | null;
}

export const getDefaultPrivacyPolicyPdf = async (): Promise<string | null> => {
  const { data } = await api.get<DefaultPrivacyPolicyPdfResponse>(
    "/admin/settings/privacy-policy-pdf"
  );
  return data?.defaultPrivacyPolicyUrl ?? null;
};

export const updateDefaultPrivacyPolicyPdf = async (
  defaultPrivacyPolicyUrl: string | null
): Promise<string | null> => {
  const { data } = await api.put<DefaultPrivacyPolicyPdfResponse>(
    "/admin/settings/privacy-policy-pdf",
    { defaultPrivacyPolicyUrl }
  );
  return data?.defaultPrivacyPolicyUrl ?? null;
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });

export const uploadPrivacyPolicyPdf = async (
  file: File
): Promise<{ url: string }> => {
  const fileBase64 = await readFileAsDataUrl(file);
  const { data } = await api.post<{ url: string }>("/uploads/privacy-policy", {
    fileBase64,
  });
  return data;
};

export interface ContactUsResponse {
  contactUs?: ContactUsFields | null;
}

export interface ContactUsFields {
  phone1?: string | null;
  phone2?: string | null;
  email?: string | null;
  address?: string | null;
  telegram?: string | null;
}

export interface FaqItem {
  question: string;
  answer: string;
  sortOrder?: number;
}

export interface FaqResponse {
  faqItems?: FaqItem[];
}

export const getContactUs = async (): Promise<ContactUsFields> => {
  const { data } = await api.get<ContactUsResponse>("/admin/settings/contact-us");
  return data?.contactUs ?? {};
};

export const updateContactUs = async (
  contactUs: ContactUsFields
): Promise<ContactUsFields> => {
  const { data } = await api.put<ContactUsResponse>(
    "/admin/settings/contact-us",
    { contactUs }
  );
  return data?.contactUs ?? {};
};

export const getFaq = async (): Promise<FaqItem[]> => {
  const { data } = await api.get<FaqResponse>("/admin/settings/faq");
  return data?.faqItems ?? [];
};

export const updateFaq = async (faqItems: FaqItem[]): Promise<FaqItem[]> => {
  const { data } = await api.put<FaqResponse>("/admin/settings/faq", {
    faqItems,
  });
  return data?.faqItems ?? [];
};

export interface DefaultPenaltyPercentResponse {
  defaultPenaltyPercent?: number | null;
}

export const getDefaultPenaltyPercent = async (): Promise<number> => {
  const { data } = await api.get<DefaultPenaltyPercentResponse>(
    "/admin/settings/penalty-percent"
  );
  const value = Number(data?.defaultPenaltyPercent);
  return Number.isFinite(value) && value >= 0 ? value : 0;
};

export const updateDefaultPenaltyPercent = async (
  defaultPenaltyPercent: number
): Promise<number> => {
  const { data } = await api.put<DefaultPenaltyPercentResponse>(
    "/admin/settings/penalty-percent",
    { defaultPenaltyPercent }
  );
  const value = Number(data?.defaultPenaltyPercent);
  return Number.isFinite(value) && value >= 0 ? value : 0;
};
