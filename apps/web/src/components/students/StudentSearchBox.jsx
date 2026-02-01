// src/components/fees/StudentSearchBox.jsx
import { useState } from "react";
import api from "../../services/api";

export default function StudentSearchBox({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = async (q) => {
    setQuery(q);
    if (q.length < 2) return setResults([]);

    const res = await api.get(`/students/search?q=${q}`);
    setResults(res.data || []);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-semibold mb-3">Search Student</h2>

      <input
        value={query}
        onChange={(e) => search(e.target.value)}
        placeholder="Search by name / reg no"
        className="border px-4 py-2 rounded-lg w-full"
      />

      {results.length > 0 && (
        <ul className="mt-3 border rounded-lg max-h-60 overflow-auto">
          {results.map((s) => (
            <li
              key={s.id}
              onClick={() => {
                onSelect(s);
                setResults([]);
                setQuery(`${s.first_name} (${s.reg_no})`);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {s.first_name} {s.last_name} – {s.reg_no}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
