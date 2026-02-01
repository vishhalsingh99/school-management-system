export default function RecentActivities({ students }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Recently Admitted Students
      </h2>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">Reg No</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Class</th>
              <th className="px-6 py-4 text-left">Section</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {students.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                  No students yet
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{s.reg_no}</td>
                  <td className="px-6 py-4 font-medium">
                    {s.first_name} {s.last_name || ""}
                  </td>
                  <td className="px-6 py-4">{s.class_name || "-"}</td>
                  <td className="px-6 py-4">{s.section_name || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
