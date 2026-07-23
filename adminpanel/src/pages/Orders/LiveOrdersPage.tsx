import { useMemo, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import {
  requestNotificationPermission,
  useLiveOrdersPoll,
} from "../../hooks/useLiveOrdersPoll";
import { useTimeAgoTick } from "../../hooks/useTimeAgoTick";
import { formatAbsoluteDateTime, formatTimeAgo } from "../../utils/formatTimeAgo";
import {
  ORDER_STATUS_VALUES,
  orderStatusLabel,
  patchOrderStatus,
  type OrderListRow,
} from "../../services/order.service";

function formatMoney(v: string | number): string {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toFixed(2);
}

function shortId(id: string): string {
  return id.length > 8 ? id.slice(0, 8) : id;
}

function formatLastFetched(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleTimeString();
}

function rowHighlightClass(
  order: OrderListRow,
  isHighlighted: boolean,
  isPulsing: boolean
): string {
  if (!isHighlighted) {
    return "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5";
  }
  const pulse = isPulsing ? " animate-pulse" : "";
  const isPending = order.status.toUpperCase() === "PENDING";
  if (isPending) {
    return `cursor-pointer border-l-4 border-emerald-500 bg-emerald-50/90 dark:bg-emerald-500/15${pulse}`;
  }
  return `cursor-pointer border-l-4 border-amber-500 bg-amber-50/90 dark:bg-amber-500/15${pulse}`;
}

export default function LiveOrdersPage() {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const {
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
    pollIntervalMs,
  } = useLiveOrdersPoll({ soundEnabled, notificationsEnabled });

  const timeAgoTick = useTimeAgoTick(1_000);
  const timeAgoNow = useMemo(() => new Date(), [timeAgoTick]);

  async function handleEnableNotifications() {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
  }

  async function handleStatusChange(orderId: string, nextStatus: string, prev: OrderListRow) {
    if (nextStatus === prev.status) return;
    setUpdatingId(orderId);
    setError(null);
    updateOrderInList(orderId, { status: nextStatus });
    try {
      const updated = await patchOrderStatus(orderId, nextStatus);
      updateOrderInList(orderId, { status: updated.status });
    } catch {
      updateOrderInList(orderId, { status: prev.status });
      setError("Could not update status. Try again or refresh.");
    } finally {
      setUpdatingId(null);
    }
  }

  function handleRowClick(order: OrderListRow) {
    dismissHighlight(order.id);
    navigate(`/orders/${order.id}`);
  }

  const highlightCount = highlightedIds.size;

  return (
    <>
      <PageMeta
        title="Live orders | Snack Admin"
        description="Real-time order feed for the kitchen and front desk"
      />
      <PageBreadcrumb pageTitle="Live orders" />
      <div className="space-y-6">
        <ComponentCard
          title="Live orders"
          desc={
            total
              ? `Auto-refreshing every ${pollIntervalMs / 1000}s · ${total} active order${total === 1 ? "" : "s"} (delivered & cancelled hidden)`
              : "New orders appear here automatically. Delivered and cancelled orders are hidden."
          }
        >
          <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-6 pb-4 dark:border-gray-800">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-white/90">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              Live
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last updated {formatLastFetched(lastFetchedAt)}
            </span>
            {highlightCount > 0 && (
              <Badge color="warning" size="sm">
                {highlightCount} new
              </Badge>
            )}
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500/20"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                />
                Sound
              </label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (notificationsEnabled) {
                    setNotificationsEnabled(false);
                  } else {
                    void handleEnableNotifications();
                  }
                }}
              >
                {notificationsEnabled ? "Notifications on" : "Enable notifications"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={highlightCount === 0}
                onClick={clearHighlights}
              >
                Clear highlights
              </Button>
              <Button size="sm" variant="outline" onClick={() => void poll()}>
                Refresh now
              </Button>
            </div>
          </div>

          {error && (
            <p className="px-6 pb-4 text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-gray-800">
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                    ID
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                    Customer
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                    Phone
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-left text-sm font-medium min-w-[10rem] max-w-[240px]"
                  >
                    City
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-right text-sm font-medium">
                    Total
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                    Status
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                    Created
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 dark:divide-gray-800">
                {loading && orders.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-sm text-gray-500" colSpan={7}>
                      Loading…
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-sm text-gray-500" colSpan={7}>
                      No orders yet. Waiting for new orders…
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((o) => {
                    const isHighlighted = highlightedIds.has(o.id);
                    const isPulsing = pulsingIds.has(o.id);
                    return (
                      <TableRow
                        key={o.id}
                        className={rowHighlightClass(o, isHighlighted, isPulsing)}
                        onClick={() => handleRowClick(o)}
                      >
                        <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                          <span className="inline-flex items-center gap-2">
                            #{shortId(o.id)}
                            {isHighlighted && (
                              <Badge color={o.status.toUpperCase() === "PENDING" ? "success" : "warning"} size="sm">
                                NEW
                              </Badge>
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                          {o.customerName}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {o.phone}
                        </TableCell>
                        <TableCell
                          className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 min-w-[10rem] max-w-[240px]"
                        >
                          <span className="line-clamp-2 break-words">
                            {o.city ?? "—"}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm text-right text-gray-800 dark:text-white/90">
                          {formatMoney(o.totalAmount)}
                        </TableCell>
                        <TableCell className="px-5 py-4">
                          <div
                            className="flex flex-wrap items-center gap-2"
                            onClick={(e: MouseEvent) => e.stopPropagation()}
                          >
                            {o.status.toUpperCase() === "PENDING" && (
                              <Badge color="warning" size="sm">
                                Pending
                              </Badge>
                            )}
                            <select
                              className="h-9 min-w-[10.5rem] rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-800 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                              disabled={updatingId === o.id}
                              value={o.status}
                              onChange={(e) => handleStatusChange(o.id, e.target.value, o)}
                            >
                              {!ORDER_STATUS_VALUES.includes(
                                o.status as (typeof ORDER_STATUS_VALUES)[number]
                              ) && (
                                <option value={o.status}>{o.status} (legacy)</option>
                              )}
                              {ORDER_STATUS_VALUES.map((v) => (
                                <option key={v} value={v}>
                                  {orderStatusLabel(v)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </TableCell>
                        <TableCell
                          className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400"
                          title={formatAbsoluteDateTime(o.createdAt)}
                        >
                          {formatTimeAgo(o.createdAt, timeAgoNow)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
