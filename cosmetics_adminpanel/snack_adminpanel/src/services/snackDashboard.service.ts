import { fetchOrders } from "./order.service";
import { fetchProducts } from "./product.service";

export interface SnackOverview {
  productCount: number;
  orderTotal: number;
  pendingInRecentBatch: number;
  /** Sum of `total_amount` for the most recent orders returned (up to 200). */
  revenueRecentOrders: number;
}

/**
 * Lightweight stats for the admin home screen (parallel fetches).
 * Pending and revenue are computed from the latest order page only.
 */
export async function getSnackOverview(): Promise<SnackOverview> {
  const [products, ordersPage] = await Promise.all([
    fetchProducts(),
    fetchOrders({ limit: 200, offset: 0 }),
  ]);

  const orders = ordersPage.orders;
  const pendingInRecentBatch = orders.filter((o) => o.status === "pending").length;
  let revenueRecentOrders = 0;
  for (const o of orders) {
    const n = Number(o.total_amount);
    if (!Number.isNaN(n)) revenueRecentOrders += n;
  }

  return {
    productCount: products.length,
    orderTotal: ordersPage.total,
    pendingInRecentBatch,
    revenueRecentOrders,
  };
}
