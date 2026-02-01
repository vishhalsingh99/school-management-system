import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();

  const academicYear = JSON.parse(
    localStorage.getItem("academicYear") || "null"
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("academicYear");
    navigate("/login");
  };

  const navItem = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-lg transition
     ${
       isActive
         ? "bg-blue-600 text-white"
         : "text-gray-300 hover:bg-gray-800 hover:text-white"
     }`;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        
        {/* LOGO */}
        <div className="h-14 flex items-center px-5 text-xl font-bold border-b border-gray-800">
          School ERP
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <NavLink to="/" className={navItem}>
            Dashboard
          </NavLink>

          <NavLink to="/subjects" className={navItem}>
            Subjects
          </NavLink>

          <NavLink to="/classes" className={navItem}>
            Classes
          </NavLink>

          <NavLink to="/teachers" className={navItem}>
            Teachers
          </NavLink>

          <NavLink to="/exams" className={navItem}>
            Exams
          </NavLink>

          <NavLink to="/fees" className={navItem}>
            Fees
          </NavLink>

          <div className="mt-6 px-4 text-xs text-gray-400 uppercase">
            Academics
          </div>

          <div className="px-4 py-2 text-gray-500 cursor-not-allowed">
            Attendance
          </div>
          <div className="px-4 py-2 text-gray-500 cursor-not-allowed">
            Fees
          </div>
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
          © 2026 School ERP
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col">
        
        {/* HEADER */}
        <header className="h-14 bg-white border-b flex items-center justify-between px-6">
          
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-800">
              School Management System
            </h1>

            {academicYear && (
              <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                AY {academicYear.name}
              </span>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={() => navigate("/select-academic-year")}
              className="text-blue-600 hover:underline"
            >
              Change Year
            </button>

            <button
              onClick={logout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
