import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function FeeReceiptPage() {
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const [r, setR] = useState(null);
  const [school, setSchool] = useState(null);

  /* ======================
     LOAD RECEIPT
  ====================== */
  useEffect(() => {
    if (!paymentId) return;

    api
      .get(`/fees/payments/${paymentId}`)
      .then((res) => {
        // success() wrapper assumed
        setR(res.data.data || res.data);
      })
      .catch(() => {
        alert("Failed to load receipt");
      });
  }, [paymentId]);

  /* ======================
     LOAD SCHOOL INFO
  ====================== */
  useEffect(() => {
    api
      .get("/school")
      .then((res) => setSchool(res.data.data || res.data))
      .catch(() => setSchool(null));
  }, []);

  if (!r) {
    return <p className="p-8 text-center">Loading receipt…</p>;
  }

  return (
    <div className="receipt-print max-w-3xl mx-auto p-8 bg-white shadow">

      {/* ======================
         SCHOOL HEADER
      ====================== */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">
          {school?.name || "School Name"}
        </h1>

        {(school?.address || school?.phone) && (
          <p className="text-sm text-gray-600">
            {school?.address || "School Address"}
            {school?.phone && ` • Ph: ${school.phone}`}
          </p>
        )}

        <hr className="my-4" />
        <h2 className="text-xl font-semibold">Fee Receipt</h2>
      </div>

      {/* ======================
         STUDENT INFO
      ====================== */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <p><b>Student:</b> {r.student_name}</p>
        <p><b>Reg No:</b> {r.reg_no}</p>
        <p><b>Class:</b> {r.class_name} - {r.section_name}</p>
        <p><b>Academic Year:</b> {r.academic_year}</p>
      </div>

      {/* ======================
         PAYMENT INFO
      ====================== */}
      <div className="border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><b>Receipt No:</b> {r.receipt_no}</p>
          <p><b>Date:</b> {new Date(r.created_at).toLocaleString()}</p>
          <p><b>Paid For:</b> {r.remarks || "Fee Payment"}</p>
          <p><b>Payment Mode:</b> {r.mode.toUpperCase()}</p>
        </div>

        <div className="mt-6 p-4 bg-gray-50 border rounded text-right">
          <div className="text-sm text-gray-500">
            Total Amount Paid
          </div>
          <div className="text-2xl font-bold">
            ₹{r.amount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* ======================
         FOOTER
      ====================== */}
      <div className="text-xs text-gray-500 flex justify-between mt-10">
        <p>Collected by: Admin</p>
        <p>This is a computer generated receipt</p>
      </div>

      {/* ======================
         ACTION BUTTONS
      ====================== */}
      <div className="flex justify-end gap-3 mt-8 print-hidden">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded"
        >
          Back
        </button>

        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Print
        </button>
      </div>
    </div>
  );
}
