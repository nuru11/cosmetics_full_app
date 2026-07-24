import api from "@/lib/api";

export async function submitProductRequest(payload: {
  description?: string;
  imageBase64?: string;
  customerName: string;
  phone: string;
}): Promise<void> {
  await api.post("product-requests", payload);
}
