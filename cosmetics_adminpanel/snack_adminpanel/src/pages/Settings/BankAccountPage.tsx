import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import InputField from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";

import {
  getBankAccounts,
  createBankAccount,
  updateBankAccount,
  setBankAccountStatus,
  BankAccount,
} from "../../services/bankAccounts.service";

const MAX_LEN = 120;
// const MAX_INST = 1000;

export default function BankAccountPage() {
  const [items, setItems] = useState<BankAccount[]>([]);
  const [editing, setEditing] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    instructions: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      setItems(await getBankAccounts());
    } catch {
      setError("Failed to load bank accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setForm({
      bankName: "",
      accountName: "",
      accountNumber: "",
      instructions: "",
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editing) {
        await updateBankAccount(editing.id, form);
      } else {
        await createBankAccount(form);
      }
      resetForm();
      await load();
    } catch {
      setError("Failed to save bank account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="Bank Accounts | Admin" description={""} />
      <PageBreadcrumb pageTitle="Bank Accounts" />

      <div className="space-y-6">
        {/* FORM */}
        <ComponentCard title={editing ? "Edit Bank Account" : "Add Bank Account"}>
          <form onSubmit={submit} className="space-y-4">
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                placeholder="Bank name"
                value={form.bankName}
                maxLength={MAX_LEN}
                onChange={(e) =>
                  setForm({ ...form, bankName: e.target.value })
                }
              />
              <InputField
                placeholder="Account name"
                value={form.accountName}
                maxLength={MAX_LEN}
                onChange={(e) =>
                  setForm({ ...form, accountName: e.target.value })
                }
              />
              <InputField
                placeholder="Account number"
                value={form.accountNumber}
                maxLength={50}
                onChange={(e) =>
                  setForm({ ...form, accountNumber: e.target.value })
                }
              />
            </div>

            <TextArea
              rows={3}
              placeholder="Instructions"
              value={form.instructions}
              onChange={(v) => setForm({ ...form, instructions: v })}
            />

            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {editing ? "Update" : "Add"}
              </Button>
              {editing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </ComponentCard>

        {/* LIST */}
        <ComponentCard title="Existing Bank Accounts">
          {loading ? (
            <p>Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-gray-500">No bank accounts added yet.</p>
          ) : (
            <div className="space-y-3">
              {items.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between border rounded p-3"
                >
                  <div>
                    <p className="font-medium">{b.bankName}</p>
                    <p className="text-sm text-gray-500">
                      {b.accountName} — {b.accountNumber}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(b);
                        setForm({
                          bankName: b.bankName,
                          accountName: b.accountName,
                          accountNumber: b.accountNumber,
                          instructions: b.instructions ?? "",
                        });
                      }}
                    >
                      Edit
                    </Button>

                   <Button
  size="sm"
  variant="outline"
  onClick={async () => {
    await setBankAccountStatus(b.id, !b.isActive);
    load();
  }}
>
  {b.isActive ? "Disable" : "Enable"}
</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}