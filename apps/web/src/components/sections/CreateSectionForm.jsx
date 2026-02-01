import { useState } from "react";
import api from "../../services/api";

export default function CreateSectionForm({ classId, onCreated }) {
  const [name, setName] = useState("");

  const submit = async () => {
    if (!name.trim()) return;

    await api.post("/sections/create", {
      class_id: classId,
      name: name.trim(),
    });

    setName("");
    onCreated();
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow flex gap-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Section name (A, B, C)"
        className="border px-4 py-2 rounded-lg flex-1"
      />
      <button
        onClick={submit}
        className="bg-blue-600 text-white px-5 rounded-lg"
      >
        Add Section
      </button>
    </div>
  );
}
