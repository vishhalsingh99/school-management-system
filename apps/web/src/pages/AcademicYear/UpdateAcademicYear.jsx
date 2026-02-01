import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import AuthLayout from "../../layouts/AuthLayout";
import AcademicYearForm from "../../features/academicYear/AcademicYearForm";
import { validateAcademicYear } from "../../features/academicYear/validateAcademicYear";

export default function UpdateAcademicYear() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.year) {
      const { name, start_date, end_date } = location.state.year;
      setForm({ name, start_date, end_date });
      return;
    }

    api
      .get("/academic-years/list")
      .then((res) => {
        const list = Array.isArray(res.data?.data)
          ? res.data.data
          : res.data;

        const year = list.find((y) => String(y.id) === String(id));
        if (!year) navigate("/select-academic-year");
        else {
          setForm({
            name: year.name,
            start_date: year.start_date,
            end_date: year.end_date,
          });
        }
      })
      .catch(() => navigate("/select-academic-year"));
  }, [id, location.state, navigate]);

  const change = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();

    const validationError = validateAcademicYear(form);
    if (validationError) return setError(validationError);

    try {
      setLoading(true);
      await api.put(`/academic-years/update/${id}`, form);
      navigate("/select-academic-year");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update academic year");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Update Academic Year"
      subtitle="Correct details if something was entered wrong"
    >
      <AcademicYearForm
        form={form}
        onChange={change}
        onSubmit={submit}
        loading={loading}
        error={error}
        submitText="Update Academic Year"
        onCancel={() => navigate("/select-academic-year")}
      />
    </AuthLayout>
  );
}
