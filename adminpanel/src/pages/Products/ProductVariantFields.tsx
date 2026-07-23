import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import type { ProductVersion } from "../../services/product.service";
import VariantImageGallery from "./VariantImageGallery";

const VERSIONS: ProductVersion[] = ["ORIGINAL", "TWO_LEVEL", "PREMIUM"];

export interface VariantFormState {
  id?: string;
  variantDescription: string;
  size: string;
  color: string;
  productVersion: ProductVersion;
  price: string;
  inStock: boolean;
  sku: string;
  existingImages: string[];
  pendingFiles: File[];
}

export function emptyVariant(): VariantFormState {
  return {
    variantDescription: "",
    size: "",
    color: "",
    productVersion: "ORIGINAL",
    price: "",
    inStock: true,
    sku: "",
    existingImages: [],
    pendingFiles: [],
  };
}

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white";

interface ProductVariantFieldsProps {
  variants: VariantFormState[];
  onChange: (variants: VariantFormState[]) => void;
  disabled?: boolean;
}

export default function ProductVariantFields({
  variants,
  onChange,
  disabled = false,
}: ProductVariantFieldsProps) {
  function updateVariant(index: number, patch: Partial<VariantFormState>) {
    onChange(variants.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  function removeVariant(index: number) {
    if (variants.length <= 1) return;
    onChange(variants.filter((_, i) => i !== index));
  }

  function addVariant() {
    onChange([...variants, emptyVariant()]);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-white">Variants</h4>
        <Button type="button" size="sm" variant="outline" onClick={addVariant} disabled={disabled}>
          + Add variant
        </Button>
      </div>

      {variants.map((variant, index) => (
        <div
          key={variant.id ?? `new-${index}`}
          className="space-y-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Variant {index + 1}
              </p>
              {variant.existingImages.length + variant.pendingFiles.length > 0 && (
                <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {variant.existingImages.length + variant.pendingFiles.length} image
                  {variant.existingImages.length + variant.pendingFiles.length === 1 ? "" : "s"}
                </span>
              )}
            </div>
            {variants.length > 1 && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={disabled}
                onClick={() => removeVariant(index)}
              >
                Remove
              </Button>
            )}
          </div>

          <div>
            <Label>Variant description</Label>
            <input
              type="text"
              placeholder='e.g. "3.3 Oz EDT (Tester)"'
              value={variant.variantDescription}
              disabled={disabled}
              onChange={(e) => updateVariant(index, { variantDescription: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Size</Label>
              <input
                type="text"
                placeholder='e.g. "3.3 Oz"'
                value={variant.size}
                disabled={disabled}
                onChange={(e) => updateVariant(index, { size: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <Label>Color (optional)</Label>
              <input
                type="text"
                value={variant.color}
                disabled={disabled}
                onChange={(e) => updateVariant(index, { color: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Version</Label>
              <select
                value={variant.productVersion}
                disabled={disabled}
                onChange={(e) =>
                  updateVariant(index, { productVersion: e.target.value as ProductVersion })
                }
                className={inputClass}
              >
                {VERSIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>SKU (optional)</Label>
              <input
                type="text"
                value={variant.sku}
                disabled={disabled}
                onChange={(e) => updateVariant(index, { sku: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price</Label>
              <input
                type="text"
                inputMode="decimal"
                required
                value={variant.price}
                disabled={disabled}
                onChange={(e) => updateVariant(index, { price: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={variant.inStock}
                  disabled={disabled}
                  onChange={(e) => updateVariant(index, { inStock: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                In stock
              </label>
            </div>
          </div>

          <VariantImageGallery
            existingImages={variant.existingImages}
            pendingFiles={variant.pendingFiles}
            disabled={disabled}
            onChange={(patch) => updateVariant(index, patch)}
          />
        </div>
      ))}
    </div>
  );
}
