import SectionStudentsPage from "../pages/Students/SectionStudentsPage";
import { Route } from "react-router-dom";
import StudentDetailsPage from "../pages/Students/StudentDetailsPage";
// import AssignAcademicRecordPage from "../pages/Students/AssignAcademicRecordPage";


const StudentsRoutes = [
  {
    path: "/classes/:classId/sections/:sectionId/students",
    element: <SectionStudentsPage/>
  },
  {
    path: "/students/:id",
    element: <StudentDetailsPage/>
  },
  // {
  //   path:"/students/:id/assign-academics",
  //   element:<AssignAcademicRecordPage />
  // }
]

export default StudentsRoutes