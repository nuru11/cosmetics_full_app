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
} from "../../services/product.service";
import { fetchCategories, type CategoryRow } from "../../services/category.service";
import { fileToDataUrl, resolveAssetUrl, uploadImageBase64 } from "../../services/upload.service";
import ProductVariantFields, {
  emptyVariant,
  type VariantFormState,
} from "./ProductVariantFields";

const GENDERS: ProductGender[] = ["UNISEX", "MALE", "FEMALE"];
const STATUSES: ProductStatus[] = ["ACTIVE", "INACTIVE", "UNAVAILABLE"];

function formatPrice(p: string | number | null | undefined): string {
  if (p == null) return "—";
  const n = typeof p === "number" ? p : Number(p);
  if (Number.isNaN(n)) return String(p);
  return n.toFixed(2);
}

function formatPriceRange(row: ProductRow): string {
  const min = row.displayPrice;
  const max = row.displayPriceMax;
  if (min == null) return "—";
  if (max != null && max !== min) return `${formatPrice(min)} – ${formatPrice(max)}`;
  return formatPrice(min);
}

function totalStock(row: ProductRow): number {
  return row.variants.reduce((sum, v) => sum + (v.stock ?? 0), 0);
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

function variantToFormState(v: ProductRow["variants"][number]): VariantFormState {
  return {
    id: v.id,
    variantDescription: v.variantDescription ?? "",
    size: v.size ?? "",
    color: v.color ?? "",
    productVersion: v.productVersion,
    price: String(v.price),
    stock: String(v.stock),
    sku: v.sku ?? "",
    imageUrls: v.variantImages.join("\n"),
    imageFile: null,
  };
}

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
  const [formGender, setFormGender] = useState<ProductGender>("UNISEX");
  const [formStatus, setFormStatus] = useState<ProductStatus>("ACTIVE");
  const [formBrand, setFormBrand] = useState("");
  const [formVariants, setFormVariants] = useState<VariantFormState[]>([emptyVariant()]);
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
    setFormGender("UNISEX");
    setFormStatus("ACTIVE");
    setFormBrand("");
    setFormVariants([emptyVariant()]);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(row: ProductRow) {
    setEditing(row);
    setFormName(row.productName);
    setFormCategoryId(row.categoryId);
    setFormDescription(row.productDescription ?? "");
    setFormGender(row.gender);
    setFormStatus(row.status);
    setFormBrand(row.brand ?? "");
    setFormVariants(
      row.variants.length > 0 ? row.variants.map(variantToFormState) : [emptyVariant()]
    );
    setFormError(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setFormError(null);
  }

  async function buildVariantImages(variant: VariantFormState): Promise<string[]> {
    const fromText = variant.imageUrls
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const images = [...fromText];
    if (variant.imageFile) {
      const dataUrl = await fileToDataUrl(variant.imageFile);
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
    if (formVariants.length === 0) {
      setFormError("Add at least one variant.");
      return;
    }

    for (let i = 0; i < formVariants.length; i += 1) {
      const v = formVariants[i];
      if (!v.variantDescription.trim() && !v.size.trim()) {
        setFormError(`Variant ${i + 1}: description or size is required.`);
        return;
      }
      const priceNum = Number(v.price.trim());
      if (!Number.isFinite(priceNum) || priceNum <= 0) {
        setFormError(`Variant ${i + 1}: enter a valid price greater than zero.`);
        return;
      }
      const stockNum = parseInt(v.stock.trim(), 10);
      if (!Number.isFinite(stockNum) || stockNum < 0) {
        setFormError(`Variant ${i + 1}: stock must be zero or greater.`);
        return;
      }
    }

    setFormSubmitting(true);
    setFormError(null);
    try {
      const variants = await Promise.all(
        formVariants.map(async (variant, index) => {
          const variantImages = await buildVariantImages(variant);
          return {
            ...(variant.id ? { id: variant.id } : {}),
            variantDescription: variant.variantDescription.trim() || null,
            size: variant.size.trim() || null,
            color: variant.color.trim() || null,
            productVersion: variant.productVersion,
            price: Number(variant.price.trim()),
            stock: parseInt(variant.stock.trim(), 10),
            sku: variant.sku.trim() || null,
            variantImages,
            sortOrder: index,
          };
        })
      );

      const payload = {
        productName,
        categoryId: formCategoryId,
        productDescription: formDescription.trim() || null,
        gender: formGender,
        status: formStatus,
        brand: formBrand.trim() || null,
        variants,
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
    if (!window.confirm(`Delete "${row.productName}" and all its variants?`)) return;
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
    const raw = row.displayImage ?? row.variants[0]?.variantImages[0];
    return raw ? resolveAssetUrl(raw) : null;
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
          desc="Add products with multiple variants (size, color, price, images)."
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
                    Variants
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-right text-sm font-medium">
                    Price range
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
                    <TableCell className="px-5 py-8 text-sm text-gray-500" colSpan={9}>
                      Loading…
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-sm text-gray-500" colSpan={9}>
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
                      <TableCell className="px-5 py-4 text-sm text-right text-gray-600 dark:text-gray-400">
                        {p.variantCount}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-right text-gray-800 dark:text-white/90">
                        {formatPriceRange(p)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {p.brand || "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {totalStock(p)}
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

      <Modal isOpen={formOpen} onClose={closeForm} className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              <Label>Description (shared)</Label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                className={inputClass}
              />
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

            <ProductVariantFields
              variants={formVariants}
              onChange={setFormVariants}
              disabled={formSubmitting}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={formSubmitting}>
                {formSubmitting ? "Saving…" : editing ? "Save changes" : "Create product"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
