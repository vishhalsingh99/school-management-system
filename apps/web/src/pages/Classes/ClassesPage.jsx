// src/pages/Classes/ClassesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/classes/list");
      setClasses(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to load classes:", err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this class?")) return;
    try {
      await api.delete(`/classes/${id}/delete`);
      loadClasses();
    } catch (err) {
      alert("Error deleting class");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Academic Classes</h1>
          <p className="text-sm text-gray-500">Total: {classes.length} entries found</p>
        </div>
        <button
          onClick={() => navigate("/classes/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2"
        >
          <span>+</span> Add Class
        </button>
      </div>

      {/* Grid - 4 columns for large screens to keep it compact */}
      {classes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No classes found. Add one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center font-bold text-sm">
                    {cls.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                      {cls.name}
                    </h3>
                    <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                      Order: {cls.order_no}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                <button
                  onClick={() => navigate(`/classes/${cls.id}/sections`, { state: { cls } })}
                  className="flex-1 text-[12px] bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-700 py-1.5 rounded-md font-medium transition-colors border border-gray-100"
                >
                  Sections
                </button>
                
                <button
                  onClick={() => navigate(`/classes/${cls.id}/update`, { state: { cls } })}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>

                <button
                  onClick={() => handleDelete(cls.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}