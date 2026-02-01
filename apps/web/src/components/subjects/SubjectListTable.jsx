import { useEffect, useState } from "react";
import api from "../../services/api";

export default function SubjectListTable({ onSelect }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/subjects/list");
      setSubjects(res.data.data || res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* HEADER */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          Subjects
        </h2>
        <span className="text-sm text-gray-500">
          Total: {subjects.length}
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Subject Name</th>
              <th className="px-6 py-3 text-left">Code</th>
              <th className="px-6 py-3 text-center">Elective</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                  Loading subjects...
                </td>
              </tr>
            )}

            {!loading && subjects.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                  No subjects found. Create one to get started.
                </td>
              </tr>
            )}

            {subjects.map((s) => (
              <tr
                key={s.id}
                onClick={() => onSelect?.(s)}
                className="
                  cursor-pointer
                  border-t
                  hover:bg-blue-50
                  transition
                "
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {s.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {s.code}
                </td>

                <td className="px-6 py-4 text-center">
                  {s.is_elective ? (
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                      Elective
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                      Core
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER HINT */}
      <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
        Click on a subject to assign it to class & section
      </div>
    </div>
  );
}
