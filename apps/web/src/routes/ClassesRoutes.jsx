import { Route } from "react-router-dom";
import ClassesPage from "../pages/Classes/ClassesPage";
import CreateClassPage from "../pages/Classes/CreateClassPage";
import UpdateClassPage from "../pages/Classes/UpdateClassPage";
import ClassSectionPage from "../pages/Sections/ClassSectionsPage";

const ClassesRoutes = [
  {
    path: "/classes",
    element: <ClassesPage />,
  },
  {
    path: "/classes/create",
    element: <CreateClassPage />,
  },
  {
    path: "/classes/:id/update",
    element: <UpdateClassPage />,
  },
  {
    path: "/classes/:id/sections",
    element: <ClassSectionPage />,
  }
]

export default ClassesRoutes;