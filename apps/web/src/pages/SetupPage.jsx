import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function SetupPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    school: {
      name: "",
      address: "",
      phone: "",
    },
    admin: {
      username: "",
      password: "",
    },
  });

  const change = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.school.name || !form.admin.username || form.admin.password.length < 8) {
      setError("Please fill all required fields correctly");
      setLoading(false);
      return;
    }

    try {
      await api.post("/setup/init", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Initial Setup"
      subtitle="One-time configuration for your school"
    >
      {error && (
        <div className="mb-4 text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-8">
        {/* SCHOOL */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-3">
            School Information
          </h3>

          <div className="space-y-4">
            <Input
              label="School Name *"
              value={form.school.name}
              onChange={(e) =>
                change("school", "name", e.target.value)
              }
            />

            <Input
              label="Address"
              value={form.school.address}
              onChange={(e) =>
                change("school", "address", e.target.value)
              }
            />

            <Input
              label="Phone"
              value={form.school.phone}
              onChange={(e) =>
                change("school", "phone", e.target.value)
              }
            />
          </div>
        </section>

        {/* ADMIN */}
        <section className="pt-4 border-t">
          <h3 className="font-semibold text-gray-800 mb-3">
            Admin Account
          </h3>

          <div className="space-y-4">
            <Input
              label="Admin Email *"
              type="email"
              value={form.admin.username}
              onChange={(e) =>
                change("admin", "username", e.target.value)
              }
            />

            <Input
              label="Password *"
              type="password"
              value={form.admin.password}
              onChange={(e) =>
                change("admin", "password", e.target.value)
              }
            />
          </div>
        </section>

        <Button loading={loading}>
          Complete Setup
        </Button>
      </form>
    </AuthLayout>
  );
}
