import { useNavigate } from "react-router-dom";

export default function TeacherCard({ teacher }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/teachers/${teacher.id}`)}
      className="bg-white rounded-2xl shadow p-5 space-y-2 cursor-pointer hover:shadow-lg"
    >
      <h3 className="text-lg font-bold">{teacher.name}</h3>
      <p className="text-sm text-gray-500">Code: {teacher.code}</p>
      {teacher.department && (
        <p className="text-sm text-gray-600">
          Dept: {teacher.department}
        </p>
      )}
    </div>
  );
}
