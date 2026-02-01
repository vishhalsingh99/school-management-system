import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AuthLayout from "../../layouts/AuthLayout";
import AcademicYearForm from "../../features/academicYear/AcademicYearForm";
import { validateAcademicYear } from "../../features/academicYear/validateAcademicYear";

export default function CreateAcademicYear() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      await api.post("/academic-years/create", form);
      navigate("/select-academic-year");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create academic year");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Academic Year"
      subtitle="Define a new academic session for your school"
    >
      <AcademicYearForm
        form={form}
        onChange={change}
        onSubmit={submit}
        loading={loading}
        error={error}
        submitText="Create Academic Year"
        onCancel={() => navigate("/select-academic-year")}
      />
    </AuthLayout>
  );
}
