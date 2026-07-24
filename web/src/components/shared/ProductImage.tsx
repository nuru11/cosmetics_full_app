import { useState } from "react";
import { resolveImageUrl } from "@/lib/imageUrl";
import { cn } from "@/lib/utils";

export function ProductImage({
  imageUrl,
  alt,
  className,
  heightClass = "h-40",
  fit = "cover",
}: {
  imageUrl?: string | null;
  alt: string;
  className?: string;
  heightClass?: string;
  fit?: "cover" | "contain";
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const src = resolveImageUrl(imageUrl);
  const isContain = fit === "contain";

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex w-full items-center justify-center bg-card-header-beige text-xs text-text-muted",
          heightClass,
          className,
        )}
      >
        No image
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        isContain && "bg-card-header-beige",
        heightClass,
        className,
      )}
    >
      {!loaded ? <div className="absolute inset-0 shimmer" /> : null}
      <img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-center transition-opacity",
          isContain ? "object-contain" : "object-cover",
          loaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
