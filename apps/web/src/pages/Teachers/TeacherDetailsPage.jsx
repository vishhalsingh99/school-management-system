import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

import AssignTeacherForm from "../../components/teachers/AssignTeacherForm";

export default function TeacherDetailsPage() {
  const { id } = useParams();

  const [teacher, setTeacher] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssign, setShowAssign] = useState(false);

  const load = async () => {
    try {
      setLoading(true);

      const [tRes, aRes] = await Promise.all([
        api.get(`/teachers/${id}`),
        api.get(`/teacher-assignments/${id}`),
      ]);

      setTeacher(tRes.data);
      setAssignments(aRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!teacher) {
    return <div className="text-center py-20">Teacher not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{teacher.name}</h1>
          <p className="text-gray-600">
            Code: <b>{teacher.code}</b>
          </p>
        </div>

        <button
          onClick={() => setShowAssign(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          + Assign Subject
        </button>
      </div>

      {/* ASSIGNMENTS LIST */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Subject</th>
              <th className="text-left p-4">Class</th>
              <th className="text-left p-4">Section</th>
              <th className="text-left p-4">Academic Year</th>
            </tr>
          </thead>

          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No assignments yet
                </td>
              </tr>
            ) : (
              assignments.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-4">{a.subject}</td>
                  <td className="p-4">{a.class}</td>
                  <td className="p-4">{a.section}</td>
                  <td className="p-4">{a.academic_year}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ASSIGN MODAL */}
      {showAssign && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden">
            <AssignTeacherForm
              teacherId={id}
              onClose={() => setShowAssign(false)}
              onSuccess={() => {
                setShowAssign(false);
                load();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
