import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckoutModal, Toast } from "@/components/cart/CheckoutModal";
import { PageHeader } from "@/components/layout/AppShell";
import { ProductImage } from "@/components/shared/ProductImage";
import { EmptyState, PageLoader } from "@/components/shared/LoadingState";
import { formatPrice } from "@/lib/formatPrice";
import { variantPrimaryImage } from "@/lib/parsers";
import { buildVariantIndex, fetchProducts } from "@/services/catalogService";
import { checkoutOrder } from "@/services/orderService";
import { useCartStore } from "@/stores/cartStore";
import { useContactStore } from "@/stores/contactStore";
import type { Product } from "@/types";

interface CartEntry {
  variantId: string;
  quantity: number;
  product: Product;
  variant: Product["variants"][number];
}

export default function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const pruneInvalid = useCartStore((s) => s.pruneInvalid);
  const contact = useContactStore((s) => s.contact);
  const setContact = useContactStore((s) => s.setContact);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const loaded = await fetchProducts();
        setProducts(loaded);
        const validIds = new Set<string>();
        for (const product of loaded) {
          for (const variant of product.variants) {
            validIds.add(variant.id);
          }
        }
        pruneInvalid(validIds);
      } finally {
        setLoading(false);
      }
    })();
  }, [pruneInvalid]);

  const index = useMemo(() => buildVariantIndex(products), [products]);

  const entries: CartEntry[] = useMemo(
    () =>
      lines
        .map((line) => {
          const match = index.get(line.variantId);
          if (!match) return null;
          return {
            variantId: line.variantId,
            quantity: line.quantity,
            product: match.product,
            variant: match.variant,
          };
        })
        .filter((entry): entry is CartEntry => entry !== null),
    [lines, index],
  );

  const subtotal = entries.reduce(
    (sum, entry) => sum + entry.variant.price * entry.quantity,
    0,
  );

  const handleCheckout = async (nextContact: typeof contact) => {
    setSubmitting(true);
    try {
      setContact(nextContact);
      await checkoutOrder({
        items: entries.map((entry) => ({
          variantId: entry.variantId,
          quantity: entry.quantity,
        })),
        customerName: nextContact.name.trim(),
        phone: nextContact.phone.trim(),
        city: nextContact.city.trim(),
      });
      clear();
      setCheckoutOpen(false);
      setToast(t("checkout.order_placed_message"));
      navigate("/orders");
    } catch {
      setToast(t("checkout.failed_message"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  const totalQty = entries.reduce((sum, entry) => sum + entry.quantity, 0);

  return (
    <div className="pb-8">
      <PageHeader
        title={t("cart.your_bag")}
        backTo="/"
        action={
          entries.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(t("cart.clear_bag_message"))) clear();
              }}
              className="text-sm font-semibold text-accent-red"
            >
              {t("cart.clear_bag")}
            </button>
          ) : null
        }
      />

      {entries.length === 0 ? (
        <EmptyState
          title={t("cart.empty_title")}
          message={t("cart.empty_message")}
          action={
            <Link
              to="/"
              className="rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white"
            >
              {t("cart.continue_shopping")}
            </Link>
          }
        />
      ) : (
        <div className="mx-auto max-w-3xl px-4 py-4">
          <p className="text-sm text-text-muted">
            {entries.length === 1
              ? t("cart.one_item", { count: totalQty })
              : t("cart.n_items", { count: totalQty })}
          </p>

          <div className="mt-4 space-y-4">
            {entries.map((entry) => (
              <div key={entry.variantId} className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm">
                <ProductImage
                  alt={entry.product.productName}
                  imageUrl={variantPrimaryImage(entry.variant) ?? entry.product.displayImage}
                  heightClass="h-24 w-24 shrink-0"
                  className="w-24 rounded-lg"
                />
                <div className="flex flex-1 flex-col">
                  <h3 className="line-clamp-2 text-sm font-semibold">{entry.product.productName}</h3>
                  <p className="mt-1 text-sm font-bold">{formatPrice(entry.variant.price)}</p>
                  <p className="text-xs text-text-muted">
                    {t("cart.each_price", { price: formatPrice(entry.variant.price) })}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity(entry.variantId, entry.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border"
                      >
                        -
                      </button>
                      <span className="min-w-6 text-center text-sm font-semibold">
                        {entry.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(entry.variantId, entry.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(entry.variantId)}
                      className="text-xs font-semibold text-accent-red"
                    >
                      {t("common.remove")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">{t("cart.subtotal")}</span>
              <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
            </div>
            <button
              type="button"
              onClick={() => setCheckoutOpen(true)}
              className="mt-4 w-full rounded-full bg-brand-blue py-3 text-sm font-semibold text-white"
            >
              {t("cart.proceed_checkout")}
            </button>
          </div>
        </div>
      )}

      <CheckoutModal
        open={checkoutOpen}
        initialContact={contact}
        isSubmitting={submitting}
        onClose={() => setCheckoutOpen(false)}
        onSubmit={handleCheckout}
      />
      <Toast message={toast} visible={Boolean(toast)} onClose={() => setToast("")} />
    </div>
  );
}
