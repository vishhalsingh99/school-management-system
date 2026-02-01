import { useState } from "react";
import api from "../../services/api";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CollectFeeModal({
  student,
  due,
  academicYearId,
  onClose,
  onSuccess,
}) {
  const [amount, setAmount] = useState(
    due.due_amount - due.paid_amount
  );
  const [mode, setMode] = useState("cash");
  const [receiptNo] = useState(`REC-${Date.now()}`);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async () => {
    if (amount <= 0) {
      alert("Invalid amount");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/fees/payments/collect", {
        student_id: student.id,
        academic_year_id: academicYearId,
        amount,
        mode,
        receipt_no: receiptNo,
        remarks: `${due.component} fee`,
      });

      // 🔥 VERY IMPORTANT
      onSuccess?.();   // refresh table
      onClose();       // ✅ AUTO CLOSE MODAL

      // 👉 redirect to receipt page
      navigate(`/fees/receipt/${res.data.payment_id}`);
    } catch (err) {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-105 space-y-4 relative">

        {/* ❌ CUT BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold">
          Collect Fee – {due.component}
        </h2>

        <p className="text-sm text-gray-600">
          Student: {student.first_name} {student.last_name}
        </p>

        <input
          type="number"
          className="w-full border px-3 py-2 rounded"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <select
          className="w-full border px-3 py-2 rounded"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="bank">Bank</option>
          <option value="cheque">Cheque</option>
        </select>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Processing…" : "Collect"}
          </button>
        </div>
      </div>
    </div>
  );
}
