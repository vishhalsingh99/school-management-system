// src/pages/TeachersPage.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";

import TeacherCard from "../../components/teachers/TeacherCard";
import TeacherForm from "../../components/teachers/TeacherForm";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/teachers/list");
      setTeachers(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="text-gray-600 mt-1">Total: {teachers.length}</p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
        >
          + Add Teacher
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : teachers.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          No teachers added yet
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((t) => (
            <TeacherCard key={t.id} teacher={t} />
          ))}
        </div>
      )}

      {/* ADD MODAL */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden">
            <TeacherForm
              onClose={() => setShowAdd(false)}
              onSuccess={() => {
                setShowAdd(false);
                loadTeachers();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
