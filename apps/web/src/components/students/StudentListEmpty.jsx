export default function StudentListEmpty() {
  return (
    <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
      <p className="font-medium text-blue-800">
        No students found.
      </p>
      <p className="text-sm text-blue-700">
        Click “Add Student” to admit your first student.
      </p>
    </div>
  );
}
