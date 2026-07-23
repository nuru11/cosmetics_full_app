import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthRoute from "./routes/AuthRoute";
import NotAuthorized from "./pages/OtherPage/NotAuthorized";
import Home from "./pages/Dashboard/Home";
import ProductsPage from "./pages/Products/ProductsPage";
import CategoriesPage from "./pages/Categories/CategoriesPage";
import OrdersPage from "./pages/Orders/OrdersPage";
import OrderDetailPage from "./pages/Orders/OrderDetailPage";
import ProductRequestsPage from "./pages/ProductRequests/ProductRequestsPage";

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/product-requests" element={<ProductRequestsPage />} />
            <Route path="/not-authorized" element={<NotAuthorized />} />
          </Route>
        </Route>

        <Route element={<AuthRoute />}>
          <Route path="/signin" element={<SignIn />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
