// src/components/teachers/AssignTeacherForm.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AssignTeacherForm({
  teacherId,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);

  /* ======================
     MASTER DATA
  ====================== */
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [academicYear, setAcademicYear] = useState(null);

  /* ======================
     FORM STATE
  ====================== */
  const [form, setForm] = useState({
    subject_id: "",
    class_id: "",
    section_id: "",
  });

  /* ======================
     INITIAL LOAD
  ====================== */
  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    const [subRes, classRes, yearRes] = await Promise.all([
      api.get("/subjects/list"),
      api.get("/classes/list"),
      api.get("/academic-years/current"),
    ]);

    setSubjects(subRes.data.data || subRes.data || []);
    setClasses(classRes.data.data || classRes.data || []);
    setAcademicYear(yearRes.data.data || yearRes.data);
  };

  /* ======================
     LOAD SECTIONS (AFTER CLASS)
  ====================== */
  useEffect(() => {
    if (!form.class_id) {
      setSections([]);
      return;
    }

    loadSections(form.class_id);
  }, [form.class_id]);

  const loadSections = async (classId) => {
    try {
      setLoadingSections(true);
      const res = await api.get(`/sections/list?class_id=${classId}`);
      setSections(res.data.data || res.data || []);
    } finally {
      setLoadingSections(false);
    }
  };

  /* ======================
     SUBMIT
  ====================== */
  const submit = async () => {
    if (!form.subject_id || !form.class_id || !form.section_id) {
      alert("Please select subject, class and section");
      return;
    }

    try {
      setLoading(true);

      await api.post("/teacher-assignments/assign", {
        teacher_id: teacherId,
        subject_id: form.subject_id,
        class_id: form.class_id,
        section_id: form.section_id,
        academic_year_id: academicYear.id,
      });

      onSuccess?.();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "This subject is already assigned to another teacher"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="h-full flex flex-col bg-white rounded-2xl">
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-xl font-bold">Assign Subject to Teacher</h2>
        <button
          onClick={onClose}
          className="text-2xl font-bold text-gray-500 hover:text-red-600"
        >
          ×
        </button>
      </div>

      {/* BODY (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {/* Academic Year */}
        {academicYear && (
          <div className="text-sm text-gray-600">
            Academic Year:{" "}
            <b className="text-gray-900">{academicYear.name}</b>
          </div>
        )}

        {/* SUBJECT */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Subject *
          </label>
          <select
            className="border px-4 py-2 rounded-lg w-full"
            value={form.subject_id}
            onChange={(e) =>
              setForm({ ...form, subject_id: e.target.value })
            }
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* CLASS */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Class *
          </label>
          <select
            className="border px-4 py-2 rounded-lg w-full"
            value={form.class_id}
            onChange={(e) =>
              setForm({
                ...form,
                class_id: e.target.value,
                section_id: "", // reset section
              })
            }
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* SECTION */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Section *
          </label>
          <select
            className="border px-4 py-2 rounded-lg w-full"
            disabled={!form.class_id || loadingSections}
            value={form.section_id}
            onChange={(e) =>
              setForm({ ...form, section_id: e.target.value })
            }
          >
            <option value="">
              {loadingSections
                ? "Loading sections..."
                : !form.class_id
                ? "Select class first"
                : "Select Section"}
            </option>

            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-6 py-4 border-t flex justify-end gap-4">
        <button
          onClick={onClose}
          className="border px-6 py-2 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={submit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          {loading ? "Assigning..." : "Assign"}
        </button>
      </div>
    </div>
  );
}
