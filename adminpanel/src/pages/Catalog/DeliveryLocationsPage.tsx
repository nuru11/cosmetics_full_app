import { useCallback, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import {
  createDeliveryRow,
  deleteDeliveryRow,
  fetchDeliveryAdmin,
  updateDeliveryRow,
  type DeliveryKind,
  type DeliveryRowAdmin,
} from "../../services/deliveryCatalog.service";

const TABS: { id: DeliveryKind; label: string }[] = [
  { id: "areas", label: "Areas" },
  { id: "sub-cities", label: "Sub-cities" },
  { id: "buildings", label: "Buildings" },
];

export default function DeliveryLocationsPage() {
  const [tab, setTab] = useState<DeliveryKind>("areas");
  const [rows, setRows] = useState<DeliveryRowAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDeliveryAdmin(tab);
      setRows(data);
    } catch {
      setError("Could not load delivery options. Sign in as admin or check the API.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    let cancelled = false;
    load().then(() => {
      if (cancelled) return;
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  function resetForm() {
    setName("");
    setSortOrder(0);
    setIsActive(true);
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId != null) {
        await updateDeliveryRow(tab, editingId, {
          name: trimmed,
          sort_order: sortOrder,
          is_active: isActive,
        });
      } else {
        await createDeliveryRow(tab, {
          name: trimmed,
          sort_order: sortOrder,
          is_active: isActive,
        });
      }
      resetForm();
      await load();
    } catch {
      setError("Save failed. Try again.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(row: DeliveryRowAdmin) {
    setEditingId(row.id);
    setName(row.name);
    setSortOrder(row.sort_order);
    setIsActive(row.is_active === 1);
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this row? Orders keep their saved text.")) return;
    setSaving(true);
    setError(null);
    try {
      await deleteDeliveryRow(tab, id);
      if (editingId === id) resetForm();
      await load();
    } catch {
      setError("Delete failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageMeta
        title="Delivery locations | Snack Admin"
        description="Manage area, sub-city, and building dropdown options for checkout"
      />
      <PageBreadcrumb pageTitle="Delivery locations" />
      <div className="space-y-6">
        <ComponentCard
          title="Delivery catalog"
          desc="These lists appear as dropdowns in the mobile checkout app (active items only)."
        >
          <div className="border-b border-gray-200 px-6 dark:border-gray-800">
            <nav className="-mb-px flex flex-wrap gap-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTab(t.id);
                    resetForm();
                  }}
                  className={`border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                    tab === t.id
                      ? "border-brand-500 text-brand-600 dark:border-brand-400 dark:text-brand-300"
                      : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          {error && (
            <p className="px-6 pt-4 text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <p className="mb-3 text-sm font-medium text-gray-800 dark:text-white/90">
              {editingId != null ? `Edit #${editingId}` : "Add new"}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
              <div className="min-w-[200px] flex-1">
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  placeholder="Label shown in the app"
                  disabled={saving}
                />
              </div>
              <div className="w-28">
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Sort</label>
                <input
                  type="number"
                  min={0}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  disabled={saving}
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 pb-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={saving}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                Active
              </label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                >
                  {saving ? "Saving…" : editingId != null ? "Update" : "Add"}
                </button>
                {editingId != null && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={resetForm}
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-gray-800">
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-right text-sm font-medium">
                    Sort
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                    Active
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-right text-sm font-medium">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 dark:divide-gray-800">
                {loading ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-sm text-gray-500" colSpan={4}>
                      Loading…
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-sm text-gray-500" colSpan={4}>
                      No rows yet. Add one above.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                      <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                        {row.name}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {row.sort_order}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {row.is_active === 1 ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => startEdit(row)}
                          disabled={saving}
                          className="mr-3 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          disabled={saving}
                          className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          Delete
                        </button>
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
