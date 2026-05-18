import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import {
  fetchOrderById,
  ORDER_STATUS_VALUES,
  orderStatusLabel,
  patchOrderStatus,
  type OrderDetail,
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

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = id?.trim() ?? "";
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusSaving, setStatusSaving] = useState(false);
  const timeAgoTick = useTimeAgoTick(1_000);
  const timeAgoNow = useMemo(() => new Date(), [timeAgoTick]);

  useEffect(() => {
    if (!orderId) {
      setError("Invalid order id");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchOrderById(orderId)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch(() => {
        if (!cancelled) setError("Order not found or you are not authorized.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  async function handleStatusChange(nextStatus: string) {
    if (!order || nextStatus === order.status) return;
    const prev = order;
    setStatusSaving(true);
    setError(null);
    setOrder({ ...order, status: nextStatus });
    try {
      const updated = await patchOrderStatus(order.id, nextStatus);
      setOrder(updated);
    } catch {
      setOrder(prev);
      setError("Could not update status. Try again.");
    } finally {
      setStatusSaving(false);
    }
  }

  return (
    <>
      <PageMeta
        title={
          order
            ? `Order #${shortId(order.id)} | Cosmetics Admin`
            : "Order | Cosmetics Admin"
        }
        description="Order details and line items"
      />
      <PageBreadcrumb
        pageTitle={order ? `Order #${shortId(order.id)}` : "Order"}
      />
      <div className="mb-4">
        <Link
          to="/orders"
          className="text-sm font-medium text-brand-500 hover:text-brand-600"
        >
          ← Back to orders
        </Link>
      </div>
      <div className="space-y-6">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}
        {loading && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
        )}
        {order && (
          <>
            <ComponentCard
              title="Customer & delivery"
              desc="Contact and delivery details from checkout."
            >
              <div className="px-6 pb-6 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Name</span>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {order.customerName}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Phone</span>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {order.phone}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">City</span>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {order.city ?? "—"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-500 dark:text-gray-400">Device ID (app)</span>
                  <p className="font-mono text-xs break-all text-gray-800 dark:text-white/90">
                    {order.clientDeviceId ?? "—"}
                  </p>
                </div>
                {order.userId && (
                  <div className="sm:col-span-2">
                    <span className="text-gray-500 dark:text-gray-400">User account</span>
                    <p className="font-mono text-xs break-all text-gray-800 dark:text-white/90">
                      {order.userId}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Status</span>
                  <select
                    className="mt-1 h-11 w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 sm:w-auto sm:min-w-[12rem]"
                    disabled={statusSaving}
                    value={order.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    {!ORDER_STATUS_VALUES.includes(
                      order.status as (typeof ORDER_STATUS_VALUES)[number]
                    ) && (
                      <option value={order.status}>{order.status} (legacy)</option>
                    )}
                    {ORDER_STATUS_VALUES.map((v) => (
                      <option key={v} value={v}>
                        {orderStatusLabel(v)}
                      </option>
                    ))}
                  </select>
                  {statusSaving && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Saving…
                    </p>
                  )}
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Created</span>
                  <p
                    className="font-medium text-gray-800 dark:text-white/90"
                    title={formatAbsoluteDateTime(order.createdAt)}
                  >
                    {formatTimeAgo(order.createdAt, timeAgoNow)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Total</span>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatMoney(order.totalAmount)}
                  </p>
                </div>
              </div>
            </ComponentCard>

            <ComponentCard title="Line items" desc="Products and quantities for this order.">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 dark:border-gray-800">
                      <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                        Product
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 text-right text-sm font-medium">
                        Qty
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 text-right text-sm font-medium">
                        Unit price
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 text-right text-sm font-medium">
                        Line total
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {order.items.map((line) => (
                      <TableRow key={line.id}>
                        <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                          {line.productName}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm text-right text-gray-600 dark:text-gray-400">
                          {line.quantity}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm text-right text-gray-600 dark:text-gray-400">
                          {formatMoney(line.unitPrice)}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm text-right font-medium text-gray-800 dark:text-white/90">
                          {formatMoney(line.lineTotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ComponentCard>
          </>
        )}
      </div>
    </>
  );
}
