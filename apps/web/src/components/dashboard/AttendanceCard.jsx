export default function AttendanceCard({ title, present, absent }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-green-600">Present: {present}</p>
      <p className="text-red-600">Absent: {absent}</p>
    </div>
  );
}
