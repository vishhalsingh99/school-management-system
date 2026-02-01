import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ username: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/select-academic-year");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="School ERP"
      subtitle="Login to continue"
    >
      {error && (
        <div className="mb-4 text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <Button loading={loading}>Login</Button>
      </form>
    </AuthLayout>
  );
}
