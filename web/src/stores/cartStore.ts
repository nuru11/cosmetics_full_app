import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/types";

interface CartState {
  lines: CartLine[];
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  add: (variantId: string, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  pruneInvalid: (validVariantIds: Set<string>) => void;
  quantityFor: (variantId: string) => number;
  totalItemCount: () => number;
  uniqueLineCount: () => number;
}

type PersistedCart = Pick<CartState, "lines">;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),
      add: (variantId, quantity = 1) => {
        if (!variantId || quantity < 1) return;
        const list = [...get().lines];
        const index = list.findIndex((l) => l.variantId === variantId);
        if (index >= 0) {
          const existing = list.splice(index, 1)[0];
          list.unshift({
            ...existing,
            quantity: existing.quantity + quantity,
          });
        } else {
          list.unshift({ variantId, quantity });
        }
        set({ lines: list });
      },
      setQuantity: (variantId, quantity) => {
        if (!variantId) return;
        const list = [...get().lines];
        const index = list.findIndex((l) => l.variantId === variantId);
        if (index < 0) return;
        if (quantity < 1) {
          list.splice(index, 1);
        } else {
          list[index] = { ...list[index], quantity };
        }
        set({ lines: list });
      },
      remove: (variantId) => {
        set({ lines: get().lines.filter((l) => l.variantId !== variantId) });
      },
      clear: () => set({ lines: [] }),
      pruneInvalid: (validVariantIds) => {
        const next = get().lines.filter((l) => validVariantIds.has(l.variantId));
        if (next.length !== get().lines.length) {
          set({ lines: next });
        }
      },
      quantityFor: (variantId) =>
        get().lines.find((l) => l.variantId === variantId)?.quantity ?? 0,
      totalItemCount: () =>
        get().lines.reduce((sum, line) => sum + line.quantity, 0),
      uniqueLineCount: () => get().lines.length,
    }),
    {
      name: "abana-cart",
      partialize: (state) => ({ lines: state.lines }),
      merge: (persisted, current) => {
        const saved = persisted as PersistedCart | undefined;
        const savedLines = saved?.lines ?? [];
        const currentLines = current.lines ?? [];

        if (currentLines.length > 0) {
          return { ...current, lines: currentLines };
        }

        return {
          ...current,
          lines: savedLines,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function useCartHydrated(): boolean {
  return useCartStore((s) => s._hasHydrated);
}
