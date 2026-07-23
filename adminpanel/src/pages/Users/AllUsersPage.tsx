import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import {
  UserListItem,
  UserStatus,
  getAllUsers,
  createUser,
  updateUserStatus,
  formatDeviceLabel,
} from "../../services/user.service";
import { getSellers, type SellerListItem } from "../../services/seller.service";
import { isSuperAdmin } from "../../utils/auth";

const STATUS_OPTIONS: UserStatus[] = ["active", "inactive"];

function statusBadgeColor(status: UserStatus): "success" | "warning" {
  return status === "active" ? "success" : "warning";
}

export default function AllUsersPage() {
  const superAdmin = isSuperAdmin();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [sellers, setSellers] = useState<SellerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createSellerRef, setCreateSellerRef] = useState("");
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const loadUsers = () => {
    setLoading(true);
    getAllUsers()
      .then(setUsers)
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
    getSellers()
      .then(setSellers)
      .catch(() => setSellers([]));
  }, []);

  const handleStatusChange = async (user: UserListItem, newStatus: UserStatus) => {
    if (user.status === newStatus) return;
    setUpdatingId(user.id);
    try {
      const updated = await updateUserStatus(user.id, newStatus);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, ...updated } : u)));
    } catch {
      setError("Failed to update user status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <PageMeta title="All Users | Snack Admin" description="Registered app users" />
      <PageBreadcrumb pageTitle="All Users" />
      <div className="space-y-6">
        <ComponentCard title="Users" desc="App customers with reference IDs and optional seller attribution.">
          <div className="mb-4">
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              Create user
            </Button>
          </div>
          {tempPassword && (
            <p className="mb-4 text-sm text-amber-700 dark:text-amber-400">
              Temporary password (share with user): <strong>{tempPassword}</strong>
            </p>
          )}
          {loading ? (
            <p className="text-sm text-gray-500">Loading users…</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-gray-500">No users yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell isHeader>Name</TableCell>
                    <TableCell isHeader>Phone</TableCell>
                    <TableCell isHeader>User ref</TableCell>
                    <TableCell isHeader>Device</TableCell>
                    <TableCell isHeader>Seller ref</TableCell>
                    <TableCell isHeader>Status</TableCell>
                    <TableCell isHeader>Joined</TableCell>
                    <TableCell isHeader>Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <code className="text-xs font-semibold">{user.referenceId}</code>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <code className="text-xs text-gray-600 dark:text-gray-400">
                            {formatDeviceLabel(user)}
                          </code>
                          {(user.sameDeviceCount ?? 1) > 1 && (
                            <Badge size="sm" color="warning">
                              Same device ({user.sameDeviceCount})
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.sellerReferenceId ? (
                          <code className="text-xs">{user.sellerReferenceId}</code>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge size="sm" color={statusBadgeColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {STATUS_OPTIONS.map((status) => (
                            <Button
                              key={status}
                              size="sm"
                              variant={user.status === status ? "primary" : "outline"}
                              disabled={updatingId === user.id || user.status === status}
                              onClick={() => handleStatusChange(user, status)}
                            >
                              {status}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </ComponentCard>
      </div>

      <Modal
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setCreateName("");
          setCreatePhone("");
          setCreatePassword("");
          setCreateSellerRef("");
          setCreateError(null);
        }}
      >
        <div className="max-w-md p-6 dark:bg-gray-900 rounded-3xl">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Create user</h3>
          {createError && <p className="mb-4 text-sm text-red-500">{createError}</p>}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setCreateError(null);
              setTempPassword(null);
              const fullName = createName.trim();
              const phone = createPhone.trim();
              if (!fullName || !phone) {
                setCreateError("Name and phone are required");
                return;
              }
              setCreateSubmitting(true);
              try {
                const created = await createUser({
                  fullName,
                  phone,
                  password: createPassword.trim() || undefined,
                  salesReferenceId: superAdmin
                    ? createSellerRef.trim() || null
                    : undefined,
                });
                if (created.temporaryPassword) {
                  setTempPassword(created.temporaryPassword);
                }
                setCreateOpen(false);
                setCreateName("");
                setCreatePhone("");
                setCreatePassword("");
                setCreateSellerRef("");
                loadUsers();
              } catch (err: unknown) {
                const ex = err as { response?: { data?: { message?: string } } };
                setCreateError(ex?.response?.data?.message || "Failed to create user");
              } finally {
                setCreateSubmitting(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <Label>Name</Label>
              <input
                type="text"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                disabled={createSubmitting}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <input
                type="tel"
                value={createPhone}
                onChange={(e) => setCreatePhone(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                disabled={createSubmitting}
              />
            </div>
            <div>
              <Label>Password (optional)</Label>
              <input
                type="password"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                placeholder="Auto-generated if empty"
                className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                disabled={createSubmitting}
              />
            </div>
            {superAdmin && (
              <div>
                <Label>Seller code (optional)</Label>
                <select
                  value={createSellerRef}
                  onChange={(e) => setCreateSellerRef(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  disabled={createSubmitting}
                >
                  <option value="">None</option>
                  {sellers
                    .filter((s) => s.status === "active")
                    .map((s) => (
                      <option key={s.id} value={s.referenceId}>
                        {s.name}
                        {s.phone ? ` · ${s.phone}` : ""} ({s.referenceId})
                      </option>
                    ))}
                </select>
              </div>
            )}
            <div className="flex gap-2 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
                disabled={createSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createSubmitting}>
                {createSubmitting ? "Creating…" : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
