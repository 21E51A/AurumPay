import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Coins from "../pages/admin/Coins";
import Revenue from "../pages/admin/Revenue";
import CoinOrders from "../pages/admin/CoinOrders";
import Pricing from "../pages/admin/Pricing";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../guards/ProtectedRoute";
import Jewellery from "../pages/admin/Jewellery";


const AppRoutes = () => {
  return (
    <Routes>

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* ================= ADMIN ROUTES ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="coins" element={<Coins />} />
        <Route path="orders" element={<CoinOrders />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="pricing" element={<Pricing />} />  {/* ✅ FIXED */}
        <Route path="jewellery" element={<Jewellery />} />

      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;
