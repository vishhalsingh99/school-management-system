export default function FeesCard({ today, pending }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-2">Fees Overview</h3>
      <p className="text-green-600">Today: ₹{today}</p>
      <p className="text-red-600">Pending: ₹{pending}</p>
    </div>
  );
}
