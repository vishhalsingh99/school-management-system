import { useEffect, useState } from "react";
import api from "../../services/api";

export default function FeeStructurePage() {
  const [classes, setClasses] = useState([]);
  const [years, setYears] = useState([]);

  const [classId, setClassId] = useState("");
  const [yearId, setYearId] = useState("");

  const [structureId, setStructureId] = useState(null);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    frequency: "monthly",
    amount: "",
    is_optional: false,
  });

  /* ======================
     LOAD MASTER DATA
  ====================== */
  useEffect(() => {
    api.get("/classes/list").then((r) => setClasses(r.data || []));
    api.get("/academic-years/list").then((r) => setYears(r.data || []));
  }, []);

  /* ======================
     LOAD / CREATE STRUCTURE
  ====================== */
  useEffect(() => {
    if (!classId || !yearId) return;

    const load = async () => {
      setLoading(true);
      try {
        // Try create (safe even if exists)
        await api.post("/fees/structures/create", {
          class_id: classId,
          academic_year_id: yearId,
        });
      } catch (_) {
        // ignore 409
      }

      // Fetch structure
      const res = await api.get(
        `/fees/structures/view?class_id=${classId}&academic_year_id=${yearId}`
      );

      setStructureId(res.data.id);
      setComponents(res.data.components || []);
      setLoading(false);
    };

    load();
  }, [classId, yearId]);

  /* ======================
     ADD COMPONENT
  ====================== */
  const addComponent = async (e) => {
    e.preventDefault();
    if (!structureId) return;

    if (!form.name || !form.amount) {
      alert("Fill all required fields");
      return;
    }

    await api.post("/fees/structures/component/add", {
      fee_structure_id: structureId,
      name: form.name,
      frequency: form.frequency,
      amount: Number(form.amount),
      is_optional: form.is_optional ? 1 : 0,
    });

    // refresh
    const res = await api.get(
      `/fees/structures/view?class_id=${classId}&academic_year_id=${yearId}`
    );
    setComponents(res.data.components || []);

    setForm({
      name: "",
      frequency: "monthly",
      amount: "",
      is_optional: false,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Fee Structure</h1>

      {/* ======================
          CLASS + YEAR SELECT
      ====================== */}
      <div className="bg-white p-6 rounded-2xl shadow grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Class"
          value={classId}
          onChange={setClassId}
          options={classes.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
        />

        <Select
          label="Academic Year"
          value={yearId}
          onChange={setYearId}
          options={years.map((y) => ({
            value: y.id,
            label: y.name,
          }))}
        />
      </div>

      {loading && <p>Loading fee structure...</p>}

      {/* ======================
          ADD COMPONENT
      ====================== */}
      {structureId && (
        <form
          onSubmit={addComponent}
          className="bg-white p-6 rounded-2xl shadow space-y-4"
        >
          <h2 className="text-xl font-bold">Add Fee Component</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              placeholder="Tuition / Transport"
            />

            <Select
              label="Frequency"
              value={form.frequency}
              onChange={(v) => setForm({ ...form, frequency: v })}
              options={[
                { value: "monthly", label: "Monthly" },
                { value: "yearly", label: "Yearly" },
                { value: "one_time", label: "One Time" },
              ]}
            />

            <Input
              label="Amount"
              type="number"
              value={form.amount}
              onChange={(v) => setForm({ ...form, amount: v })}
            />

            <div className="flex items-end gap-2">
              <input
                type="checkbox"
                checked={form.is_optional}
                onChange={(e) =>
                  setForm({ ...form, is_optional: e.target.checked })
                }
              />
              <label className="text-sm">Optional</label>
            </div>
          </div>

          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            Add Component
          </button>
        </form>
      )}

      {/* ======================
          COMPONENT LIST
      ====================== */}
      {components.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Current Components</h2>

          <div className="space-y-3">
            {components.map((c) => (
              <div
                key={c.id}
                className="flex justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-gray-500">
                    {c.frequency} • ₹{c.amount}
                  </p>
                </div>
                {c.is_optional ? (
                  <span className="text-blue-600 text-sm">Optional</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ======================
   SMALL UI HELPERS
====================== */
function Input({ label, value, onChange, ...props }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
