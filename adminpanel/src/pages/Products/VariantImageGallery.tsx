import { useEffect, useMemo, useRef } from "react";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { resolveAssetUrl } from "../../services/upload.service";

export interface VariantImageGalleryProps {
  existingImages: string[];
  pendingFiles: File[];
  onChange: (patch: { existingImages?: string[]; pendingFiles?: File[] }) => void;
  disabled?: boolean;
}

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function setAsMain<T>(items: T[], index: number): T[] {
  if (index <= 0 || index >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(index, 1);
  next.unshift(item);
  return next;
}

export default function VariantImageGallery({
  existingImages,
  pendingFiles,
  onChange,
  disabled = false,
}: VariantImageGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pendingPreviews = useMemo(
    () => pendingFiles.map((file) => URL.createObjectURL(file)),
    [pendingFiles],
  );

  useEffect(() => {
    return () => {
      pendingPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [pendingPreviews]);

  const totalCount = existingImages.length + pendingFiles.length;

  function removeExisting(index: number) {
    onChange({ existingImages: existingImages.filter((_, i) => i !== index) });
  }

  function removePending(index: number) {
    onChange({ pendingFiles: pendingFiles.filter((_, i) => i !== index) });
  }

  function moveExisting(index: number, direction: -1 | 1) {
    onChange({ existingImages: moveItem(existingImages, index, index + direction) });
  }

  function setExistingAsMain(index: number) {
    onChange({ existingImages: setAsMain(existingImages, index) });
  }

  function movePending(index: number, direction: -1 | 1) {
    onChange({ pendingFiles: moveItem(pendingFiles, index, index + direction) });
  }

  function handleFilesSelected(files: FileList | null) {
    if (!files?.length) return;
    const accepted = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (accepted.length === 0) return;
    onChange({ pendingFiles: [...pendingFiles, ...accepted] });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <Label>Product images (optional)</Label>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        First image is used as the main thumbnail in product lists. Add multiple images for the
        product detail slider.
      </p>

      {totalCount === 0 && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          No images yet — upload below.
        </p>
      )}

      {totalCount > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {existingImages.map((url, index) => {
            const resolved = resolveAssetUrl(url);
            return (
              <div
                key={`existing-${url}-${index}`}
                className="relative rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900"
              >
                {index === 0 && (
                  <span className="absolute left-2 top-2 z-10 rounded bg-brand-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Main
                  </span>
                )}
                <div className="aspect-square overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                  {resolved ? (
                    <img src={resolved} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">
                      Invalid URL
                    </div>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {index > 0 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={disabled}
                      onClick={() => setExistingAsMain(index)}
                    >
                      Set as main
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={disabled || index === 0}
                    onClick={() => moveExisting(index, -1)}
                  >
                    ←
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={disabled || index === existingImages.length - 1}
                    onClick={() => moveExisting(index, 1)}
                  >
                    →
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={disabled}
                    onClick={() => removeExisting(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}

          {pendingFiles.map((file, index) => (
            <div
              key={`pending-${file.name}-${file.lastModified}-${index}`}
              className="relative rounded-lg border border-dashed border-brand-300 bg-brand-50/50 p-2 dark:border-brand-700 dark:bg-brand-500/5"
            >
              <span className="absolute left-2 top-2 z-10 rounded bg-gray-700 px-1.5 py-0.5 text-[10px] font-medium text-white">
                New
              </span>
              <div className="aspect-square overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                <img
                  src={pendingPreviews[index]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-1 truncate text-[10px] text-gray-500 dark:text-gray-400">
                {file.name}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={disabled || index === 0}
                  onClick={() => movePending(index, -1)}
                >
                  ←
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={disabled || index === pendingFiles.length - 1}
                  onClick={() => movePending(index, 1)}
                >
                  →
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={disabled}
                  onClick={() => removePending(index)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          disabled={disabled}
          onChange={(e) => handleFilesSelected(e.target.files)}
          className="block w-full text-sm text-gray-600 file:mr-3 file:rounded file:border-0 file:bg-brand-500 file:px-3 file:py-1.5 file:text-sm file:text-white dark:text-gray-400"
        />
        {totalCount > 0 && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {totalCount} image{totalCount === 1 ? "" : "s"} total
            {existingImages.length > 0 && pendingFiles.length > 0
              ? ` (${existingImages.length} saved, ${pendingFiles.length} pending upload)`
              : ""}
          </p>
        )}
      </div>
    </div>
  );
}
