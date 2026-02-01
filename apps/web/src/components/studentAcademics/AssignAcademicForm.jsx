import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AssignAcademicForm({ studentId, onAssigned }) {
  const [currentYear, setCurrentYear] = useState(null);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [form, setForm] = useState({
    academic_year_id: "",
    class_id: "",
    section_id: "",
    roll_no: "",
    status: "studying",
  });

  useEffect(() => {
    // ✅ FETCH CURRENT ACADEMIC YEAR (OBJECT)
    api.get("/academic-years/current").then((res) => {
      const year = res.data || null;

      if (year) {
        setCurrentYear(year);
        setForm((prev) => ({
          ...prev,
          academic_year_id: year.id,
        }));
      }
    });

    // Classes
    api.get("/classes/list").then((res) => {
      const list = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setClasses(list);
    });
  }, []);

  const loadSections = async (classId) => {
    const res = await api.get(`/sections/list?class_id=${classId}`);
    const list = Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data)
      ? res.data
      : [];
    setSections(list);
  };

  const submit = async () => {
    if (!form.class_id || !form.section_id) {
      alert("Please select class and section");
      return;
    }

    await api.post("/student-academics/assign", {
      student_id: studentId,
      ...form,
    });

    onAssigned?.();
  };

  return (
    <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl space-y-4">
      <h3 className="font-bold text-lg">
        Assign Academic Details
      </h3>

      {/* ✅ CURRENT ACADEMIC YEAR (READ ONLY) */}
      <div className="bg-white border rounded-lg px-4 py-3">
        <p className="text-sm text-gray-500">Academic Year</p>
        <p className="font-semibold">
          {currentYear
            ? currentYear.name
            : "Loading academic year..."}
        </p>
      </div>

      {/* CLASS */}
      <select
        className="border px-4 py-2 rounded-lg w-full"
        value={form.class_id}
        onChange={(e) => {
          const classId = e.target.value;
          setForm({
            ...form,
            class_id: classId,
            section_id: "",
          });
          loadSections(classId);
        }}
      >
        <option value="">Select Class</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* SECTION */}
      <select
        className="border px-4 py-2 rounded-lg w-full"
        value={form.section_id}
        onChange={(e) =>
          setForm({ ...form, section_id: e.target.value })
        }
        disabled={!sections.length}
      >
        <option value="">
          {sections.length
            ? "Select Section"
            : "Select class first"}
        </option>
        {sections.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* ROLL NO */}
      <input
        placeholder="Roll No (optional)"
        className="border px-4 py-2 rounded-lg w-full"
        value={form.roll_no}
        onChange={(e) =>
          setForm({ ...form, roll_no: e.target.value })
        }
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-5 py-2 rounded-xl"
      >
        Assign Academic Record
      </button>
    </div>
  );
}
