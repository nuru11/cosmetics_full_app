export const tabRoutes = [
  { to: "/", name: "home", labelKey: "nav.home" },
  { to: "/saved", name: "saved", labelKey: "nav.saved" },
  { to: "/orders", name: "orders", labelKey: "nav.orders" },
  { to: "/profile", name: "profile", labelKey: "nav.profile" },
] as const;

export const footerLinks = [
  ...tabRoutes.map(({ to, labelKey }) => ({ to, labelKey })),
  { to: "/search", labelKey: "common.search" },
  { to: "/product-request", labelKey: "products.ask_for_product" },
  { to: "/cart", labelKey: "footer.cart" },
] as const;

export const shopFooterLinks = [
  ...tabRoutes.map(({ to, labelKey }) => ({ to, labelKey })),
  { to: "/search", labelKey: "common.search" },
] as const;

export const helpFooterLinks = [
  { to: "/product-request", labelKey: "products.ask_for_product" },
  { to: "/cart", labelKey: "footer.cart" },
] as const;

export const mobileFooterLinks = [
  ...tabRoutes.map(({ to, labelKey }) => ({ to, labelKey })),
  { to: "/search", labelKey: "common.search" },
  { to: "/cart", labelKey: "footer.cart" },
] as const;
