import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyFeesChart({ data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow h-80">
      <h3 className="font-semibold mb-4">
        Monthly Fees Collection (Yearly)
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="collected" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
