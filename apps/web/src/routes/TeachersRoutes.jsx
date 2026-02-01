import { Route } from "react-router-dom";

import TeachersPage from "../pages/Teachers/TeachersPage";
import TeacherDetailsPage from "../pages/Teachers/TeacherDetailsPage";
// future ke liye
// import AssignTeacherSubjectsPage from "../pages/Teachers/AssignTeacherSubjectsPage";

const TeachersRoutes = [
  {
    path: "/teachers",
    element: <TeachersPage/>
  },
  {
    path: "/teachers/:id",
    element: <TeacherDetailsPage/>
  },
  // {
  //   // future
  //   // path:"/teachers/:id/assign-subjects",
  //   // element:<AssignTeacherSubjectsPage />
  // }
]

export default TeachersRoutes;