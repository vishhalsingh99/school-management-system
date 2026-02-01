export default function AppFooter() {
  return (
    <footer className="py-4 text-center text-xs text-gray-500">
      <div className="flex items-center justify-center gap-2">
        <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center font-bold">
          ERP
        </div>
        <span className="font-medium">ShikshaTech Solutions</span>
      </div>
      <p className="mt-1">
        © {new Date().getFullYear()} • Smart ERP for Indian Schools 🇮🇳
      </p>
    </footer>
  );
}
