import PageMeta from "../../components/common/PageMeta";
import CosmeticsMetrics from "../../components/dashboard/CosmeticsMetrics";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | Cosmetics Admin"
        description="Cosmetics store overview"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Overview
          </h2>
          <CosmeticsMetrics />
        </div>
      </div>
    </>
  );
}
