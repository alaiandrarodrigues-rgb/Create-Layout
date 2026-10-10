import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import InvoiceList from "./pages/InvoiceList";
import InvoiceDetail from "./pages/InvoiceDetail";
import InvoiceForm from "./pages/InvoiceForm";
import Settings from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/invoices",
    Component: InvoiceList,
  },
  {
    path: "/invoices/new",
    Component: InvoiceForm,
  },
  {
    path: "/invoices/:id",
    Component: InvoiceDetail,
  },
  {
    path: "/invoices/:id/edit",
    Component: InvoiceForm,
  },
  {
    path: "/settings",
    Component: Settings,
  },
]);
