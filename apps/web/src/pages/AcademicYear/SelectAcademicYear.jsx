import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/ui/Button";

export default function SelectAcademicYear() {
  const navigate = useNavigate();

  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await api.get("/academic-years/list");
        const list = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        if (list.length === 0) {
          navigate("/create-academic-year", { replace: true });
        } else {
          setYears(list);
        }
      } catch {
        setError("Failed to load academic years");
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, [navigate]);

  const selectYear = async (id) => {
    try {
      await api.post("/academic-years/select", {
        academicYearId: id,
      });
      navigate("/");
    } catch {
      setError("Failed to activate academic year");
    }
  };

  const editYear = (e, year) => {
    e.stopPropagation();
    navigate(`/update-academic-year/${year.id}`, {
      state: { year },
    });
  };

  return (
    <AuthLayout
      title="Select Academic Year"
      subtitle="Choose the year you want to work on"
    >
      {loading && (
        <div className="text-center text-sm text-gray-500">
          Loading academic years…
        </div>
      )}

      {error && (
        <div className="mb-4 text-sm text-red-600 text-center">{error}</div>
      )}

      <div className="space-y-3">
        {years.map((year) => (
          <div
            key={year.id}
            onClick={() => selectYear(year.id)}
            className={`cursor-pointer rounded-xl border px-4 py-3 transition
              ${
                year.is_active
                  ? "border-blue-600 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{year.name}</p>
                <p className="text-xs text-gray-500">
                  {year.start_date} → {year.end_date}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {year.is_active && (
                  <span className="text-xs font-semibold text-green-600">
                    ACTIVE
                  </span>
                )}

                <button
                  onClick={(e) => editYear(e, year)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                  title="Edit academic year"
                >
                  ✏️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button type="button" onClick={() => navigate("/create-academic-year")}>
          Create New Academic Year
        </Button>
      </div>
    </AuthLayout>
  );
}
