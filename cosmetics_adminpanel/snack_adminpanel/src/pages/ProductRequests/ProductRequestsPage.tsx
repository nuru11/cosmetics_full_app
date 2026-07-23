import { useEffect, useMemo, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import {
  fetchProductRequests,
  patchProductRequestStatus,
  PRODUCT_REQUEST_STATUS_VALUES,
  productRequestStatusLabel,
  type ProductRequestListRow,
} from "../../services/productRequest.service";
import { useTimeAgoTick } from "../../hooks/useTimeAgoTick";
import { formatAbsoluteDateTime, formatTimeAgo } from "../../utils/formatTimeAgo";

function shortId(id: string): string {
  return id.length > 8 ? id.slice(0, 8) : id;
}

function truncate(text: string, max = 80): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

export default function ProductRequestsPage() {
  const [rows, setRows] = useState<ProductRequestListRow[]>([]);
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
    fetchProductRequests({ limit: 100, offset: 0 })
      .then((res) => {
        if (!cancelled) {
          setRows(res.productRequests);
          setTotal(res.total);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load product requests. Sign in or check API permissions.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleStatusChange(
    requestId: string,
    nextStatus: string,
    prev: ProductRequestListRow
  ) {
    if (nextStatus === prev.status) return;
    setUpdatingId(requestId);
    setError(null);
    setRows((items) =>
      items.map((r) => (r.id === requestId ? { ...r, status: nextStatus } : r))
    );
    try {
      const updated = await patchProductRequestStatus(requestId, nextStatus);
      setRows((items) =>
        items.map((r) => (r.id === requestId ? { ...r, status: updated.status } : r))
      );
    } catch {
      setRows((items) => items.map((r) => (r.id === requestId ? prev : r)));
      setError("Could not update status. Try again or refresh.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <>
      <PageMeta
        title="Product requests | Cosmetics Admin"
        description="Customer product requests from the mobile app"
      />
      <PageBreadcrumb pageTitle="Product requests" />
      <div className="space-y-6">
        <ComponentCard
          title="Product requests"
          desc={
            total
              ? `Showing latest requests (${rows.length} of ${total}).`
              : "Products customers asked for from the mobile app."
          }
        >
          {error && (
            <p className="px-6 pb-4 text-sm text-red-500 dark:text-red-400">{error}</p>
          )}
          {loading ? (
            <p className="px-6 pb-6 text-sm text-gray-500 dark:text-gray-400">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="px-6 pb-6 text-sm text-gray-500 dark:text-gray-400">
              No product requests yet.
            </p>
          ) : (
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
                    <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium min-w-[220px]">
                      Description
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                      Photo
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                      Status
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                      Submitted
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <TableCell className="px-5 py-4 text-sm font-mono">
                        {shortId(row.id)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm">{row.customerName}</TableCell>
                      <TableCell className="px-5 py-4 text-sm">{row.phone}</TableCell>
                      <TableCell className="px-5 py-4 text-sm">{row.city}</TableCell>
                      <TableCell className="px-5 py-4 text-sm max-w-[280px]">
                        <span title={row.description}>{truncate(row.description)}</span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm">
                        {row.imageUrl ? (
                          <a
                            href={row.imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block"
                          >
                            <img
                              src={row.imageUrl}
                              alt="Reference"
                              className="h-12 w-12 rounded object-cover border border-gray-200 dark:border-gray-700"
                            />
                          </a>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm">
                        <select
                          className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900"
                          value={row.status}
                          disabled={updatingId === row.id}
                          onChange={(e) =>
                            handleStatusChange(row.id, e.target.value, row)
                          }
                        >
                          {PRODUCT_REQUEST_STATUS_VALUES.map((status) => (
                            <option key={status} value={status}>
                              {productRequestStatusLabel(status)}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell
                        className="px-5 py-4 text-sm whitespace-nowrap"
                        title={formatAbsoluteDateTime(row.createdAt)}
                      >
                        {formatTimeAgo(row.createdAt, timeAgoNow)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
