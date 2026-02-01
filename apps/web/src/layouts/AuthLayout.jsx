import AppFooter from "../components/AppFooter";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            {subtitle && (
              <p className="text-blue-100 mt-1">{subtitle}</p>
            )}
          </div>

          {/* BODY */}
          <div className="px-8 py-8">{children}</div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
