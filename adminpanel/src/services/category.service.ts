import api from "../lib/api";

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
}

export interface CategoryInput {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
}

export async function fetchCategories(activeOnly = false): Promise<CategoryRow[]> {
  const { data } = await api.get<{ categories: CategoryRow[] }>("/categories", {
    params: { activeOnly: activeOnly ? "true" : "false" },
  });
  return data.categories ?? [];
}

export async function createCategory(input: CategoryInput): Promise<CategoryRow> {
  const { data } = await api.post<{ category: CategoryRow }>("/categories", input);
  return data.category;
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryInput>
): Promise<CategoryRow> {
  const { data } = await api.patch<{ category: CategoryRow }>(`/categories/${id}`, input);
  return data.category;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}
