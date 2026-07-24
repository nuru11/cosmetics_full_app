import { useCallback, useEffect, useRef, useState } from "react";
import { ProductImage } from "@/components/shared/ProductImage";
import { cn } from "@/lib/utils";

const heroFrameClass =
  "aspect-square w-full max-h-[70vh] lg:max-h-[min(520px,70vh)] lg:max-w-[520px]";

function ThumbnailButton({
  imageUrl,
  alt,
  index,
  selected,
  onSelect,
  className,
}: {
  imageUrl: string;
  alt: string;
  index: number;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={`${alt} image ${index + 1}`}
      aria-current={selected ? "true" : undefined}
      onClick={onSelect}
      className={cn(
        "shrink-0 overflow-hidden rounded-lg border-2 bg-card-header-beige transition-colors",
        selected ? "border-brand-blue" : "border-divider-grey",
        className,
      )}
    >
      <ProductImage
        alt=""
        imageUrl={imageUrl}
        fit="contain"
        heightClass="h-full w-full"
        className="pointer-events-none"
      />
    </button>
  );
}

export function ProductDetailHero({
  images,
  alt,
  className,
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasMultiple = images.length > 1;

  useEffect(() => {
    setCurrentIndex(0);
    scrollRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [images]);

  const updateIndexFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || el.clientWidth === 0) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setCurrentIndex(Math.min(Math.max(index, 0), images.length - 1));
  }, [images.length]);

  const goToImage = (index: number) => {
    setCurrentIndex(index);
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
    }
  };

  const mainImageUrl = images[currentIndex] ?? images[0];

  if (images.length === 0) {
    return (
      <div className={cn("bg-cream", className)}>
        <div className={cn("mx-auto rounded-lg", heroFrameClass)}>
          <ProductImage
            alt={alt}
            imageUrl={null}
            fit="contain"
            heightClass="h-full w-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-cream", className)}>
      {/* Mobile: swipe carousel */}
      <div className="lg:hidden">
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={updateIndexFromScroll}
            className={cn(
              "flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              heroFrameClass,
            )}
          >
            {images.map((imageUrl, index) => (
              <div
                key={`${imageUrl}-${index}`}
                className="h-full w-full shrink-0 snap-center rounded-lg bg-card-header-beige"
              >
                <ProductImage
                  alt={`${alt} ${index + 1}`}
                  imageUrl={imageUrl}
                  fit="contain"
                  heightClass="h-full w-full"
                />
              </div>
            ))}
          </div>

          {hasMultiple ? (
            <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full shadow-sm transition-all duration-200",
                    index === currentIndex
                      ? "w-[18px] bg-brand-blue"
                      : "w-1.5 bg-white/70",
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>

        {hasMultiple ? (
          <div className="border-t border-divider-grey/40 bg-white">
            <div className="flex gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {images.map((imageUrl, index) => (
                <ThumbnailButton
                  key={`mobile-thumb-${imageUrl}-${index}`}
                  imageUrl={imageUrl}
                  alt={alt}
                  index={index}
                  selected={index === currentIndex}
                  onSelect={() => goToImage(index)}
                  className="h-14 w-14"
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Desktop: vertical thumbs + main image */}
      <div className="hidden lg:flex lg:items-start lg:justify-center lg:gap-4">
        {hasMultiple ? (
          <div className="flex max-h-[min(520px,70vh)] flex-col gap-2 overflow-y-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {images.map((imageUrl, index) => (
              <ThumbnailButton
                key={`desktop-thumb-${imageUrl}-${index}`}
                imageUrl={imageUrl}
                alt={alt}
                index={index}
                selected={index === currentIndex}
                onSelect={() => setCurrentIndex(index)}
                className="h-16 w-16"
              />
            ))}
          </div>
        ) : null}

        <div
          className={cn(
            "overflow-hidden rounded-lg border border-divider-grey/50 bg-card-header-beige shadow-sm",
            heroFrameClass,
          )}
        >
          <ProductImage
            alt={`${alt} ${currentIndex + 1}`}
            imageUrl={mainImageUrl}
            fit="contain"
            heightClass="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
