import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import ClassForm from "../../features/classes/ClassForm";
import { validateClass } from "../../features/classes/validateClass";

export default function UpdateClassPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ name: "", order_no: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.cls) {
      setForm({
        name: location.state.cls.name,
        order_no: location.state.cls.order_no,
      });
      return;
    }

    api.get(`/classes/${id}`).then((res) => {
      const cls = res.data?.data || res.data;
      setForm({ name: cls.name, order_no: cls.order_no });
    });
  }, [id, location.state]);

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
      await api.put(`/classes/${id}/update`, {
        name: form.name.trim(),
        order_no: Number(form.order_no),
      });
      navigate("/classes");
    } catch {
      setError("Failed to update class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Update Class</h1>

      <ClassForm
        form={form}
        onChange={change}
        onSubmit={submit}
        loading={loading}
        error={error}
        submitText="Update"
        onCancel={() => navigate("/classes")}
      />
    </div>
  );
}
