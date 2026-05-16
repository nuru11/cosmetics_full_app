import { useCallback, useEffect, useState } from "react";
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
import InputField from "../../components/form/input/InputField";
import {
  createSeller,
  getSellers,
  updateSeller,
  type SellerListItem,
  type SellerStatus,
} from "../../services/seller.service";

function statusColor(status: SellerStatus): "success" | "warning" {
  return status === "active" ? "success" : "warning";
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<SellerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createReferenceId, setCreateReferenceId] = useState("");
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [lastCreatedRef, setLastCreatedRef] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSellers(await getSellers());
    } catch {
      setError("Failed to load sellers.");
      setSellers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleStatus = async (seller: SellerListItem) => {
    const next: SellerStatus = seller.status === "active" ? "inactive" : "active";
    try {
      const updated = await updateSeller(seller.id, { status: next });
      setSellers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch {
      setError("Failed to update seller status.");
    }
  };

  return (
    <>
      <PageMeta title="Sellers | Snack Admin" description="Manage field sellers and referral counts" />
      <PageBreadcrumb pageTitle="Sellers" />
      <div className="space-y-6">
        <ComponentCard
          title="Sellers"
          desc="Unique devices brought uses hardware fingerprint when available. Total signups may be higher if the same phone registered multiple accounts."
        >
          <div className="mb-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              Add seller
            </Button>
          </div>
          {lastCreatedRef && (
            <p className="mb-4 text-sm text-green-700 dark:text-green-400">
              New seller code: <strong>{lastCreatedRef}</strong>
            </p>
          )}
          {loading ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : sellers.length === 0 ? (
            <p className="text-sm text-gray-500">No sellers yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell isHeader>Name</TableCell>
                    <TableCell isHeader>Phone</TableCell>
                    <TableCell isHeader>Reference ID</TableCell>
                    <TableCell isHeader>Unique devices</TableCell>
                    <TableCell isHeader>Total signups</TableCell>
                    <TableCell isHeader>Status</TableCell>
                    <TableCell isHeader>Created</TableCell>
                    <TableCell isHeader>Action</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellers.map((seller) => (
                    <TableRow key={seller.id}>
                      <TableCell>{seller.name}</TableCell>
                      <TableCell>{seller.phone ?? "—"}</TableCell>
                      <TableCell>
                        <code className="text-sm font-semibold">{seller.referenceId}</code>
                      </TableCell>
                      <TableCell>{seller.userCount}</TableCell>
                      <TableCell>
                        {seller.totalSignupsWithSeller}
                        {seller.totalSignupsWithSeller > seller.userCount && (
                          <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">
                            (dup device)
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge size="sm" color={statusColor(seller.status)}>
                          {seller.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {seller.createdAt
                          ? new Date(seller.createdAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleStatus(seller)}
                        >
                          {seller.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
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
          setCreateReferenceId("");
          setCreateError(null);
        }}
      >
        <div className="max-w-md p-6 dark:bg-gray-900 rounded-3xl">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Add seller</h3>
          {createError && <p className="mb-4 text-sm text-red-500">{createError}</p>}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setCreateError(null);
              const name = createName.trim();
              if (!name) {
                setCreateError("Name is required");
                return;
              }
              setCreateSubmitting(true);
              try {
                const created = await createSeller({
                  name,
                  phone: createPhone.trim() || null,
                  referenceId: createReferenceId.trim() || undefined,
                });
                setLastCreatedRef(created.referenceId);
                setCreateOpen(false);
                setCreateName("");
                setCreatePhone("");
                setCreateReferenceId("");
                await load();
              } catch (err: unknown) {
                const ex = err as { response?: { data?: { message?: string } } };
                setCreateError(ex?.response?.data?.message || "Failed to create seller");
              } finally {
                setCreateSubmitting(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <Label>Name</Label>
              <InputField
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Seller name"
                disabled={createSubmitting}
              />
            </div>
            <div>
              <Label>Phone (optional)</Label>
              <InputField
                value={createPhone}
                onChange={(e) => setCreatePhone(e.target.value)}
                placeholder="Contact phone"
                disabled={createSubmitting}
              />
            </div>
            <div>
              <Label>Reference ID (optional)</Label>
              <InputField
                value={createReferenceId}
                onChange={(e) => setCreateReferenceId(e.target.value)}
                placeholder="Auto-generated if empty"
                disabled={createSubmitting}
              />
            </div>
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
