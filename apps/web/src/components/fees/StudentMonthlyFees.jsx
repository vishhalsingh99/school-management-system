import { useEffect, useState } from "react";
import api from "../../services/api";
import CollectFeeModal from "./CollectFeeModal";

const SESSION_MONTHS = [
  { label: "April", db: 4 },
  { label: "May", db: 5 },
  { label: "June", db: 6 },
  { label: "July", db: 7 },
  { label: "August", db: 8 },
  { label: "September", db: 9 },
  { label: "October", db: 10 },
  { label: "November", db: 11 },
  { label: "December", db: 12 },
  { label: "January", db: 1 },
  { label: "February", db: 2 },
  { label: "March", db: 3 },
];

export default function StudentMonthlyFees({ student, academicYearId = 1 }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDue, setSelectedDue] = useState(null);

  const fetchData = () => {
    setLoading(true);
    api
      .get(
        `/fees/ledger/${student.id}/monthly-components?academic_year_id=${academicYearId}`
      )
      .then((res) => setRows(res.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [student.id, academicYearId]);

  const grouped = rows.reduce((acc, r) => {
    if (!acc[r.month]) acc[r.month] = [];
    acc[r.month].push(r);
    return acc;
  }, {});

  if (loading) return <p className="mt-4">Loading fees…</p>;

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-6">
      <h2 className="text-xl font-bold mb-6">
        Monthly Fees (April – March)
      </h2>

      {SESSION_MONTHS.map((m) => {
        const dues = grouped[m.db] || [];
        if (dues.length === 0) return null;

        return (
          <div key={m.db} className="mb-6">
            <h3 className="font-semibold mb-2">{m.label}</h3>

            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Component</th>
                  <th className="p-2">Due</th>
                  <th className="p-2">Paid</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {dues.map((d) => {
                  const pending = d.due_amount - d.paid_amount;
                  return (
                    <tr key={d.id} className="border-t">
                      <td className="p-2">{d.component}</td>
                      <td className="p-2 text-center">₹{pending}</td>
                      <td className="p-2 text-center">
                        ₹{d.paid_amount}
                      </td>
                      <td className="p-2 text-center">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="p-2 text-center">
                        {d.status !== "paid" ? (
                          <button
                            onClick={() => setSelectedDue(d)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                          >
                            Collect
                          </button>
                        ) : (
                          <span className="text-green-600 font-semibold">
                            Paid
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}

      {selectedDue && (
        <CollectFeeModal
          student={student}
          due={selectedDue}
          academicYearId={academicYearId}
          onClose={() => setSelectedDue(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    paid: "bg-green-100 text-green-700",
    partial: "bg-yellow-100 text-yellow-700",
    unpaid: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs ${
        map[status] || "bg-gray-100 text-gray-500"
      }`}
    >
      {status?.toUpperCase() || "—"}
    </span>
  );
}
