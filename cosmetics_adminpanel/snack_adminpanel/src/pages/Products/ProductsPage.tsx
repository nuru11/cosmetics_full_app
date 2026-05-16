import { useCallback, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import {
  createProduct,
  deleteProduct,
  fetchAdminProducts,
  updateProduct,
  type ProductGender,
  type ProductRow,
  type ProductStatus,
  type ProductVersion,
} from "../../services/product.service";
import { fetchCategories, type CategoryRow } from "../../services/category.service";
import { fileToDataUrl, resolveAssetUrl, uploadImageBase64 } from "../../services/upload.service";

const GENDERS: ProductGender[] = ["UNISEX", "MALE", "FEMALE"];
const STATUSES: ProductStatus[] = ["ACTIVE", "INACTIVE", "UNAVAILABLE"];
const VERSIONS: ProductVersion[] = ["ORIGINAL", "TWO_LEVEL", "PREMIUM"];

function formatPrice(p: string | number): string {
  const n = typeof p === "number" ? p : Number(p);
  if (Number.isNaN(n)) return String(p);
  return n.toFixed(2);
}

function apiErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { data?: { error?: string } } }).response;
    const msg = res?.data?.error;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return fallback;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white";

export default function ProductsPage() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [formName, setFormName] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState("0");
  const [formSku, setFormSku] = useState("");
  const [formGender, setFormGender] = useState<ProductGender>("UNISEX");
  const [formStatus, setFormStatus] = useState<ProductStatus>("ACTIVE");
  const [formVersion, setFormVersion] = useState<ProductVersion>("ORIGINAL");
  const [formBrand, setFormBrand] = useState("");
  const [formColor, setFormColor] = useState("");
  const [formSize, setFormSize] = useState("");
  const [formImageUrls, setFormImageUrls] = useState("");
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [products, cats] = await Promise.all([
        fetchAdminProducts(),
        fetchCategories(false),
      ]);
      setRows(products);
      setCategories(cats);
      if (!formCategoryId && cats[0]) setFormCategoryId(cats[0].id);
    } catch {
      setError("Could not load products. Check API URL and sign in as admin.");
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
    setFormCategoryId(categories[0]?.id ?? "");
    setFormDescription("");
    setFormPrice("");
    setFormStock("0");
    setFormSku("");
    setFormGender("UNISEX");
    setFormStatus("ACTIVE");
    setFormVersion("ORIGINAL");
    setFormBrand("");
    setFormColor("");
    setFormSize("");
    setFormImageUrls("");
    setFormImage(null);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(row: ProductRow) {
    setEditing(row);
    setFormName(row.productName);
    setFormCategoryId(row.categoryId);
    setFormDescription(row.productDescription ?? "");
    setFormPrice(String(row.price));
    setFormStock(String(row.stock));
    setFormSku(row.sku ?? "");
    setFormGender(row.gender);
    setFormStatus(row.status);
    setFormVersion(row.productVersion);
    setFormBrand(row.brand ?? "");
    setFormColor(row.color ?? "");
    setFormSize(row.size ?? "");
    setFormImageUrls(row.productImages.join("\n"));
    setFormImage(null);
    setFormError(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setFormError(null);
    setFormImage(null);
  }

  async function buildProductImages(): Promise<string[]> {
    const fromText = formImageUrls
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const images = [...fromText];
    if (formImage) {
      const dataUrl = await fileToDataUrl(formImage);
      const url = await uploadImageBase64(dataUrl, "products");
      images.push(url);
    }
    return images;
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    const productName = formName.trim();
    if (!productName) {
      setFormError("Product name is required.");
      return;
    }
    if (!formCategoryId) {
      setFormError("Select a category. Run database seed if none exist.");
      return;
    }
    const priceNum = Number(formPrice.trim());
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setFormError("Enter a valid price greater than zero.");
      return;
    }
    const stockNum = parseInt(formStock.trim(), 10);
    if (!Number.isFinite(stockNum) || stockNum < 0) {
      setFormError("Stock must be zero or greater.");
      return;
    }

    setFormSubmitting(true);
    setFormError(null);
    try {
      const productImages = await buildProductImages();
      const payload = {
        productName,
        categoryId: formCategoryId,
        productDescription: formDescription.trim() || null,
        price: priceNum,
        stock: stockNum,
        sku: formSku.trim() || null,
        gender: formGender,
        status: formStatus,
        productVersion: formVersion,
        brand: formBrand.trim() || null,
        color: formColor.trim() || null,
        size: formSize.trim() || null,
        productImages,
      };

      if (editing) {
        const updated = await updateProduct(editing.id, payload);
        setRows((prev) => prev.map((r) => (r.id === editing.id ? updated : r)));
      } else {
        const created = await createProduct(payload);
        setRows((prev) => [created, ...prev]);
      }
      closeForm();
    } catch (err) {
      setFormError(apiErrorMessage(err, "Could not save product. Try again."));
    } finally {
      setFormSubmitting(false);
    }
  }

  async function handleDelete(row: ProductRow) {
    if (!window.confirm(`Delete "${row.productName}"?`)) return;
    setSavingId(row.id);
    setError(null);
    try {
      await deleteProduct(row.id);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (err) {
      setError(apiErrorMessage(err, "Could not delete product."));
    } finally {
      setSavingId(null);
    }
  }

  async function handleStatusChange(row: ProductRow, status: ProductStatus) {
    if (row.status === status) return;
    setSavingId(row.id);
    setError(null);
    try {
      const updated = await updateProduct(row.id, { status });
      setRows((prev) => prev.map((r) => (r.id === row.id ? updated : r)));
    } catch {
      setError("Could not update status. Try again.");
      await load();
    } finally {
      setSavingId(null);
    }
  }

  const firstImage = (row: ProductRow) => {
    const raw = row.productImages[0];
    return resolveAssetUrl(raw);
  };

  return (
    <>
      <PageMeta
        title="Products | Cosmetics Admin"
        description="Manage cosmetics product catalog"
      />
      <PageBreadcrumb pageTitle="Products" />
      <div className="space-y-6">
        <ComponentCard
          title="Product catalog"
          desc="Add and edit products for your cosmetics store."
        >
          <div className="space-y-2 px-6 pb-4">
            {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
            {categories.length === 0 && !loading && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                No categories found. Run backend seed: npm run db:seed
              </p>
            )}
            <div className="flex justify-end">
              <Button size="sm" onClick={openCreate} disabled={categories.length === 0}>
                Add product
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
                    Category
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-right text-sm font-medium">
                    Price
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                    Brand
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                    Stock
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium">
                    Status
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
                    <TableCell className="px-5 py-8 text-sm text-gray-500" colSpan={8}>
                      Loading…
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-sm text-gray-500" colSpan={8}>
                      No products yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((p) => (
                    <TableRow key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                      <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                        {p.productName}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {p.categoryName}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-right text-gray-800 dark:text-white/90">
                        {formatPrice(p.price)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {p.brand || "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {p.stock}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <select
                          className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                          value={p.status}
                          disabled={savingId === p.id}
                          onChange={(e) =>
                            handleStatusChange(p, e.target.value as ProductStatus)
                          }
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm">
                        {firstImage(p) ? (
                          <img
                            src={firstImage(p)!}
                            alt=""
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={savingId === p.id}
                            onClick={() => handleDelete(p)}
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
            {editing ? "Edit product" : "Add product"}
          </h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {formError && (
              <p className="text-sm text-red-500 dark:text-red-400">{formError}</p>
            )}
            <div>
              <Label>Product name</Label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <Label>Category</Label>
              <select
                required
                value={formCategoryId}
                onChange={(e) => setFormCategoryId(e.target.value)}
                className={inputClass}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price</Label>
                <input
                  type="text"
                  inputMode="decimal"
                  required
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <Label>Stock</Label>
                <input
                  type="number"
                  min={0}
                  value={formStock}
                  onChange={(e) => setFormStock(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Gender</Label>
                <select
                  value={formGender}
                  onChange={(e) => setFormGender(e.target.value as ProductGender)}
                  className={inputClass}
                >
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Version</Label>
                <select
                  value={formVersion}
                  onChange={(e) => setFormVersion(e.target.value as ProductVersion)}
                  className={inputClass}
                >
                  {VERSIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as ProductStatus)}
                  className={inputClass}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>SKU (optional)</Label>
                <input
                  type="text"
                  value={formSku}
                  onChange={(e) => setFormSku(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <Label>Brand (optional)</Label>
              <input
                type="text"
                value={formBrand}
                onChange={(e) => setFormBrand(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Color (optional)</Label>
                <input
                  type="text"
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <Label>Size (optional)</Label>
                <input
                  type="text"
                  value={formSize}
                  onChange={(e) => setFormSize(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <Label>Image URLs (one per line, optional)</Label>
              <textarea
                value={formImageUrls}
                onChange={(e) => setFormImageUrls(e.target.value)}
                rows={2}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
            <div>
              <Label>Upload image (optional)</Label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={(e) => setFormImage(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded file:border-0 file:bg-brand-500 file:px-3 file:py-1.5 file:text-sm file:text-white"
              />
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
