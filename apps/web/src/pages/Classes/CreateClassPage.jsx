import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import ClassForm from "../../features/classes/ClassForm";
import { validateClass } from "../../features/classes/validateClass";

export default function CreateClassPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", order_no: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const change = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();

    const err = validateClass(form);
    if (err) return setError(err);

    try {
      setLoading(true);
      await api.post("/classes/create", {
        name: form.name.trim(),
        order_no: Number(form.order_no),
      });
      navigate("/classes");
    } catch {
      setError("Failed to create class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Create Class</h1>

      <ClassForm
        form={form}
        onChange={change}
        onSubmit={submit}
        loading={loading}
        error={error}
        submitText="Create"
        onCancel={() => navigate("/classes")}
      />
    </div>
  );
}
