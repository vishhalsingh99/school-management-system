// src/pages/Students/SectionStudentsPage.jsx
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../../services/api";

import StudentCard from "../../components/students/StudentCard";
import StudentListEmpty from "../../components/students/StudentListEmpty";
import StudentRegistrationForm from "../../components/students/StudentRegistrationForm";
import ClassSummaryCard from "../../components/classes/ClassSummaryCard";
import AssignClassTeacherModal from "../../components/classTeachers/AssignClassTeacherModal";

export default function SectionStudentsPage() {
  const { classId, sectionId } = useParams();
  const { state } = useLocation();

  const class_id = Number(classId);
  const section_id = Number(sectionId);

  const sectionName = state?.section?.name || "Section";

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classInfo, setClassInfo] = useState(null);

  const [classTeacher, setClassTeacher] = useState(null);
  const [showAssignCT, setShowAssignCT] = useState(false);

  const academicYearId = 1; // current year (later dynamic)

  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  /* ======================
     LOAD STUDENTS
  ====================== */
  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/students/by-class-section?class_id=${class_id}&section_id=${section_id}`,
      );
      setStudents(res.data?.data || res.data || []);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     LOAD CLASS + SUBJECTS
  ====================== */
  const loadClassDetails = async () => {
    try {
      const [classRes, subjectRes] = await Promise.all([
        api.get(`/classes/${class_id}`),
        api.get(
          `/subject-assignments/by-class?class_id=${class_id}&academic_year_id=1`,
        ),
      ]);

      setClassInfo(classRes.data?.data || classRes.data);
      setSubjects(subjectRes.data?.data || subjectRes.data || []);
    } catch {
      setClassInfo(null);
      setSubjects([]);
    }
  };

  const loadClassTeacher = async () => {
    const res = await api.get(
      `/class-teachers/current?class_id=${class_id}&section_id=${section_id}&academic_year_id=${academicYearId}`,
    );
    setClassTeacher(res.data || null);
  };

  useEffect(() => {
    if (class_id && section_id) {
      loadStudents();
      loadClassDetails();
      loadClassTeacher();
    }
  }, [class_id, section_id]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* ======================
          CLASS SUMMARY
      ====================== */}
      {classInfo && (
        <ClassSummaryCard
          className={classInfo.name}
          sectionName={sectionName}
          totalStudents={students.length}
          subjects={subjects}
        />
      )}

      {/* ======================
          HEADER
      ====================== */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Students – Section {sectionName}
          </h1>
          <p className="text-gray-600 mt-1">Total: {students.length}</p>

          {/* 👇 CLASS TEACHER BADGE */}
          {classTeacher ? (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
              👨‍🏫 Class Teacher: <b>{classTeacher.teacher_name}</b>
            </div>
          ) : (
            <div className="mt-2 text-sm text-red-500">
              No class teacher assigned
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {/* 👇 ASSIGN / CHANGE CT */}
          <button
            onClick={() => setShowAssignCT(true)}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold"
          >
            {classTeacher ? "Change Class Teacher" : "Assign Class Teacher"}
          </button>

          <button
            onClick={() => setShowAdd(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
          >
            + Add Student
          </button>
        </div>
      </div>


      {showAssignCT && (
        <AssignClassTeacherModal
          classId={class_id}
          sectionId={section_id}
          academicYearId={academicYearId}
          onClose={() => setShowAssignCT(false)}
          onAssigned={loadClassTeacher}
        />
      )}

      {/* ======================
          STUDENT LIST
      ====================== */}
      {loading ? (
        <p className="text-gray-500">Loading students...</p>
      ) : students.length === 0 ? (
        <StudentListEmpty onAddClick={() => setShowAdd(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}

      {/* ======================
          ADD STUDENT MODAL
      ====================== */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          {/* modal wrapper */}
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden">
            {/* scroll container */}
            <div className="h-full overflow-y-auto p-4">
              <StudentRegistrationForm
                defaultClassId={classId}
                defaultSectionId={sectionId}
                onSuccess={() => {
                  setShowAdd(false);
                  loadStudents();
                }}
                onClose={() => setShowAdd(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
