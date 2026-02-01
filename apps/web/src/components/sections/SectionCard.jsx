import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function SectionCard({ section, onRefresh }) {
  const navigate = useNavigate();
  const { id: classId } = useParams(); // class_id from URL

  const deleteSection = async () => {
    if (!confirm("Delete this section?")) return;
    await api.delete(`/sections/${section.id}/delete`);
    onRefresh();
  };

  const goToStudents = () => {
    navigate(
      `/classes/${classId}/sections/${section.id}/students`,
      {
        state: {
          section,
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6">
      <h3 className="text-xl font-bold">
        Section {section.name}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        Belongs to this class
      </p>

      <div className="mt-4 flex justify-between text-sm">
        <button
          onClick={goToStudents}
          className="text-blue-600 hover:underline"
        >
          View Students →
        </button>

        <button
          onClick={deleteSection}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
