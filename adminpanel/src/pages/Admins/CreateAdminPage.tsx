import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import InputField from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import { AdminRole, createAdmin } from "../../services/admin.service";

const roleOptions = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "SALES", label: "Staff (catalog & orders)" },
];

export default function CreateAdminPage() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("SUPER_ADMIN");
  const [createdReferenceId, setCreatedReferenceId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setCreatedReferenceId(null);

    if (!username.trim() || !fullName.trim() || !password) {
      setError("Username, full name, and password are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await createAdmin({
        username: username.trim(),
        fullName: fullName.trim(),
        password,
        phone: phone.trim() || null,
        email: email.trim() || null,
        role,
      });
      setSuccess("Admin account created successfully.");
      setCreatedReferenceId(created.referenceId ?? null);
      setUsername("");
      setFullName("");
      setPassword("");
      setPhone("");
      setEmail("");
      setRole("SUPER_ADMIN");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(axiosErr?.response?.data?.error || "Failed to create admin account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Create Admin | Snack Admin"
        description="Superadmin page to create admin accounts."
      />
      <PageBreadcrumb pageTitle="Create Admin" />
      <div className="space-y-6">
        <ComponentCard title="Create new admin account">
          <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && (
              <div className="space-y-1 text-sm text-green-600">
                <p>{success}</p>
                {createdReferenceId && (
                  <p>
                    Reference ID: <span className="font-semibold">{createdReferenceId}</span>
                  </p>
                )}
              </div>
            )}

            <div>
              <Label>
                Username <span className="text-error-500">*</span>
              </Label>
              <InputField
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <Label>
                Full name <span className="text-error-500">*</span>
              </Label>
              <InputField
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <InputField
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                disabled={submitting}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Phone</Label>
                <InputField
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +2519..."
                  disabled={submitting}
                />
              </div>
              <div>
                <Label>Email</Label>
                <InputField
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@example.com"
                  disabled={submitting}
                />
              </div>
            </div>

            <div>
              <Label>
                Role <span className="text-error-500">*</span>
              </Label>
              <Select
                options={roleOptions}
                defaultValue={role}
                onChange={(value) => setRole(value as AdminRole)}
                className="dark:bg-dark-900"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={submitting || !username.trim() || !fullName.trim() || !password}
            >
              {submitting ? "Creating..." : "Create Admin"}
            </Button>
          </form>
        </ComponentCard>
      </div>
    </>
  );
}
