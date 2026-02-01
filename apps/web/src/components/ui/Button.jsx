export default function Button({
  loading,
  disabled,
  children,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`w-full py-3 rounded-xl bg-blue-600 text-white font-semibold
        hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed
        ${className}`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
