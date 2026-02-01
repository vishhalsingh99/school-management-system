// src/components/fees/FeeDueTable.jsx
export default function FeeDueTable({ dues }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">
        Fee Dues
      </h2>

      {dues.length === 0 ? (
        <p className="text-gray-500">
          No pending dues 🎉
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Month</th>
              <th className="p-2">Component</th>
              <th className="p-2">Due</th>
              <th className="p-2">Paid</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {dues.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-2">{d.month}</td>
                <td className="p-2 text-center">
                  {d.fee_head}
                </td>
                <td className="p-2 text-center">
                  ₹{d.due_amount}
                </td>
                <td className="p-2 text-center">
                  ₹{d.paid_amount}
                </td>
                <td className="p-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      d.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : d.status === "partial"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
