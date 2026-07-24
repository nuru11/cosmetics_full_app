import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { orderStatusKey } from "@/i18n";
import { formatPrice } from "@/lib/formatPrice";
import { EmptyState, ErrorState, PageLoader } from "@/components/shared/LoadingState";
import { fetchOrders } from "@/services/orderService";
import type { Order, OrderFilter } from "@/types";
import { cn } from "@/lib/utils";

const ACTIVE_STATUSES = new Set(["PENDING", "PAID", "SHIPPED"]);
const PAST_STATUSES = new Set(["DELIVERED", "CANCELLED"]);

function filterOrders(orders: Order[], filter: OrderFilter): Order[] {
  if (filter === "active") {
    return orders.filter((order) => ACTIVE_STATUSES.has(order.status.toUpperCase()));
  }
  if (filter === "past") {
    return orders.filter((order) => PAST_STATUSES.has(order.status.toUpperCase()));
  }
  return orders;
}

function statusClasses(status: string): string {
  const normalized = status.toUpperCase();
  if (normalized === "DELIVERED") {
    return "bg-status-delivered-bg text-status-delivered-text";
  }
  if (normalized === "PENDING") {
    return "bg-status-pending-bg text-status-pending-text";
  }
  return "bg-status-neutral-bg text-status-neutral-text";
}

export default function OrdersPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setOrders(await fetchOrders());
    } catch {
      setError("error.load_orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const filtered = useMemo(() => filterOrders(orders, filter), [orders, filter]);

  const emptyCopy = useMemo(() => {
    if (filter === "active") {
      return { title: t("orders.no_active"), message: t("orders.no_active_message") };
    }
    if (filter === "past") {
      return { title: t("orders.no_past"), message: t("orders.no_past_message") };
    }
    return { title: t("orders.empty_title"), message: t("orders.empty_message") };
  }, [filter, t]);

  return (
    <div className="pb-8">
      <div className="border-b border-divider-grey/50 bg-white px-4 py-4">
        <h1 className="text-lg font-semibold">{t("orders.title")}</h1>
        <div className="mt-3 flex gap-2">
          {(["all", "active", "past"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold",
                filter === value ? "bg-brand-blue text-white" : "bg-cream text-text-muted",
              )}
            >
              {t(`orders.filter_${value}`)}
            </button>
          ))}
        </div>
      </div>

      {loading ? <PageLoader /> : null}
      {error ? (
        <ErrorState
          message={t(error)}
          onRetry={() => void loadOrders()}
          retryLabel={t("common.retry")}
        />
      ) : null}

      {!loading && !error && filtered.length === 0 ? (
        <EmptyState title={emptyCopy.title} message={emptyCopy.message} />
      ) : null}

      {!loading && !error && filtered.length > 0 ? (
        <div className="space-y-4 px-4 py-4">
          {filtered.map((order) => (
            <article key={order.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {order.customerName || t("profile.guest")}
                  </p>
                  <p className="text-xs text-text-muted">
                    {order.city ? `${order.city} · ` : ""}
                    {order.phone}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    statusClasses(order.status),
                  )}
                >
                  {t(orderStatusKey(order.status))}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-divider-grey/60 pt-3">
                <span className="text-xs text-text-muted">
                  {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </span>
                <span className="text-base font-bold">{formatPrice(order.totalAmount)}</span>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
