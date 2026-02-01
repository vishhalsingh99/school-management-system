import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function AcademicYearForm({
  form,
  onChange,
  onSubmit,
  loading,
  error,
  submitText,
  onCancel,
}) {
  return (
    <>
      {error && (
        <div className="mb-4 text-sm text-red-600 text-center">{error}</div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <Input
          label="Academic Year Name *"
          placeholder="e.g. 2025–2026"
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date *"
            type="date"
            value={form.start_date}
            onChange={(e) => onChange("start_date", e.target.value)}
          />

          <Input
            label="End Date *"
            type="date"
            value={form.end_date}
            onChange={(e) => onChange("end_date", e.target.value)}
          />
        </div>

        <Button loading={loading}>{submitText}</Button>

        {onCancel && (
          <div className="text-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-blue-600 hover:underline"
            >
              ← Back to Academic Year Selection
            </button>
          </div>
        )}
      </form>
    </>
  );
}
