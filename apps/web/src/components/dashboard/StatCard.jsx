export default function StatCard({ title, value, icon, color }) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-xl text-white bg-gradient-to-br ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-5xl">{icon}</div>
      </div>
    </div>
  );
}
