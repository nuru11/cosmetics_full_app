import { useCallback, useEffect, useRef, useState } from "react";
import { fetchOrders, type OrderListRow } from "../services/order.service";
import { playNewOrderChime } from "../utils/newOrderChime";

const POLL_INTERVAL_MS = 4000;
const DEFAULT_TITLE = "Live orders | Snack Admin";

const LIVE_HIDDEN_STATUSES = new Set(["delivered", "cancelled"]);

function isLiveOrder(order: OrderListRow): boolean {
  return !LIVE_HIDDEN_STATUSES.has(String(order.status).trim().toLowerCase());
}

function filterLiveOrders(orders: OrderListRow[]): OrderListRow[] {
  return orders.filter(isLiveOrder);
}

function pruneHighlightsToOrders(
  highlighted: Set<number>,
  visibleOrders: OrderListRow[]
): Set<number> {
  const visibleIds = new Set(visibleOrders.map((o) => o.id));
  return new Set([...highlighted].filter((id) => visibleIds.has(id)));
}

export interface UseLiveOrdersPollOptions {
  soundEnabled?: boolean;
  notificationsEnabled?: boolean;
}

export function useLiveOrdersPoll(options: UseLiveOrdersPollOptions = {}) {
  const { soundEnabled = false, notificationsEnabled = false } = options;

  const [orders, setOrders] = useState<OrderListRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);
  const [highlightedIds, setHighlightedIds] = useState<Set<number>>(() => new Set());
  const [pulsingIds, setPulsingIds] = useState<Set<number>>(() => new Set());

  const seenIdsRef = useRef<Set<number>>(new Set());
  const baselineReadyRef = useRef(false);
  const pollingRef = useRef(false);

  const updateDocumentTitle = useCallback((highlightCount: number) => {
    if (highlightCount > 0) {
      document.title = `(${highlightCount} new) ${DEFAULT_TITLE}`;
    } else {
      document.title = DEFAULT_TITLE;
    }
  }, []);

  const poll = useCallback(async () => {
    if (pollingRef.current) return;
    pollingRef.current = true;
    try {
      const res = await fetchOrders({ limit: 50, offset: 0 });
      const visibleOrders = filterLiveOrders(res.orders);
      setTotal(visibleOrders.length);
      setLastFetchedAt(new Date());
      setError(null);

      if (!baselineReadyRef.current) {
        res.orders.forEach((o) => seenIdsRef.current.add(o.id));
        baselineReadyRef.current = true;
        setOrders(visibleOrders);
        return;
      }

      const newOrders = res.orders.filter((o) => !seenIdsRef.current.has(o.id));
      const newLiveOrders = filterLiveOrders(newOrders);
      if (newLiveOrders.length > 0) {
        const newIds = newLiveOrders.map((o) => o.id);
        newOrders.forEach((o) => seenIdsRef.current.add(o.id));

        setHighlightedIds((prev) => {
          const next = pruneHighlightsToOrders(
            new Set([...prev, ...newIds]),
            visibleOrders
          );
          updateDocumentTitle(next.size);
          return next;
        });

        setPulsingIds((prev) => {
          const next = new Set(prev);
          newIds.forEach((id) => next.add(id));
          return pruneHighlightsToOrders(next, visibleOrders);
        });

        newIds.forEach((id) => {
          window.setTimeout(() => {
            setPulsingIds((prev) => {
              if (!prev.has(id)) return prev;
              const next = new Set(prev);
              next.delete(id);
              return next;
            });
          }, 45_000);
        });

        if (soundEnabled) {
          playNewOrderChime();
        }

        if (
          notificationsEnabled &&
          document.hidden &&
          typeof Notification !== "undefined" &&
          Notification.permission === "granted"
        ) {
          const pendingCount = newLiveOrders.filter((o) => o.status === "pending").length;
          const body =
            pendingCount > 0
              ? `${newLiveOrders.length} new order(s), ${pendingCount} pending`
              : `${newLiveOrders.length} new order(s)`;
          new Notification("New order", { body, tag: "snack-live-orders" });
        }
      } else {
        newOrders.forEach((o) => seenIdsRef.current.add(o.id));
      }

      res.orders.forEach((o) => seenIdsRef.current.add(o.id));
      setOrders(visibleOrders);
      setHighlightedIds((prev) => {
        const next = pruneHighlightsToOrders(prev, visibleOrders);
        if (next.size !== prev.size) updateDocumentTitle(next.size);
        return next;
      });
      setPulsingIds((prev) => pruneHighlightsToOrders(prev, visibleOrders));
    } catch {
      setError("Could not load orders. Sign in or check API permissions.");
    } finally {
      setLoading(false);
      pollingRef.current = false;
    }
  }, [notificationsEnabled, soundEnabled, updateDocumentTitle]);

  useEffect(() => {
    void poll();
    const interval = setInterval(() => {
      if (document.visibilityState === "hidden") return;
      void poll();
    }, POLL_INTERVAL_MS);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void poll();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      document.title = DEFAULT_TITLE;
    };
  }, [poll]);

  const clearHighlights = useCallback(() => {
    setHighlightedIds(new Set());
    setPulsingIds(new Set());
    updateDocumentTitle(0);
  }, [updateDocumentTitle]);

  const dismissHighlight = useCallback(
    (orderId: number) => {
      setHighlightedIds((prev) => {
        if (!prev.has(orderId)) return prev;
        const next = new Set(prev);
        next.delete(orderId);
        updateDocumentTitle(next.size);
        return next;
      });
      setPulsingIds((prev) => {
        if (!prev.has(orderId)) return prev;
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    },
    [updateDocumentTitle]
  );

  const updateOrderInList = useCallback(
    (orderId: number, patch: Partial<OrderListRow>) => {
      if (patch.status && !isLiveOrder({ status: patch.status } as OrderListRow)) {
        dismissHighlight(orderId);
      }
      setOrders((rows) => {
        const updated = rows.map((r) => (r.id === orderId ? { ...r, ...patch } : r));
        const visible = filterLiveOrders(updated);
        setTotal(visible.length);
        return visible;
      });
    },
    [dismissHighlight]
  );

  return {
    orders,
    total,
    loading,
    error,
    setError,
    lastFetchedAt,
    highlightedIds,
    pulsingIds,
    poll,
    clearHighlights,
    dismissHighlight,
    updateOrderInList,
    pollIntervalMs: POLL_INTERVAL_MS,
  };
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof Notification === "undefined") return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}
