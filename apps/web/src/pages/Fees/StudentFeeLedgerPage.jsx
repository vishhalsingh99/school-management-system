import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { calcTotalDue } from "../../utils/fees";

export default function StudentFeeLedgerPage() {
  const { student_id } = useParams();
  const ACADEMIC_YEAR_ID = 1;

  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/fees/ledger/${student_id}?academic_year_id=${ACADEMIC_YEAR_ID}`)
      .then((res) => setLedger(res.data))
      .finally(() => setLoading(false));
  }, [student_id]);

  const totalDue = useMemo(
    () => calcTotalDue(ledger?.dues || []),
    [ledger]
  );

  if (loading) return <div className="p-8">Loading...</div>;
  if (!ledger) return <div className="p-8 text-red-600">Not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Fee Ledger</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card label="Total Fee" value={ledger.account.total_fee} />
        <Card
          label="Paid"
          value={ledger.account.total_paid}
          color="text-green-600"
        />
        <Card label="Due" value={totalDue} color="text-red-600" />
      </div>

      {/* Dues */}
      <Section title="Dues">
        {ledger.dues.map((d) => (
          <Row
            key={d.id}
            left={`${d.component} (${d.month ?? "Yearly"})`}
            right={`₹${d.due_amount - d.paid_amount}`}
          />
        ))}
      </Section>

      {/* Payments */}
      <Section title="Payments">
        {ledger.payments.map((p) => (
          <Row
            key={p.receipt_no}
            left={`${p.receipt_no} • ${p.mode}`}
            right={`₹${p.amount}`}
            sub={new Date(p.created_at).toLocaleDateString()}
          />
        ))}
      </Section>
    </div>
  );
}

function Card({ label, value, color = "" }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>
        ₹{Number(value).toLocaleString()}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-3">
      <h2 className="text-xl font-bold">{title}</h2>
      {children.length ? children : <p className="text-gray-500">None</p>}
    </div>
  );
}

function Row({ left, right, sub }) {
  return (
    <div className="flex justify-between bg-gray-50 p-3 rounded-lg">
      <div>
        <p className="font-medium">{left}</p>
        {sub && <p className="text-sm text-gray-500">{sub}</p>}
      </div>
      <div className="font-bold">{right}</div>
    </div>
  );
}
