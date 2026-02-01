export default function AcademicHistoryTable({ records }) {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th>Year</th>
            <th>Class</th>
            <th>Section</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id}>
              <td>{r.academic_year}</td>
              <td>{r.class_name}</td>
              <td>{r.section_name}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
