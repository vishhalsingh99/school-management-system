import { Route } from "react-router-dom";
import CreateAcademicYear from "../pages/AcademicYear/CreateAcademicYear";
import SelectAcademicYear from "../pages/AcademicYear/SelectAcademicYear";
import UpdateAcademicYear from "../pages/AcademicYear/UpdateAcademicYear";

const AcademicYearRoutes = [
  {
    path: "/create-academic-year",
    element: <CreateAcademicYear />,
  },
  {
    path: "/select-academic-year",
    element: <SelectAcademicYear />,
  }, 
  {
    path: "/update-academic-year/:id",
    element: <UpdateAcademicYear />, 
  }
];

export default AcademicYearRoutes;