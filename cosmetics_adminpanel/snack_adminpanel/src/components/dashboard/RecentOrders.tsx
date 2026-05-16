import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { fetchOrders, type OrderListRow } from "../../services/order.service";

function formatMoney(v: string | number): string {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toFixed(2);
}

function statusColor(status: string): "success" | "warning" | "error" | "primary" {
  const s = status.toLowerCase();
  if (s === "completed" || s === "delivered") return "success";
  if (s === "cancelled") return "error";
  if (s === "pending") return "warning";
  return "primary";
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<OrderListRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders({ limit: 10, offset: 0 })
      .then((res) => setOrders(res.orders))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-2xl border bg-white p-6 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent orders</h3>
        <Link to="/orders" className="text-sm font-medium text-brand-500 hover:text-brand-600">
          View all
        </Link>
      </div>
      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="p-3 dark:text-white">
                  ID
                </TableCell>
                <TableCell isHeader className="p-3 dark:text-white">
                  Customer
                </TableCell>
                <TableCell isHeader className="p-3 dark:text-white">
                  Status
                </TableCell>
                <TableCell isHeader className="p-3 dark:text-white">
                  Total
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell className="p-3 text-sm text-gray-500" colSpan={4}>
                    No orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((o) => (
                  <TableRow
                    key={o.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                  >
                    <TableCell className="px-3 py-2 text-sm">
                      <Link
                        to={`/orders/${o.id}`}
                        className="font-medium text-brand-500 hover:text-brand-600"
                      >
                        #{o.id}
                      </Link>
                    </TableCell>
                    <TableCell className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200">
                      {o.customer_name}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-sm">
                      <Badge color={statusColor(o.status)}>{o.status}</Badge>
                    </TableCell>
                    <TableCell className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200">
                      {formatMoney(o.total_amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
