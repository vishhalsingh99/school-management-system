import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AssignClassTeacherModal({
  classId,
  sectionId,
  academicYearId,
  onClose,
  onAssigned,
}) {
  const [teachers, setTeachers] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/teachers/list").then((res) => {
      setTeachers(res.data || []);
    });
  }, []);

  const assign = async () => {
    if (!teacherId) return alert("Select teacher");

    try {
      setLoading(true);
      await api.post("/class-teachers/assign", {
        teacher_id: teacherId,
        class_id: classId,
        section_id: sectionId,
        academic_year_id: academicYearId,
      });
      onAssigned();
      onClose();
    } catch (err) {
      // toast via interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-bold">Assign Class Teacher</h2>

        <select
          className="w-full border px-4 py-2 rounded-lg"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
        >
          <option value="">Select Teacher</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <p className="text-sm text-gray-500">
          ⚠ A teacher can be class teacher of only one section.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button
            onClick={assign}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold"
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
