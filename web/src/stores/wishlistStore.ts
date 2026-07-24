import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  variantIds: string[];
  toggle: (variantId: string) => boolean;
  isSaved: (variantId: string) => boolean;
  count: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      variantIds: [],
      toggle: (variantId) => {
        const current = get().variantIds;
        const exists = current.includes(variantId);
        if (exists) {
          set({ variantIds: current.filter((id) => id !== variantId) });
          return false;
        }
        set({ variantIds: [variantId, ...current] });
        return true;
      },
      isSaved: (variantId) => get().variantIds.includes(variantId),
      count: () => get().variantIds.length,
    }),
    { name: "abana-wishlist" },
  ),
);
