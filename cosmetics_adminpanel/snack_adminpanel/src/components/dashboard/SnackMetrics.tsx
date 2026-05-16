import { useEffect, useState } from "react";
import { BoxCubeIcon, DollarLineIcon, GridIcon, TaskIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
import { getSnackOverview } from "../../services/snackDashboard.service";

export default function SnackMetrics() {
  const [data, setData] = useState<{
    productCount: number;
    orderTotal: number;
    pendingInRecentBatch: number;
    revenueRecentOrders: number;
  } | null>(null);

  useEffect(() => {
    getSnackOverview()
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const iconClass = "size-6 text-gray-700 dark:text-white";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border bg-white p-5 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxCubeIcon className={iconClass} />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-white">Menu items</span>
            <h4 className="mt-2 font-bold text-title-sm dark:text-white">
              {data?.productCount ?? "—"}
            </h4>
          </div>
          <Badge color="primary">Catalog</Badge>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <TaskIcon className={iconClass} />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-white">Total orders</span>
            <h4 className="mt-2 font-bold text-title-sm dark:text-white">
              {data?.orderTotal ?? "—"}
            </h4>
          </div>
          <Badge color="info">All time</Badge>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GridIcon className={iconClass} />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-white">Pending (recent batch)</span>
            <h4 className="mt-2 font-bold text-title-sm dark:text-white">
              {data?.pendingInRecentBatch ?? "—"}
            </h4>
          </div>
          <Badge color="warning">Latest 200</Badge>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <DollarLineIcon className={iconClass} />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-white">Revenue (recent)</span>
            <h4 className="mt-2 font-bold text-title-sm dark:text-white">
              {data != null ? data.revenueRecentOrders.toFixed(2) : "—"}
            </h4>
          </div>
          <Badge color="success">Sum</Badge>
        </div>
      </div>
    </div>
  );
}
