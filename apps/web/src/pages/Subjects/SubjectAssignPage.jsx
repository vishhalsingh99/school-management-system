import { useEffect, useState } from "react";
import api from "../../services/api";

export default function SubjectAssignPage({ subject }) {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    class_id: "",
    section_id: "",
    teacher_id: "",
  });

  useEffect(() => {
    api.get("/classes/list").then((r) =>
      setClasses(r.data || [])
    );
  }, []);

  useEffect(() => {
    if (!form.class_id) {
      setSections([]);
      return;
    }
    api
      .get(`/sections/list?class_id=${form.class_id}`)
      .then((r) => setSections(r.data || []));
  }, [form.class_id]);

    useEffect(() => {
    api.get("/teachers/list").then((r) =>
      setTeachers(r.data || [])
    );
  }, []);
  const assign = async () => {
    console.log(1)
    if (!form.class_id || !form.section_id || !form.teacher_id) {
      alert("All fields required");
      return;
    }
    console.log(2)

    await api.post("/subject-assignments/assign", {
      subject_id: subject.id,
      class_id: form.class_id,
      section_id: form.section_id,
      teacher_id: form.teacher_id,
      academic_year_id: 1, // current year later auto
    });

    alert("Assigned successfully");
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">
        Assign "{subject.name}"
      </h3>

      <select
        className="border p-2 w-full mb-3"
        value={form.class_id}
        onChange={(e) =>
          setForm({ ...form, class_id: e.target.value, section_id: "" })
        }
      >
        <option value="">Select Class</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        className="border p-2 w-full mb-3"
        disabled={!sections.length}
        value={form.section_id}
        onChange={(e) =>
          setForm({ ...form, section_id: e.target.value })
        }
      >
        <option value="">Select Section</option>
        {sections.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        className="border p-2 w-full mb-3"
        value={form.teacher_id}
        onChange={(e) =>
          setForm({ ...form, teacher_id: e.target.value })
        }
      >
        <option value="">Select Teacher</option>
        {teachers.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <button
        onClick={assign}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Assign Subject
      </button>
    </div>
  );
}
