import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import NotFound from "../pages/NotFound";

import AuthRoutes from "./AuthRoutes";
import AcademicYearRoutes from "./AcademicYearRoutes";
import ClassesRoutes from "./ClassesRoutes";
import DashboardRoutes from "./DashboardRoutes";
import StudentRoutes from "./StudentsRoutes";
import TeacherRoutes from "./TeachersRoutes";
import SubjectRoutes from "./SubjectsRoutes";
import FeeRoutes from "./FeeRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      {AuthRoutes.map(({ path, element }, index) => (
        <Route key={index} path={path} element={element} />
      ))}

      {/* PROTECTED */}
      <Route element={<ProtectedRoute />}>
        {AcademicYearRoutes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}

        <Route element={<MainLayout />}>
          {DashboardRoutes.map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}
          {ClassesRoutes.map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}

          {StudentRoutes.map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}

          {TeacherRoutes.map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}
          {SubjectRoutes.map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}
             {FeeRoutes.map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
