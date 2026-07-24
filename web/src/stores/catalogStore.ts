import { create } from "zustand";
import type { Category, Product } from "@/types";
import { fetchCategories, fetchProducts } from "@/services/catalogService";

interface CatalogState {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  selectedCategoryId: string | null;
  loadAll: () => Promise<void>;
  refresh: () => Promise<void>;
  setSelectedCategoryId: (categoryId: string | null) => void;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  products: [],
  categories: [],
  isLoading: false,
  error: null,
  selectedCategoryId: null,
  loadAll: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const [products, categories] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      set({ products, categories, isLoading: false });
    } catch {
      set({
        isLoading: false,
        error: "error.load_products",
      });
    }
  },
  refresh: async () => {
    set({ error: null });
    try {
      const [products, categories] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      set({ products, categories });
    } catch {
      set({ error: "error.load_products" });
    }
  },
  setSelectedCategoryId: (categoryId) => set({ selectedCategoryId: categoryId }),
}));
