import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { getAuthUser } from "../utils/auth";

export default function UserProfiles() {
  const authUser = getAuthUser();

  const profileRows = [
    { label: "Full Name", value: authUser?.fullName || "—" },
    { label: "Username", value: authUser?.username || "—" },
    { label: "Role", value: authUser?.role || "—" },
    { label: "Reference ID", value: authUser?.referenceId || "—" },
    { label: "Phone", value: authUser?.phone || "—" },
    { label: "Email", value: authUser?.email || "—" },
    { label: "Admin ID", value: authUser?.id || "—" },
  ];

  return (
    <>
      <PageMeta
        title="My Profile | Snack Admin"
        description="View authenticated admin profile details."
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          My Profile
        </h3>
        {!authUser ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Profile data is not available. Please sign in again.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {profileRows.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
