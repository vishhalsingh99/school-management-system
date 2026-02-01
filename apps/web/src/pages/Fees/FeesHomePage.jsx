import { Link } from "react-router-dom";

export default function FeesHomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Fees</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LinkCard
          to="/fees/collect"
          title="Collect Fee"
          desc="Record student payments"
        />
        <LinkCard
          to="/fees/structure"
          title="Fee Structure"
          desc="Class-wise fee setup"
        />
      </div>
    </div>
  );
}

function LinkCard({ to, title, desc }) {
  return (
    <Link
      to={to}
      className="block bg-white p-8 rounded-2xl shadow hover:bg-gray-50"
    >
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-gray-600 mt-2">{desc}</p>
    </Link>
  );
}
