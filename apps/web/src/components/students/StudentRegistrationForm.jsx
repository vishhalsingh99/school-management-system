// src/components/students/StudentRegistrationForm.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function StudentRegistrationForm({
  defaultClassId,
  defaultSectionId,
  onSuccess,
  onClose,
}) {
  const [loading, setLoading] = useState(false);

  /* ======================
     MASTER DATA
  ====================== */
  const [academicYear, setAcademicYear] = useState(null);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  /* ======================
     STUDENT FORM
  ====================== */
  const [student, setStudent] = useState({
    reg_no: "",
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    parent_phone: "",
    address: "",
  });

  /* ======================
     ACADEMIC FORM
  ====================== */
  const [academic, setAcademic] = useState({
    class_id: defaultClassId || "",
    section_id: defaultSectionId || "",
    roll_no: "",
    status: "studying",
  });

  /* ======================
     LOAD INITIAL DATA
  ====================== */
  useEffect(() => {
    loadCurrentAcademicYear();
    loadClasses();
  }, []);

  useEffect(() => {
    if (academic.class_id) loadSections(academic.class_id);
  }, [academic.class_id]);

  /* ======================
     API LOADERS
  ====================== */
  const loadCurrentAcademicYear = async () => {
    const res = await api.get("/academic-years/current");
    setAcademicYear(res.data.data || res.data);
  };

  const loadClasses = async () => {
    const res = await api.get("/classes/list");
    setClasses(res.data.data || res.data || []);
  };

  const loadSections = async (classId) => {
    const res = await api.get(`/sections/list?class_id=${classId}`);
    setSections(res.data.data || res.data || []);
  };

  /* ======================
     AUTO REG NO (FIXED)
  ====================== */
  useEffect(() => {
    if (!academicYear?.id) return;

    const fetchRegNo = async () => {
      try {
        const res = await api.get(
          `/students/next-reg-no?academic_year_id=${academicYear.id}`
        );

        const regNo = res?.data?.reg_no;
        if (!regNo) return;

        setStudent((prev) => ({ ...prev, reg_no: regNo }));
      } catch (err) {
        console.error("Failed to fetch reg no", err);
      }
    };

    fetchRegNo();
  }, [academicYear]);

  /* ======================
     SUBMIT
  ====================== */
  const submit = async () => {
    if (
      !student.reg_no ||
      !student.first_name ||
      !academicYear ||
      !academic.class_id ||
      !academic.section_id
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/students/create", {
        reg_no: student.reg_no,
        first_name: student.first_name.trim(),
        last_name: student.last_name?.trim() || null,
        gender: student.gender || null,
        dob: student.dob || null,
        parent_phone: student.parent_phone || null,
        address: student.address || null,

        academic_year_id: academicYear.id,
        class_id: academic.class_id,
        section_id: academic.section_id,
        roll_no: academic.roll_no || null,
      });

      onSuccess?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="flex flex-col h-full">
      {/* 🔒 STICKY HEADER */}
      <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Student Registration</h2>
          {academicYear && (
            <p className="text-sm text-gray-500">
              Academic Year: <b>{academicYear.name}</b>
            </p>
          )}
        </div>

        <button
          onClick={() => onClose?.()}
          className="text-3xl font-bold text-gray-500 hover:text-red-600"
        >
          ×
        </button>
      </div>

      {/* 🧾 SCROLLABLE FORM BODY */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {/* STUDENT DETAILS */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Student Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              readOnly
              value={student.reg_no}
              className="border px-4 py-2 rounded-lg bg-gray-100"
            placeholder="Registration No"
            />

            <select
              className="border px-4 py-2 rounded-lg"
              value={student.gender}
              onChange={(e) =>
                setStudent({ ...student, gender: e.target.value })
              }
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <input
              placeholder="First Name *"
              className="border px-4 py-2 rounded-lg"
              value={student.first_name}
              onChange={(e) =>
                setStudent({ ...student, first_name: e.target.value })
              }
            />

            <input
              placeholder="Last Name"
              className="border px-4 py-2 rounded-lg"
              value={student.last_name}
              onChange={(e) =>
                setStudent({ ...student, last_name: e.target.value })
              }
            />

            <input
              type="date"
              className="border px-4 py-2 rounded-lg"
              value={student.dob}
              onChange={(e) =>
                setStudent({ ...student, dob: e.target.value })
              }
            />

            <input
              placeholder="Parent Phone"
              className="border px-4 py-2 rounded-lg"
              value={student.parent_phone}
              onChange={(e) =>
                setStudent({ ...student, parent_phone: e.target.value })
              }
            />
          </div>

          <textarea
            placeholder="Address"
            className="border px-4 py-2 rounded-lg w-full mt-4"
            value={student.address}
            onChange={(e) =>
              setStudent({ ...student, address: e.target.value })
            }
          />
        </div>

        {/* ACADEMIC DETAILS */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Academic Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="border px-4 py-2 rounded-lg"
              value={academic.class_id}
              onChange={(e) =>
                setAcademic({
                  ...academic,
                  class_id: e.target.value,
                  section_id: "",
                })
              }
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
              value={academic.section_id}
              disabled={!sections.length}
              onChange={(e) =>
                setAcademic({ ...academic, section_id: e.target.value })
              }
            >
              <option value="">
                {sections.length ? "Select Section *" : "Select class first"}
              </option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <input
              placeholder="Roll No (optional)"
              className="border px-4 py-2 rounded-lg"
              value={academic.roll_no}
              onChange={(e) =>
                setAcademic({ ...academic, roll_no: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* 🔘 STICKY FOOTER */}
      <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-4">
        <button
          onClick={() => onClose?.()}
          className="px-6 py-2 border rounded-lg font-semibold"
        >
          Cancel
        </button>

        <button
          onClick={submit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
        >
          {loading ? "Registering..." : "Register Student"}
        </button>
      </div>
    </div>
  );
}
