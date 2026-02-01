import { useNavigate } from "react-router-dom";

export default function StudentCard({ student }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/students/${student.id}`)}
      className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5 cursor-pointer"
    >
      <h3 className="text-lg font-bold">
        {student.first_name} {student.last_name || ""}
      </h3>

      <p className="text-sm text-gray-500">
        Reg No: {student.reg_no}
      </p>

      <p className="text-xs text-gray-400 mt-1">
        Status: {student.status || "Active"}
      </p>
    </div>
  );
}
