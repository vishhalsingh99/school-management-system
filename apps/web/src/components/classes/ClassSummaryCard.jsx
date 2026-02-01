export default function ClassSummaryCard({
  className,
  sectionName,
  totalStudents,
  subjects = [],
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      {/* TITLE */}
      <div>
        <h2 className="text-2xl font-bold">
          {className} – Section {sectionName}
        </h2>
        <p className="text-gray-600">
          Total Students: <b>{totalStudents}</b>
        </p>
      </div>

      {/* SUBJECTS */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">
          Subjects & Teachers
        </h3>

        {subjects.length === 0 ? (
          <p className="text-sm text-gray-500">
            No subjects assigned yet
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {subjects.map((s) => (
              <span
                key={s.id}
                className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700"
              >
                {s.subject_name}
                {s.teacher_name && ` (${s.teacher_name})`}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
