import { useCallback, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
  type CategoryRow,
} from "../../services/category.service";
import { fileToDataUrl, resolveAssetUrl, uploadImageBase64 } from "../../services/upload.service";

function apiErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { data?: { error?: string }; status?: number } }).response;
    const msg = res?.data?.error;
    if (typeof msg === "string" && msg.trim()) return msg;
    if (res?.status === 409) {
      return "Cannot delete: products still use this category. Deactivate it instead.";
    }
  }
  return fallback;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white";

export default function CategoriesPage() {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formRemoveImage, setFormRemoveImage] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategories(false);
      setRows(data);
    } catch {
      setError("Could not load categories. Check API URL and sign in as admin.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setFormName("");
    setFormDescription("");
    setFormActive(true);
    setFormImage(null);
    setFormRemoveImage(false);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(row: CategoryRow) {
    setEditing(row);
    setFormName(row.name);
    setFormDescription(row.description ?? "");
    setFormActive(row.isActive !== false);
    setFormImage(null);
    setFormRemoveImage(false);
    setFormError(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setFormError(null);
    setFormImage(null);
    setFormRemoveImage(false);
  }

  async function resolveImageUrl(): Promise<string | null | undefined> {
    if (formRemoveImage) return null;
    if (formImage) {
      const dataUrl = await fileToDataUrl(formImage);
      return uploadImageBase64(dataUrl, "categories");
    }
    if (editing) return undefined;
    return null;
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = formName.trim();
    if (!name) {
      setFormError("Name is required.");
      return;
    }

    setFormSubmitting(true);
    setFormError(null);
    try {
      const imageUrl = await resolveImageUrl();
      const payload = {
        name,
        description: formDescription.trim() || null,
        isActive: formActive,
        ...(imageUrl !== undefined ? { imageUrl } : {}),
      };

      if (editing) {
        const updated = await updateCategory(editing.id, payload);
        setRows((prev) => prev.map((r) => (r.id === editing.id ? updated : r)));
      } else {
        const created = await createCategory(payload);
        setRows((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      }
      closeForm();
    } catch (err) {
      setFormError(apiErrorMessage(err, "Could not save category. Try again."));
    } finally {
      setFormSubmitting(false);
    }
  }

  async function handleDelete(row: CategoryRow) {
    if (!window.confirm(`Delete "${row.name}"?`)) return;
    setSavingId(row.id);
    setError(null);
    try {
      await deleteCategory(row.id);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (err) {
      setError(apiErrorMessage(err, "Could not delete category."));
    } finally {
      setSavingId(null);
    }
  }

  async function handleActiveToggle(row: CategoryRow) {
    const isCurrentlyActive = row.isActive !== false;
    const next = !isCurrentlyActive;
    setSavingId(row.id);
    setError(null);
    try {
      const updated = await updateCategory(row.id, { isActive: next });
      setRows((prev) => prev.map((r) => (r.id === row.id ? updated : r)));
    } catch {
      setError("Could not update status. Try again.");
      await load();
    } finally {
      setSavingId(null);
    }
  }

  const previewUrl = (row: CategoryRow) => resolveAssetUrl(row.imageUrl);

  const editingPreview =
    editing && !formRemoveImage && !formImage ? resolveAssetUrl(editing.imageUrl) : null;

  return (
    <>
      <PageMeta
        title="Categories | Cosmetics Admin"
        description="Manage product categories and images"
      />
      <PageBreadcrumb pageTitle="Categories" />
      <div className="space-y-6">
        <ComponentCard
          title="Categories"
          desc="Create categories for your catalog. Upload an image for each category."
        >
          <div className="space-y-2 px-6 pb-4">
            {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
            <div className="flex justify-end">
              <Button size="sm" onClick={openCreate}>
                Add category
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-gray-800">
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                    Slug
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                    Active
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                    Image
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 dark:divide-gray-800">
                {loading ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-sm text-gray-500" colSpan={5}>
                      Loading…
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-sm text-gray-500" colSpan={5}>
                      No categories yet. Add one to organize products.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((c) => (
                    <TableRow key={c.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                      <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                        {c.name}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {c.slug}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            checked={c.isActive !== false}
                            disabled={savingId === c.id}
                            onChange={() => handleActiveToggle(c)}
                          />
                          {c.isActive !== false ? "Yes" : "No"}
                        </label>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm">
                        {previewUrl(c) ? (
                          <img
                            src={previewUrl(c)!}
                            alt=""
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={savingId === c.id}
                            onClick={() => handleDelete(c)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </ComponentCard>
      </div>

      <Modal isOpen={formOpen} onClose={closeForm} className="max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            {editing ? "Edit category" : "Add category"}
          </h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {formError && (
              <p className="text-sm text-red-500 dark:text-red-400">{formError}</p>
            )}
            <div>
              <Label>Name</Label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                className={inputClass}
              />
            </div>
            <div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                />
                Active (visible in catalog)
              </label>
            </div>
            <div>
              <Label>Category image (optional)</Label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  setFormImage(e.target.files?.[0] ?? null);
                  if (e.target.files?.[0]) setFormRemoveImage(false);
                }}
                className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded file:border-0 file:bg-brand-500 file:px-3 file:py-1.5 file:text-sm file:text-white"
              />
              {editingPreview && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={editingPreview}
                    alt=""
                    className="h-16 w-16 rounded object-cover"
                  />
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={formRemoveImage}
                      onChange={(e) => setFormRemoveImage(e.target.checked)}
                    />
                    Remove image
                  </label>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={formSubmitting}>
                {formSubmitting ? "Saving…" : editing ? "Save changes" : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}