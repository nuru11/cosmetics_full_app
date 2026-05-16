import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";

export default function NotAuthorized() {
  return (
    <>
      <PageMeta
        title="Not Authorized | Cosmetics Admin"
        description="You do not have permission to access this page."
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Not Authorized
          </h1>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            This page is available only for super admin accounts.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
