import { Route } from "react-router-dom";
import ClassSectionPage from "../pages/Sections/ClassSectionsPage";

const SectionRoutes = [
  {
    path: "/sections/:id",
    element: <ClassSectionPage/>,
  }
]

export default SectionRoutes