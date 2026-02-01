// src/components/teachers/TeacherForm.jsx
import { useState } from "react";
import api from "../../services/api";

export default function TeacherForm({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: "",
    name: "",
    department: "",
    phone: "",
    email: "",
  });

  const submit = async () => {
    if (!form.code || !form.name) {
      alert("Code and Name are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/teachers/create", {
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        department: form.department || null,
        phone: form.phone || null,
        email: form.email || null,
      });

      onSuccess?.();
    } catch (err) {
      // toast handled globally
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-xl font-bold">Add Teacher</h2>
        <button
          onClick={onClose}
          className="text-3xl font-bold text-gray-500 hover:text-red-600"
        >
          ×
        </button>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        <input
          placeholder="Teacher Code *"
          className="border px-4 py-2 rounded-lg w-full"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />

        <input
          placeholder="Full Name *"
          className="border px-4 py-2 rounded-lg w-full"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Department"
          className="border px-4 py-2 rounded-lg w-full"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
        />

        <input
          placeholder="Phone"
          className="border px-4 py-2 rounded-lg w-full"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          placeholder="Email"
          className="border px-4 py-2 rounded-lg w-full"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-4 px-6 py-4 border-t">
        <button
          onClick={onClose}
          className="px-6 py-2 border rounded-lg font-semibold"
        >
          Cancel
        </button>

        <button
          onClick={submit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
        >
          {loading ? "Saving..." : "Save Teacher"}
        </button>
      </div>
    </div>
  );
}
