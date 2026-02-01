export default function ClassInfoCard({ cls }) {
  if (!cls) return null;

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">{cls.name}</h2>
        <p className="text-sm text-gray-500">
          Order No: {cls.order_no}
        </p>
      </div>

      <div className="text-sm text-gray-600">
        Academic Year linked
      </div>
    </div>
  );
}
