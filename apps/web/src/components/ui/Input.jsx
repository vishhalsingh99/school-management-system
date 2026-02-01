export default function Input({ label, error, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`w-full px-4 py-3 border rounded-xl
          focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
          ${error ? "border-red-500" : ""}`}
      />

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
