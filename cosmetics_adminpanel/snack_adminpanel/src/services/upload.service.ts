import api from "../lib/api";

function apiOrigin(): string {
  const base = api.defaults.baseURL || "https://alemmartapi.alemmart.com/api";
  return base.replace(/\/api\/?$/, "");
}

export function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const origin = apiOrigin();
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function uploadImageBase64(imageBase64: string, folder = "products"): Promise<string> {
  const { data } = await api.post<{ url: string }>("/uploads", { imageBase64, folder });
  const resolved = resolveAssetUrl(data.url);
  if (!resolved) throw new Error("Upload did not return a URL");
  return resolved;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
