import { useState } from "react";
import api from "../../services/api";

export default function AddSectionModal({ classId, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim()) return;

    setLoading(true);
    await api.post("/sections/create", {
      class_id: classId,
      name: name.trim(),
    });

    setLoading(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">
          Add New Section
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Section name (A, B, C)"
          className="border px-4 py-2 rounded-lg w-full mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
