import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import {
  fetchOrders,
  ORDER_STATUS_VALUES,
  orderStatusLabel,
  patchOrderStatus,
  type OrderListRow,
} from "../../services/order.service";
import { useTimeAgoTick } from "../../hooks/useTimeAgoTick";
import { formatAbsoluteDateTime, formatTimeAgo } from "../../utils/formatTimeAgo";

function formatMoney(v: string | number): string {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toFixed(2);
}

function shortId(id: string): string {
  return id.length > 8 ? id.slice(0, 8) : id;
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderListRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const timeAgoTick = useTimeAgoTick(5_000);
  const timeAgoNow = useMemo(() => new Date(), [timeAgoTick]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchOrders({ limit: 100, offset: 0 })
      .then((res) => {
        if (!cancelled) {
          setOrders(res.orders);
          setTotal(res.total);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not load orders. Sign in or check API permissions.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleStatusChange(
    orderId: string,
    nextStatus: string,
    prev: OrderListRow
  ) {
    if (nextStatus === prev.status) return;
    setUpdatingId(orderId);
    setError(null);
    setOrders((rows) =>
      rows.map((r) => (r.id === orderId ? { ...r, status: nextStatus } : r))
    );
    try {
      const updated = await patchOrderStatus(orderId, nextStatus);
      setOrders((rows) =>
        rows.map((r) => (r.id === orderId ? { ...r, status: updated.status } : r))
      );
    } catch {
      setOrders((rows) => rows.map((r) => (r.id === orderId ? prev : r)));
      setError("Could not update status. Try again or refresh.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <>
      <PageMeta
        title="Orders | Cosmetics Admin"
        description="Customer orders from the cosmetics store"
      />
      <PageBreadcrumb pageTitle="Orders" />
      <div className="space-y-6">
        <ComponentCard
          title="Orders"
          desc={
            total
              ? `Showing latest orders (${orders.length} of ${total}).`
              : "Customer orders placed from the mobile app."
          }
        >
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
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                    City
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium max-w-[140px]">
                    Device ID
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
                {loading ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-sm text-gray-500" colSpan={8}>
                      Loading…
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-sm text-gray-500" colSpan={8}>
                      No orders yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((o) => (
                    <TableRow
                      key={o.id}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
                      onClick={() => navigate(`/orders/${o.id}`)}
                    >
                      <TableCell className="px-5 py-4 text-sm font-mono text-gray-800 dark:text-white/90">
                        #{shortId(o.id)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                        {o.customerName}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {o.phone}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {o.city ?? "—"}
                      </TableCell>
                      <TableCell
                        className="px-5 py-4 text-xs font-mono text-gray-600 dark:text-gray-400 max-w-[160px] truncate"
                        title={o.clientDeviceId ?? undefined}
                      >
                        {o.clientDeviceId ?? "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-right text-gray-800 dark:text-white/90">
                        {formatMoney(o.totalAmount)}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div
                          className="inline-block"
                          onClick={(e: MouseEvent) => e.stopPropagation()}
                        >
                        <select
                          className="h-9 min-w-[10.5rem] rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-800 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                          disabled={updatingId === o.id}
                          value={o.status}
                          onChange={(e) =>
                            handleStatusChange(o.id, e.target.value, o)
                          }
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
