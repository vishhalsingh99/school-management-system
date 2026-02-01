import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ClassForm({
  form,
  onChange,
  onSubmit,
  loading,
  error,
  submitText,
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}

      <Input
        label="Class Name *"
        value={form.name}
        onChange={(e) => onChange("name", e.target.value)}
      />

      <Input
        label="Order No *"
        type="number"
        value={form.order_no}
        onChange={(e) => onChange("order_no", e.target.value)}
      />

      <div className="flex justify-end gap-4 pt-2">
        <Button
          type="button"
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button loading={loading}>
          {submitText}
        </Button>
      </div>
    </form>
  );
}
