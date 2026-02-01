import { useEffect, useState } from "react";
import api from "../../services/api";

export default function CreateStudentModal({ onSuccess }) {
  const [loading, setLoading] = useState(false);

  const [years, setYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [form, setForm] = useState({
    reg_no: "",
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    parent_phone: "",
    address: "",

    academic_year_id: "",
    class_id: "",
    section_id: "",
    roll_no: "",
    status: "studying",
  });

  /* =========================
     LOAD INITIAL DATA
  ========================= */
  useEffect(() => {
    loadCurrentAcademicYear();
    loadClasses();
  }, []);

  const loadCurrentAcademicYear = async () => {
    const res = await api.get("/academic-years/current");
    const year = res.data.data;
    setYears([year]);
    setForm((f) => ({ ...f, academic_year_id: year.id }));
  };

  const loadClasses = async () => {
    const res = await api.get("/classes/list");
    setClasses(res.data.data || []);
  };

  const loadSections = async (classId) => {
    const res = await api.get(`/sections/list?class_id=${classId}`);
    setSections(res.data.data || []);
  };

  /* =========================
     SUBMIT
  ========================= */
  const submit = async () => {
    if (!form.reg_no || !form.first_name || !form.class_id || !form.section_id) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ CREATE STUDENT
      const studentRes = await api.post("/students/create", {
        reg_no: form.reg_no.trim(),
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        gender: form.gender,
        dob: form.dob,
        parent_phone: form.parent_phone,
        address: form.address,
      });

      const studentId = studentRes.data.data.student.id;

      // 2️⃣ ASSIGN ACADEMIC RECORD
      await api.post("/student-academics/assign", {
        student_id: studentId,
        academic_year_id: form.academic_year_id,
        class_id: form.class_id,
        section_id: form.section_id,
        roll_no: form.roll_no,
        status: form.status,
      });

      onSuccess?.();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to register student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Student Registration</h1>

      {/* ================= STUDENT DETAILS ================= */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Student Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Registration No *"
            className="border px-4 py-2 rounded-lg"
            value={form.reg_no}
            onChange={(e) => setForm({ ...form, reg_no: e.target.value })}
          />

          <input
            placeholder="First Name *"
            className="border px-4 py-2 rounded-lg"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          />

          <input
            placeholder="Last Name"
            className="border px-4 py-2 rounded-lg"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          />

          <select
            className="border px-4 py-2 rounded-lg"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            type="date"
            className="border px-4 py-2 rounded-lg"
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
          />

          <input
            placeholder="Parent Phone"
            className="border px-4 py-2 rounded-lg"
            value={form.parent_phone}
            onChange={(e) =>
              setForm({ ...form, parent_phone: e.target.value })
            }
          />
        </div>

        <textarea
          placeholder="Address"
          className="border px-4 py-2 rounded-lg w-full mt-4"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </div>

      {/* ================= ACADEMIC DETAILS ================= */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Academic Assignment</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            disabled
            className="border px-4 py-2 rounded-lg bg-gray-100"
            value={form.academic_year_id}
          >
            {years.map((y) => (
              <option key={y.id}>{y.name}</option>
            ))}
          </select>

          <select
            className="border px-4 py-2 rounded-lg"
            value={form.class_id}
            onChange={(e) => {
              const classId = e.target.value;
              setForm({ ...form, class_id: classId, section_id: "" });
              loadSections(classId);
            }}
          >
            <option value="">Select Class *</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="border px-4 py-2 rounded-lg"
            value={form.section_id}
            onChange={(e) =>
              setForm({ ...form, section_id: e.target.value })
            }
          >
            <option value="">Select Section *</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            placeholder="Roll No"
            className="border px-4 py-2 rounded-lg"
            value={form.roll_no}
            onChange={(e) => setForm({ ...form, roll_no: e.target.value })}
          />
        </div>
      </div>

      {/* ================= ACTION ================= */}
      <div className="flex justify-end">
        <button
          disabled={loading}
          onClick={submit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          {loading ? "Registering..." : "Register Student"}
        </button>
      </div>
    </div>
  );
}
