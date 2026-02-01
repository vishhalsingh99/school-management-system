import { Route } from "react-router-dom";

import FeesHomePage from "../pages/Fees/FeesHomePage";
import FeeStructurePage from "../pages/Fees/FeeStructurePage";
import StudentFeeLedgerPage from "../pages/Fees/StudentFeeLedgerPage";
import FeeReceiptPage from "../pages/Fees/FeeReceiptPage";



const FeeRoutes = [
  {
    path: "/fees",
    element: <FeesHomePage />,
  },
  {
    path: "/fees/structure",
    element: <FeeStructurePage />,
  },
  {
    path: "/fees/student/:id",
    element: <StudentFeeLedgerPage />,
  },
  {
    path: "/fees/receipt/:paymentId",
    element: <FeeReceiptPage/>
  }
];

export default FeeRoutes;