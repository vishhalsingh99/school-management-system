export default function CurrentAcademicCard({ record }) {
  return (
    <div className="bg-green-50 border border-green-200 p-6 rounded-2xl">
      <h3 className="font-bold text-lg mb-2">
        Current Academic Record
      </h3>

      <p>Year: {record.academic_year}</p>
      <p>Class: {record.class_name}</p>
      <p>Section: {record.section_name}</p>
      <p>Roll No: {record.roll_no || "-"}</p>
      <p>Status: {record.status}</p>
    </div>
  );
}
