import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import api from "../../services/api";

import SectionCard from "../../components/sections/SectionCard";
import AddSectionModal from "../../components/sections/AddSectionModal";
import ClassInfoCard from "../../components/sections/ClassInfoCard";

export default function ClassSectionsPage() {
  const { id } = useParams(); // class_id
  const { state } = useLocation();
  const cls = state?.cls;

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadSections = async () => {
    const res = await api.get(`/sections/list?class_id=${id}`);
    setSections(res.data.data || res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadSections();
  }, []);

  if (loading) return <div className="p-6">Loading sections...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* CLASS INFO */}
      <ClassInfoCard cls={cls} />

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sections</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl"
        >
          + Add Section
        </button>
      </div>

      {/* SECTIONS GRID */}
      {sections.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
          <p className="font-medium text-yellow-800">
            No sections created for this class.
          </p>
          <p className="text-sm text-yellow-700">
            Click “Add Section” to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {sections.map((sec) => (
            <SectionCard
              key={sec.id}
              section={sec}
              onRefresh={loadSections}
            />
          ))}
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <AddSectionModal
          classId={id}
          onClose={() => setShowAddModal(false)}
          onCreated={loadSections}
        />
      )}
    </div>
  );
}
