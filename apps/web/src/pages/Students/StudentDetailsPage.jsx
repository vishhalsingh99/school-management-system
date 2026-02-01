// src/pages/StudentDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

import AssignAcademicForm from "../../components/studentAcademics/AssignAcademicForm";
import CurrentAcademicCard from "../../components/studentAcademics/CurrentAcademicCard";
import AcademicHistoryTable from "../../components/studentAcademics/AcademicHistoryTable";
import StudentMonthlyFees from "../../components/fees/StudentMonthlyFees";

export default function StudentDetailsPage() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const [stuRes, histRes] = await Promise.all([
        api.get(`/students/${id}`),
        api.get(`/student-academics/${id}/history`),
      ]);

      setStudent(stuRes.data || null);
      setHistory(histRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const current = history.find((r) => r.is_current === 1);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6 text-center text-red-600">Student not found</div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Student Basic Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {student.first_name} {student.last_name || ""}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Registration No:
            </span>
            <span className="ml-2 text-gray-900 dark:text-white">
              {student.reg_no}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Gender:
            </span>
            <span className="ml-2 text-gray-900 dark:text-white">
              {student.gender || "-"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Date of Birth:
            </span>
            <span className="ml-2 text-gray-900 dark:text-white">
              {student.dob || "-"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Parent Phone:
            </span>
            <span className="ml-2 text-gray-900 dark:text-white">
              {student.parent_phone || "-"}
            </span>
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Address:
            </span>
            <span className="ml-2 text-gray-900 dark:text-white block mt-1">
              {student.address || "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Current Academic Record */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Current Academic Session
        </h2>
        {current ? (
          <CurrentAcademicCard record={current} onUpdate={loadData} />
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 text-center">
            <p className="text-yellow-800 dark:text-yellow-300 text-lg mb-6">
              No current academic record found. Assign class/section for this
              student.
            </p>
            <AssignAcademicForm studentId={id} onAssigned={loadData} />
          </div>
        )}
      </div>

      {/* Academic History */}
      {history.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Academic History
          </h2>
          <AcademicHistoryTable records={history} />
        </div>
      )}
      <StudentMonthlyFees student={student} academicYearId={1} />
    </div>
  );
}
