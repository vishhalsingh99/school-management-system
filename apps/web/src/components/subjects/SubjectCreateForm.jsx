import { useState } from "react";
import api from "../../services/api";

export default function SubjectCreateForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    is_elective: false,
  });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name || !form.code) {
      alert("Name and code required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/subjects/create", form);
      setForm({ name: "", code: "", is_elective: false });
      onCreated?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold">Create Subject</h2>

      <input
        placeholder="Subject Name"
        className="border p-2 w-full rounded"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Subject Code"
        className="border p-2 w-full rounded"
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value })}
      />

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={form.is_elective}
          onChange={(e) =>
            setForm({ ...form, is_elective: e.target.checked })
          }
        />
        Elective Subject
      </label>

      <button
        onClick={submit}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Saving..." : "Create Subject"}
      </button>
    </div>
  );
}
